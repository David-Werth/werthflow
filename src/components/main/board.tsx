import AddItemModal from '@/components/main/add-item-modal';
import { DropContainer } from '@/components/main/drop-container';
import { Dropzone } from '@/components/main/dropzone';
import TaskCard from '@/components/main/task-card';

import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	closestCenter,
	DragOverEvent,
	UniqueIdentifier,
} from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useContext, useState } from 'react';
import { TaskContext } from '../providers/task-provider';
import { Items } from '@/lib/types/items';
import { Button } from '../ui/button';
import { PlusSquare } from 'lucide-react';

export default function Board() {
	const { items, setItems } = useContext(TaskContext);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
	const findContainer = (id: UniqueIdentifier) => {
		if (id in items) {
			return id;
		}

		for (const key in items) {
			if (items[key as keyof Items].some((item) => item.id.toString() === id)) {
				return key;
			}
		}

		return null;
	};

	/*
	 * Function to update items array for a specified container
	 */
	const updateItemsForContainer = (
		container: keyof Items,
		updatedArray: Items[keyof Items]
	) => {
		setItems({ ...items, [container]: updatedArray });
	};

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const currentContainer = findContainer(active.id);

		// Check if there is a drop target and a valid container
		if (over && currentContainer) {
			// Check if the item is moved to a different container
			if (active.id !== over.id) {
				// Find the index of the dragged item in the source container
				const oldIndex = items[currentContainer as keyof Items]
					.map((item) => item.id)
					.indexOf(active.id.toString());

				// Find the index of the drop target item in the destination container
				const newIndex = items[currentContainer as keyof Items]
					.map((item) => item.id)
					.indexOf(over.id.toString());

				// Move the dragged item to the new position in the array
				const updatedArray = arrayMove(
					items[currentContainer as keyof Items],
					oldIndex,
					newIndex
				);

				// Update the items array based on the current container
				switch (currentContainer) {
					case 'TODO':
						updateItemsForContainer('TODO', updatedArray);
						break;
					case 'DOING':
						updateItemsForContainer('DOING', updatedArray);
						break;
					case 'DONE':
						updateItemsForContainer('DONE', updatedArray);
						break;
					default:
				}
			}
		}
	}

	/*
	 * Function handling the drag-over event, determining if an item is dragged over a different container
	 */
	function handleDragOver(event: DragOverEvent) {
		const overId = event.over?.id;
		const activeId = event.active.id;

		if (overId) {
			// Finding containers for the active and over items
			const overContainer = findContainer(overId);
			const activeContainer = findContainer(activeId);

			console.log(overContainer, activeContainer);

			if (!overContainer || !activeContainer) {
				return;
			}

			// Moving the dragged item to a different container if needed
			if (activeContainer !== overContainer) {
				setItems((items) => {
					const activeItems = items[activeContainer as keyof Items];
					const overItems = items[overContainer as keyof Items];

					// Finding the index of the over and active items
					const overIndex = overItems.findIndex(
						(item) => item.id === overId.toString()
					);
					const activeIndex = activeItems.findIndex(
						(item) => item.id === activeId.toString()
					);

					let newIndex: number;

					if (overId in items) {
						// If overId is present in items, place the item at the end
						newIndex = overItems.length + 1;
					} else {
						// Determine the new index based on the relative position of active and over items
						const isBelowOverItem =
							event.over &&
							event.active.rect.current.translated &&
							event.active.rect.current.translated.top >
								event.over.rect.top + event.over.rect.height;

						const modifier = isBelowOverItem ? 1 : 0;

						newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
					}

					// Update the items with the dragged item moved to the new container and position
					return {
						...items,
						[activeContainer]: items[activeContainer as keyof Items].filter(
							(item) => item.id !== activeId
						),
						[overContainer]: [
							...items[overContainer as keyof Items].slice(0, newIndex),
							items[activeContainer as keyof Items][activeIndex],
							...items[overContainer as keyof Items].slice(
								newIndex,
								items[overContainer as keyof Items].length
							),
						],
					};
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
						<div>
							<SortableContext
								items={items.TODO}
								strategy={verticalListSortingStrategy}
							>
								<DropContainer title="To-do">
									{items.TODO.map((item) => (
										<TaskCard
											key={item.id}
											id={item.id}
											title={item.title}
											content={item.content}
										/>
									))}
									{items.TODO.length === 0 && (
										<Dropzone id="TODO">Drop something</Dropzone>
									)}
								</DropContainer>
							</SortableContext>
						</div>
						<div>
							<SortableContext
								items={items.DOING}
								strategy={verticalListSortingStrategy}
							>
								<DropContainer title="Doing">
									{items.DOING.map((item) => (
										<TaskCard
											key={item.id}
											id={item.id}
											title={item.title}
											content={item.content}
										/>
									))}
									{items.DOING.length === 0 && (
										<Dropzone id="DOING">Drop something</Dropzone>
									)}
								</DropContainer>
							</SortableContext>
						</div>
						<div>
							<SortableContext
								items={items.DONE}
								strategy={verticalListSortingStrategy}
							>
								<DropContainer title="Done">
									{items.DONE.map((item) => (
										<TaskCard
											key={item.id}
											id={item.id}
											title={item.title}
											content={item.content}
										/>
									))}
									{items.DONE.length === 0 && (
										<Dropzone id="DONE">Drop something</Dropzone>
									)}
								</DropContainer>
							</SortableContext>
						</div>
					</div>
				</div>
			</div>
		</DndContext>
	);
}
