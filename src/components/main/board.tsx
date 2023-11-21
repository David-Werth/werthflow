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

	const findContainer = (id: string) => {
		let containerId: string = id;
		folder.sortables.filter((sortable) => {
			if (sortable.tasks.some((task) => task.id === id)) {
				containerId = sortable.id;
			}
		});
		return containerId;
	};

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
							tasks: updatedArray,
						};
					}
					return sortable;
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

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const activeId = active.id as string;
		const overId = over?.id as string;

		const currentContainer = findContainer(activeId);

		if (over && currentContainer) {
			if (activeId !== overId) {
				const oldIndex = folder.sortables
					.filter((sortable) => sortable.id === currentContainer)[0]
					.tasks.findIndex((task) => task.id === activeId);

				const newIndex = folder.sortables
					.filter((sortable) => sortable.id === currentContainer)[0]
					.tasks.findIndex((task) => task.id === overId);

				const updatedArray = arrayMove(
					folder.sortables.filter((sortable) => sortable.id === currentContainer)[0]
						.tasks,
					oldIndex,
					newIndex
				);

				updateItemsForContainer(currentContainer, updatedArray);
			}
		}
	}

	function handleDragOver(event: DragOverEvent) {
		const overId = event.over?.id as string;
		const activeId = event.active.id as string;
		const { active, over } = event;

		if (overId) {
			const overSortable = findContainer(overId);
			const activeSortable = findContainer(activeId);
			console.log(overSortable, activeSortable);

			if (!overSortable || !activeSortable) {
				console.log('returned');
				return;
			}

			if (overSortable !== activeSortable) {
				const overSortableIndex = folder.sortables.findIndex(
					(sortable) => sortable.id === overSortable
				);
				const activeSortableIndex = folder.sortables.findIndex(
					(sortable) => sortable.id === activeSortable
				);

				const overTasks = folder.sortables[overSortableIndex].tasks;
				const activeTasks = folder.sortables[activeSortableIndex].tasks;

				const overTaskIndex = overTasks.findIndex((task) => task.id === overId);
				const activeTaskIndex = activeTasks.findIndex(
					(task) => task.id === activeId
				);

				let currentFolder = folder;
				const folderIndex = userData.folders.indexOf(folder);

				let newIndex: number;

				if (overId in folder.sortables) {
					newIndex = overTasks.length + 1;
				} else {
					const isBelowOverItem =
						over &&
						active.rect.current.translated &&
						active.rect.current.translated.top > over.rect.top + over.rect.height;

					const modifier = isBelowOverItem ? 1 : 0;

					newIndex =
						overTaskIndex >= 0 ? overTaskIndex + modifier : overTasks.length + 1;
				}

				currentFolder.sortables[activeSortableIndex].tasks = activeTasks.filter(
					(task) => task.id !== activeId
				);

				if (overTasks) {
					currentFolder.sortables[overSortableIndex].tasks = [
						...overTasks.slice(0, newIndex),
						activeTasks[activeTaskIndex],
						...overTasks.slice(newIndex, overTasks.length),
					];
				} else {
					currentFolder.sortables[overSortableIndex].tasks = [
						activeTasks[activeTaskIndex],
					];
				}

				const updatedFolders = userData.folders.map((f) => {
					if (f.id === folder.id) {
						return currentFolder;
					}
					return f;
				});

				setFolder(updatedFolders[folderIndex]);
				setUserData({
					...userData,
					folders: updatedFolders,
				});
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
