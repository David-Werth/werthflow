import AddItemModal from '@/components/main/add-item-modal';
import { DropContainer } from '@/components/main/drop-container';
import { Dropzone } from '@/components/main/dropzone';
import EditItemModal from '@/components/main/edit-item-modal';
import TaskCard from '@/components/main/task-card';
import { initItems } from '@/lib/mock/card-data';

import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	PointerSensor,
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

import { useState } from 'react';

export default function Main() {
	const [items, setItems] = useState(initItems);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editModalData, setEditModalData] = useState({
		id: '',
		title: '',
		content: '',
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(MouseSensor),
		useSensor(TouchSensor)
	);

	const findContainer = (id: UniqueIdentifier) => {
		if (id in items) {
			return id;
		}

		return Object.keys(items).find((key) =>
			items[key as keyof typeof items]
				.map((item) => item.id)
				.includes(id.toString())
		);
	};

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const currentContainer = findContainer(active.id);

		if (over && currentContainer) {
			if (active.id !== over.id) {
				const oldIndex = items[currentContainer as keyof typeof items]
					.map((item) => item.id)
					.indexOf(active.id.toString());
				const newIndex = items[currentContainer as keyof typeof items]
					.map((item) => item.id)
					.indexOf(over.id.toString());
				const updatedArray = arrayMove(
					items[currentContainer as keyof typeof items],
					oldIndex,
					newIndex
				);

				if (currentContainer === 'TODO') {
					setItems({ ...items, TODO: updatedArray });
				} else if (currentContainer === 'DOING') {
					setItems({ ...items, DOING: updatedArray });
				} else if (currentContainer === 'DONE') {
					setItems({ ...items, DONE: updatedArray });
				}
			}
		}
	}

	function handleDragOver(event: DragOverEvent) {
		const overId = event.over?.id;
		const activeId = event.active.id;

		if (overId) {
			const overContainer = findContainer(overId);
			const activeContainer = findContainer(activeId);

			if (!overContainer || !activeContainer) {
				return;
			}

			if (activeContainer !== overContainer) {
				setItems((items) => {
					const activeItems = items[activeContainer as keyof typeof items];
					const overItems = items[activeContainer as keyof typeof items];
					const overIndex = overItems
						.map((item) => item.id)
						.indexOf(overId.toString());
					const activeIndex = activeItems
						.map((item) => item.id)
						.indexOf(activeId.toString());

					let newIndex: number;

					if (overId in items) {
						newIndex = overItems.length + 1;
					} else {
						const isBelowOverItem =
							event.over &&
							event.active.rect.current.translated &&
							event.active.rect.current.translated.top >
								event.over.rect.top + event.over.rect.height;

						const modifier = isBelowOverItem ? 1 : 0;

						newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
					}

					return {
						...items,
						[activeContainer]: items[activeContainer as keyof typeof items].filter(
							(item) => item.id !== activeId
						),
						[overContainer]: [
							...items[overContainer as keyof typeof items].slice(0, newIndex),
							items[activeContainer as keyof typeof items][activeIndex],
							...items[overContainer as keyof typeof items].slice(
								newIndex,
								items[overContainer as keyof typeof items].length
							),
						],
					};
				});
			}
		}
	}

	function handleEditClick(id: string, title: string, content: string) {
		setEditModalData({ id, title, content });
		setIsEditModalOpen(true);
		return true;
	}

	return (
		<DndContext
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			sensors={sensors}
			collisionDetection={closestCenter}
		>
			{isAddModalOpen && <AddItemModal setIsAddModalOpen={setIsAddModalOpen} />}
			{isEditModalOpen && (
				<EditItemModal
					setIsEditModalOpen={setIsEditModalOpen}
					editModalData={editModalData}
				/>
			)}
			<div className="w-full h-full pt-36">
				<div className="flex items-start justify-center w-full gap-5">
					<div>
						<SortableContext
							items={items.TODO}
							strategy={verticalListSortingStrategy}
						>
							<DropContainer title="To-do" setIsAddModalOpen={setIsAddModalOpen}>
								{items.TODO.map((item) => (
									<TaskCard
										key={item.id}
										id={item.id}
										title={item.title}
										content={item.content}
										handleEditClick={handleEditClick}
									/>
								))}
								{items.TODO.length === 0 ? (
									<Dropzone id="TODO">Drop something</Dropzone>
								) : null}
							</DropContainer>
						</SortableContext>
					</div>
					<div>
						<SortableContext
							items={items.DOING}
							strategy={verticalListSortingStrategy}
						>
							<DropContainer title="Doing" setIsAddModalOpen={setIsAddModalOpen}>
								{items.DOING.map((item) => (
									<TaskCard
										key={item.id}
										id={item.id}
										title={item.title}
										content={item.content}
										handleEditClick={handleEditClick}
									/>
								))}
								{items.DOING.length === 0 ? (
									<Dropzone id="DOING">Drop something</Dropzone>
								) : null}
							</DropContainer>
						</SortableContext>
					</div>
					<div>
						<SortableContext
							items={items.DONE}
							strategy={verticalListSortingStrategy}
						>
							<DropContainer title="Done" setIsAddModalOpen={setIsAddModalOpen}>
								{items.DONE.map((item) => (
									<TaskCard
										key={item.id}
										id={item.id}
										title={item.title}
										content={item.content}
										handleEditClick={handleEditClick}
									/>
								))}
								{items.DONE.length === 0 ? (
									<Dropzone id="DONE">Drop something</Dropzone>
								) : null}
							</DropContainer>
						</SortableContext>
					</div>
				</div>
			</div>
		</DndContext>
	);
}
