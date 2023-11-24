import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { PlusSquare } from 'lucide-react';

import AddItemModal from '@/components/main/add-item-modal';
import { Button } from '../ui/button';
import { UserDataContext } from '../providers/user-data-provider';
import Sortable from './sortable';
import { Folder } from '@/lib/types/folder';
import { Task } from '@/lib/types/task';

export default function Board() {
	const [folder, setFolder] = useState<Folder>({} as Folder);
	const { userData, setUserData } = useContext(UserDataContext);
	const location = useLocation();
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	// Effect hook to update the selected folder when the location changes
	useEffect(() => {
		const selectedFolder = userData.folders?.find(
			(folder) => folder.id.toString() === location.pathname.replace('/', '')
		);
		setFolder(selectedFolder || ({} as Folder));
	}, [location.pathname, userData.folders]);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 200,
				tolerance: 6,
			},
		})
	);

	// Function to find the container (sortable) of a given task id
	const findContainer = (id: string) => {
		let containerId: string = id;
		folder.sortables.forEach((sortable) => {
			if (sortable.tasks.some((task) => task.id === id)) {
				containerId = sortable.id;
			}
		});
		return containerId;
	};

	// Utility function to update the index property of tasks
	const updateIndexes = (array: Task[]): Task[] =>
		array.map((item, index) => ({ ...item, index }));

	// Update tasks for a specific container (sortable) in the folder
	const updateItemsForContainer = (
		containerId: string,
		updatedArray: Task[]
	) => {
		const folderIndex = userData.folders.indexOf(folder);

		const updatedFolders = userData.folders.map((f) => {
			if (f.id === folder.id) {
				const updatedSortables = f.sortables.map((sortable) => {
					if (sortable.id === containerId) {
						return {
							...sortable,
							tasks: updateIndexes(updatedArray),
						};
					}
					return {
						...sortable,
						tasks: updateIndexes(sortable.tasks),
					};
				});

				return {
					...f,
					sortables: updatedSortables,
				};
			}
			return f;
		});

		setFolder(updatedFolders[folderIndex]);
		setUserData({
			...userData,
			folders: updatedFolders,
		});
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		const activeId = active.id as string;
		const overId = over?.id as string;

		const currentContainer = findContainer(activeId);

		// Check if the drag is between different containers (sortables)
		if (over && currentContainer && activeId !== overId) {
			const sortable = folder.sortables.find((s) => s.id === currentContainer);
			if (sortable) {
				const { tasks } = sortable;
				const oldIndex = tasks.findIndex((task) => task.id === activeId);
				const newIndex = tasks.findIndex((task) => task.id === overId) || 0;

				const updatedArray = arrayMove(tasks, oldIndex, newIndex);
				updateItemsForContainer(currentContainer, updatedArray);
			}
		}
	};

	// Handle drag over events for reordering tasks between containers
	const handleDragOver = (event: DragOverEvent) => {
		const overId = event.over?.id as string;
		const activeId = event.active.id as string;

		if (overId) {
			const overSortable = findContainer(overId);
			const activeSortable = findContainer(activeId);

			// Check if the drag is between different containers (sortables)
			if (!overSortable || !activeSortable || overSortable === activeSortable) {
				return;
			}

			const overSortableIndex = folder.sortables.findIndex(
				(sortable) => sortable.id === overSortable
			);
			const activeSortableIndex = folder.sortables.findIndex(
				(sortable) => sortable.id === activeSortable
			);

			const overTasks = folder.sortables[overSortableIndex]?.tasks || [];
			const activeTasks = folder.sortables[activeSortableIndex]?.tasks || [];

			const overTaskIndex = overTasks.findIndex((task) => task.id === overId);
			const activeTaskIndex = activeTasks.findIndex(
				(task) => task.id === activeId
			);

			const newIndex =
				overTaskIndex >= 0 ? overTaskIndex + 1 : overTasks.length + 1;

			// Update tasks for both the active and over containers
			const currentFolder = folder;
			currentFolder.sortables[activeSortableIndex].tasks = [
				...activeTasks.slice(0, activeTaskIndex),
				...activeTasks.slice(activeTaskIndex + 1),
			];
			currentFolder.sortables[overSortableIndex].tasks = [
				...overTasks.slice(0, newIndex),
				...activeTasks.slice(activeTaskIndex, activeTaskIndex + 1),
				...overTasks.slice(newIndex),
			];

			// Update the state with the modified folders
			const updatedFolders = userData.folders.map((f) =>
				f.id === folder.id ? currentFolder : f
			);
			setFolder(updatedFolders[userData.folders.indexOf(folder)]);
			setUserData({ ...userData, folders: updatedFolders });
		}
	};

	return (
		<DndContext
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			sensors={sensors}
			collisionDetection={closestCenter}
		>
			{isAddModalOpen && <AddItemModal setIsAddModalOpen={setIsAddModalOpen} />}

			<div className="flex flex-col items-center w-full max-w-full px-5 pt-14 md:pt-28 md:pb-0 pb-14">
				<div className="flex flex-col max-w-full gap-5 w-fit">
					<Button className="w-fit" onClick={() => setIsAddModalOpen(true)}>
						Add Task
						<PlusSquare className="h-4 ml-1" />
					</Button>
					<div className="flex flex-col justify-center max-w-full gap-5 w-fit xl:flex-row">
						{folder.sortables &&
							folder.sortables.map((sortable) => {
								return <Sortable sortable={sortable} key={sortable.id} />;
							})}
					</div>
				</div>
			</div>
		</DndContext>
	);
}
