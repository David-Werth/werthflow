import AddItemModal from '@/components/main/add-item-modal';

import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	closestCenter,
	DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { useContext, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { PlusSquare } from 'lucide-react';
import { UserDataContext } from '../providers/user-data-provider';
import { useLocation } from 'react-router-dom';
import Sortable from './sortable';
import { Folder } from '@/lib/types/folder';
import { Task } from '@/lib/types/task';

export default function Board() {
	const [folder, setFolder] = useState<Folder>({} as Folder);

	const { userData, setUserData } = useContext(UserDataContext);

	const location = useLocation();

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	useEffect(() => {
		if (userData.folders) {
			userData.folders.filter((folder) => {
				if (folder.id.toString() === location.pathname.replace('/', ''))
					setFolder(folder);
			});
		}
	}, [location.pathname]);

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

	/*
	 * Function to find the container of a dragged item based on its ID
	 */

	const findContainer = (id: string) => {
		let containerId: string = '';
		folder.sortables.map((sortable) => {
			if (sortable.tasks.some((task) => task.id === id)) {
				containerId = sortable.id;
			}
		});
		return containerId;
	};
	/*
	 * Function to update items array for a specified container
	 */
	const updateItemsForContainer = (
		containerId: string,
		updatedArray: Task[]
	) => {
		const folderIndex = userData.folders.indexOf(folder);

		const updatedFolders = userData.folders.map((f) => {
			if (f.id === folder.id) {
				// Find the sortable
				const updatedSortables = f.sortables.map((sortable) => {
					if (sortable.id === containerId) {
						// Update the tasks
						return {
							...sortable,
							tasks: updatedArray,
						};
					}
					return sortable;
				});

				// Update the folder with the updated sortables
				return {
					...f,
					sortables: updatedSortables,
				};
			}
			return f;
		});

		// Update the user with the updated folders and set current folder
		setFolder(updatedFolders[folderIndex]);
		setUserData({
			...userData,
			folders: updatedFolders,
		});
	};

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const activeId = active.id as string;
		const overId = over?.id as string;

		const currentContainer = findContainer(activeId);

		// Check if there is a drop target and a valid container
		if (over && currentContainer) {
			// Check if the item is moved to a different container
			if (activeId !== overId) {
				// Find the index of the dragged item in the source container
				const oldIndex = folder.sortables
					.filter((sortable) => sortable.id === currentContainer)[0]
					.tasks.findIndex((task) => task.id === activeId);

				// Find the index of the drop target item in the destination container
				const newIndex = folder.sortables
					.filter((sortable) => sortable.id === currentContainer)[0]
					.tasks.findIndex((task) => task.id === overId);

				// Move the dragged item to the new position in the array
				const updatedArray = arrayMove(
					folder.sortables.filter((sortable) => sortable.id === currentContainer)[0]
						.tasks,
					oldIndex,
					newIndex
				);

				// Update the items array based on the current container
				updateItemsForContainer(currentContainer, updatedArray);
			}
		}
	}

	function handleDragOver(event: DragOverEvent) {
		const overId = event.over?.id as string;
		const activeId = event.active.id as string;

		if (overId) {
			// Finding containers for the active and over items
			const overSortable = findContainer(overId);
			const activeSortable = findContainer(activeId);

			const overSortableIndex = folder.sortables.findIndex(
				(sortable) => sortable.id === overSortable
			);
			const activeSortableIndex = folder.sortables.findIndex(
				(sortable) => sortable.id === activeSortable
			);

			if (!overSortable || !activeSortable) {
				return;
			}

			// Moving the dragged item to a different container if needed
			if (overSortable !== activeSortable) {
				const overTasks = folder.sortables[overSortableIndex].tasks;
				const activeTasks = folder.sortables[activeSortableIndex].tasks;

				const overTaskIndex = overTasks.findIndex((task) => task.id === overId);
				const activeTaskIndex = activeTasks.findIndex(
					(task) => task.id === activeId
				);

				let newIndex: number;

				const isBelowOverItem =
					event.over &&
					event.active.rect.current.translated &&
					event.active.rect.current.translated.top >
						event.over.rect.top + event.over.rect.height;

				const modifier = isBelowOverItem ? 1 : 0;

				newIndex =
					overTaskIndex >= 0 ? overTaskIndex + modifier : overTasks.length + 1;

				// Update the items with the dragged item moved to the new container and position

				// console.log({
				// 	...folder.sortables,
				// 	folder.sortables[activeSortableIndex]: activeTasks.filter((task) => task.id !== activeId),
				// });

				console.log(
					folder.sortables.map((sortable) => {
						return sortable.tasks;
					})
				);

				// const updatedFolders = userData.folders.map((f) => {
				// 	if (f.id === folder.id) {
				// 		// Find the sortable
				// 		const updatedSortables = f.sortables.map((sortable) => {
				// 			if (sortable.id === containerId) {
				// 				// Update the tasks
				// 				return {
				// 					...sortable,
				// 					tasks: updatedArray,
				// 				};
				// 			}
				// 			return sortable;
				// 		});

				// 		// Update the folder with the updated sortables
				// 		return {
				// 			...f,
				// 			sortables: updatedSortables,
				// 		};
				// 	}
				// 	return f;
				// });

				// items[activeContainer as keyof Items].filter(
				// 	(item) => item.id !== activeId
				// ),

				// [overSortableIndex]: [
				// 	...items[overContainer as keyof Items].slice(0, newIndex),
				// 	items[activeContainer as keyof Items][activeIndex],
				// 	...items[overContainer as keyof Items].slice(
				// 		newIndex,
				// 		items[overContainer as keyof Items].length
				// 	),
				// ],

				// 		setItems((items) => {
				// 			const activeItems = items[activeContainer as keyof Items];
				// 			const overItems = items[overContainer as keyof Items];

				// 			// Finding the index of the over and active items
				// 			const overIndex = overItems.findIndex(
				// 				(item) => item.id === overId.toString()
				// 			);
				// 			const activeIndex = activeItems.findIndex(
				// 				(item) => item.id === activeId.toString()
				// 			);

				// 			let newIndex: number;

				// 			if (overId in items) {
				// 				// If overId is present in items, place the item at the end
				// 				newIndex = overItems.length + 1;
				// 			} else {
				// 				// Determine the new index based on the relative position of active and over items
				// 				const isBelowOverItem =
				// 					event.over &&
				// 					event.active.rect.current.translated &&
				// 					event.active.rect.current.translated.top >
				// 						event.over.rect.top + event.over.rect.height;

				// 				const modifier = isBelowOverItem ? 1 : 0;

				// 				newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
				// 			}

				// 			// Update the items with the dragged item moved to the new container and position
				// 			return {
				// 				...items,
				// 				[activeContainer]: items[activeContainer as keyof Items].filter(
				// 					(item) => item.id !== activeId
				// 				),
				// 				[overContainer]: [
				// 					...items[overContainer as keyof Items].slice(0, newIndex),
				// 					items[activeContainer as keyof Items][activeIndex],
				// 					...items[overContainer as keyof Items].slice(
				// 						newIndex,
				// 						items[overContainer as keyof Items].length
				// 					),
				// 				],
				// 			};
				// 		});
			}
		}
	}

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
