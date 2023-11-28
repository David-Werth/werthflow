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
import { Button } from '@/components/ui/button';
import { UserDataContext } from '@/components/providers/user-data-provider';
import { Folder } from '@/lib/types/folder';
import { Task } from '@/lib/types/task';
import AddSortableModal from './add-sortable-modal';
import SortableCard from './sortable-card';

export default function Board() {
	const [folder, setFolder] = useState<Folder>({} as Folder);
	const { userData, setUserData } = useContext(UserDataContext);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isSortableModalOpen, setIsSortableModalOpen] = useState(false);
	const [isFolderEmpty, setIsFolderEmpty] = useState(false);
	const location = useLocation();
	const activeFolderId = location.pathname.replace('/', '');

	// Effect hook to update the selected folder when the location changes
	useEffect(() => {
		const selectedFolder = userData.folders?.find(
			(folder) => folder.id.toString() === activeFolderId
		);
		setFolder(selectedFolder || ({} as Folder));
		setIsFolderEmpty(selectedFolder?.sortables.length === 0);
	}, [location.pathname, userData]);

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

	useEffect(() => {
		const moveTasks = async () => {
			console.log('moved');
			let updatedTasks: Task[] = [];
			folder.sortables.forEach((s) =>
				s.tasks.forEach((t) => updatedTasks.push(t))
			);
			console.log(updatedTasks);
			try {
				await fetch(`${import.meta.env.VITE_API_URL}/folder/${activeFolderId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedTasks),
				});
			} catch (error) {
				console.error('Error updating tasks:', error);
			}
		};
		if (folder.sortables) moveTasks();
	}, [userData]);

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
	const updateIndexesAndSortableId = (
		array: Task[],
		sortableId: string
	): Task[] =>
		array.map((item, index) => ({ ...item, index, sortableId: sortableId }));

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
							tasks: updateIndexesAndSortableId(updatedArray, sortable.id),
						};
					}
					return {
						...sortable,
						tasks: updateIndexesAndSortableId(sortable.tasks, sortable.id),
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

	// Handle drag over events for reordering tasks between containers (sortables)
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

			// Update tasks for both the active and over containers (sortables)
			const currentFolder = folder;
			currentFolder.sortables[activeSortableIndex].tasks =
				updateIndexesAndSortableId(
					[
						...activeTasks.slice(0, activeTaskIndex),
						...activeTasks.slice(activeTaskIndex + 1),
					],
					activeSortable
				);
			currentFolder.sortables[overSortableIndex].tasks =
				updateIndexesAndSortableId(
					[
						...overTasks.slice(0, newIndex),
						...activeTasks.slice(activeTaskIndex, activeTaskIndex + 1),
						...overTasks.slice(newIndex),
					],
					overSortable
				);

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
			{isSortableModalOpen && (
				<AddSortableModal setIsSortableModalOpen={setIsSortableModalOpen} />
			)}

			<div className="flex flex-col items-center w-full max-w-full px-5pt-14 md:pt-28 md:pb-0 pb-14">
				<div className="flex flex-col max-w-full gap-5 w-fit">
					<div className="flex gap-4">
						{!isFolderEmpty && (
							<Button onClick={() => setIsAddModalOpen(true)}>
								Add Task
								<PlusSquare className="h-4 ml-1" />
							</Button>
						)}

						<Button variant={'outline'} onClick={() => setIsSortableModalOpen(true)}>
							Add Column
							<PlusSquare className="h-4 ml-1" />
						</Button>
					</div>
					<div className="flex flex-col justify-center max-w-full gap-5 w-fit xl:flex-row">
						{folder.sortables &&
							folder.sortables.map((sortable) => (
								<SortableCard sortable={sortable} key={sortable.id} />
							))}
					</div>
				</div>
			</div>
		</DndContext>
	);
}
