import { DropContainer } from '@/components/main/drop-container';
import { Dropzone } from '@/components/main/dropzone';
import TaskCard from '@/components/main/task-card';
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
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

const initItems = {
	TODO: [
		{ id: '1e32dbbe', title: 'grew' },
		{ id: '8c340b0b', title: 'rain' },
		{ id: '6d71f345', title: 'newspaper' },
		{ id: '0888aca4', title: 'fish' },
	],
	DOING: [
		{ id: 'cf2e7f0f', title: 'done' },
		{ id: '661f0165', title: 'seeing' },
		{ id: 'a94d6ec7', title: 'neighborhood' },
		{ id: 'dd8bce58', title: 'pour' },
	],
	DONE: [
		{ id: '1ab3ee92', title: 'once' },
		{ id: 'f93ec221', title: 'classroom' },
		{ id: 'ab9a1d10', title: 'thy' },
		{ id: '8272a33b', title: 'recognize' },
	],
};

export default function Main() {
	const [items, setItems] = useState(initItems);
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

	console.log(items.TODO.length);

	return (
		<DndContext
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			sensors={sensors}
			collisionDetection={closestCenter}
		>
			<div className="grid w-full h-full grid-cols-3">
				<div>
					<SortableContext items={items.TODO} strategy={verticalListSortingStrategy}>
						<DropContainer title="To-do">
							{items.TODO.map((item) => (
								<TaskCard key={item.id} id={item.id} title={item.title} />
							))}
							{items.TODO.length === 0 ? (
								<Dropzone id="TODO">
									<PlusCircle />
								</Dropzone>
							) : null}
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
								<TaskCard key={item.id} id={item.id} title={item.title} />
							))}
							{items.DOING.length === 0 ? (
								<Dropzone id="DOING">
									<PlusCircle />
								</Dropzone>
							) : null}
						</DropContainer>
					</SortableContext>
				</div>
				<div>
					<SortableContext items={items.DONE} strategy={verticalListSortingStrategy}>
						<DropContainer title="Done">
							{items.DONE.map((item) => (
								<TaskCard key={item.id} id={item.id} title={item.title} />
							))}
							{items.DOING.length === 0 ? (
								<Dropzone id="DOING">
									<PlusCircle />
								</Dropzone>
							) : null}
						</DropContainer>
					</SortableContext>
				</div>
			</div>
		</DndContext>
	);
}
