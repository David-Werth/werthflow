import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusSquare } from 'lucide-react';
import { arrayMove } from '@dnd-kit/sortable';
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

import { Folder } from '@/types/folder';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { UserDataContext } from '@/providers/user-data-provider';
import AddSortableModal from '@/pages/main/home-page/modals/add-sortable-modal';
import AddItemModal from '@/pages/main/home-page/modals/add-item-modal';
import SortableCard from '@/pages/main/home-page/dnd-components/sortable-card';

export default function Board() {
	const { userData, setUserData } = useContext(UserDataContext);
	const [folder, setFolder] = useState<Folder>({} as Folder);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isSortableModalOpen, setIsSortableModalOpen] = useState(false);
	const [isFolderEmpty, setIsFolderEmpty] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const activeFolderId = location.pathname.replace('/', '');

	useEffect(() => {
		// Find the selected folder based on the activeFolderId
		const selectedFolder = userData.folders?.find(
			(folder) => folder.id.toString() === activeFolderId
		);

		// If the selected folder is not found, navigate to the default route
		if (!selectedFolder) navigate('/');

		// Update the component state with the selected folder and check if it's empty
		setFolder(selectedFolder || ({} as Folder));
		setIsFolderEmpty(selectedFolder?.sortables.length === 0);
	}, [location.pathname, userData]);

	useEffect(() => {
		// Update task locations in the db
		const moveTasks = async () => {
			// Extract all of the folders tasks into new array
			let updatedTasks: Task[] = [];
			folder.sortables.forEach((s) =>
				s.tasks.forEach((t) => updatedTasks.push(t))
			);
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

	// Helper function to find the container ID for a given task ID
	const findContainer = (id: string) => {
		let containerId: string = id;

		folder.sortables.forEach((sortable) => {
			if (sortable.tasks.some((task) => task.id === id)) {
				containerId = sortable.id;
			}
		});
		return containerId;
	};

	// Helper function to update task indexes and sortable IDs
	const updateIndexesAndSortableId = (
		array: Task[],
		sortableId: string
	): Task[] =>
		array.map((item, index) => ({ ...item, index, sortableId: sortableId }));

	// Update the tasks for a specific container within the user data
	const updateItemsForContainer = (
		containerId: string,
		updatedTasks: Task[]
	) => {
		const folderIndex = userData.folders.indexOf(folder);

		// Create a copy of the user data folders with updated tasks for the specified container
		const updatedFolders = userData.folders.map((f) => {
			// Check if the current folder matches the one being updated
			if (f.id === folder.id) {
				// Update sortables within the current folder
				const updatedSortables = f.sortables.map((sortable) => {
					// Check if the sortable container matches the one being updated
					if (sortable.id === containerId) {
						// Update tasks for the specified container with new indexes and sortable ID
						return {
							...sortable,
							tasks: updateIndexesAndSortableId(updatedTasks, sortable.id),
						};
					}
					return {
						...sortable,
						tasks: updateIndexesAndSortableId(sortable.tasks, sortable.id),
					};
				});

				// Return an updated folder with modified sortables
				return {
					...f,
					sortables: updatedSortables,
				};
			}
			// Return other folders unchanged
			return f;
		});

		setFolder(updatedFolders[folderIndex]);
		setUserData({
			...userData,
			folders: updatedFolders,
		});
	};

	// Event handler for drag end, called when a draggable element is dropped
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		const activeId = active.id as string;
		const overId = over?.id as string;
		const currentContainer = findContainer(activeId);

		// Check if there's a potential drop target, the container is different, and the task is dropped on a different container
		if (over && currentContainer && activeId !== overId) {
			const sortable = folder.sortables.find((s) => s.id === currentContainer);

			if (sortable) {
				const { tasks } = sortable;

				const oldIndex = tasks.findIndex((task) => task.id === activeId);
				const newIndex = tasks.findIndex((task) => task.id === overId) || 0;

				const updatedTasks = arrayMove(tasks, oldIndex, newIndex);

				updateItemsForContainer(currentContainer, updatedTasks);
			}
		}
	};

	// Event handler for drag over, called when a draggable element is dragged over a potential drop target
	const handleDragOver = (event: DragOverEvent) => {
		const overId = event.over?.id as string;
		const activeId = event.active.id as string;

		// Check if there's a potential drop target (overId)
		if (overId) {
			const overSortable = findContainer(overId);
			const activeSortable = findContainer(activeId);

			// Check if the drop target is valid
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

			// Calculate the new index for the active task within the potential drop target tasks
			const newIndex =
				overTaskIndex >= 0 ? overTaskIndex + 1 : overTasks.length + 1;

			const currentFolder = { ...folder };

			// Update the tasks array for the active sortable container with the new indexes and sortable IDs
			currentFolder.sortables[activeSortableIndex].tasks =
				updateIndexesAndSortableId(
					[
						...activeTasks.slice(0, activeTaskIndex),
						...activeTasks.slice(activeTaskIndex + 1),
					],
					activeSortable
				);

			// Update the tasks array for the potential drop target sortable container
			currentFolder.sortables[overSortableIndex].tasks =
				updateIndexesAndSortableId(
					[
						...overTasks.slice(0, newIndex),
						...activeTasks.slice(activeTaskIndex, activeTaskIndex + 1),
						...overTasks.slice(newIndex),
					],
					overSortable
				);

			// Create a copy of the user data folders with the updated current folder
			const updatedFolders = userData.folders.map((f) =>
				f.id === folder.id ? currentFolder : f
			);

			// Update the component state with the modified folder and user data
			setFolder(updatedFolders[userData.folders.indexOf(folder)]);
			setUserData({ ...userData, folders: updatedFolders });
		}
	};

	return (
		<>
			{activeFolderId ? (
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

					<div className="z-0 flex flex-col items-center w-full px-6 pt-10 overflow-auto md:items-start md:pt-20 md:pb-6 pb-14 lg:px-14 shrink-0 sm:shrink">
						<div className="flex flex-col max-w-full gap-5 xl:max-w-none w-fit">
							<h1 className="text-3xl font-bold break-all">{folder.title}</h1>
							<div className="flex self-start gap-4">
								{!isFolderEmpty && (
									<Button onClick={() => setIsAddModalOpen(true)}>
										Add Task
										<PlusSquare className="h-4 ml-1" />
									</Button>
								)}

								<Button
									variant={'outline'}
									onClick={() => setIsSortableModalOpen(true)}
								>
									Add Column
									<PlusSquare className="h-4 ml-1" />
								</Button>
							</div>
							<div className="flex flex-col gap-5 md:flex-row">
								{folder.sortables &&
									folder.sortables.map((sortable) => (
										<SortableCard sortable={sortable} key={sortable.id} />
									))}
							</div>
						</div>
					</div>
				</DndContext>
			) : (
				<div className="flex flex-col items-center justify-center w-full h-full gap-4 px-6 text-center">
					<h1 className="text-4xl font-bold sm:text-6xl md:text-8xl">Welcome!</h1>
					<h1 className="text-xl font-bold sm:text-2xl md:text-4xl">
						You can create a new folder over here
					</h1>
					<ArrowLeft className="inline mr-3 animate-pulse" />
				</div>
			)}
		</>
	);
}
