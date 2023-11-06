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
import { useState } from 'react';

const initItems = {
	TODO: [
		{
			id: '1e32dbbe',
			title: 'grew',
			content:
				'indicate fought ask driver feel shout slope tales half dance coast term forty',
		},
		{
			id: '8c340b0b',
			title: 'rain',
			content:
				'symbol baby line whistle behavior waste sharp discovery clearly since pen',
		},
		{
			id: '6d71f345',
			title: 'newspaper',
			content:
				'telephone just layers broken memory edge string hill contain nothing massage accurate',
		},
		{
			id: '0888aca4',
			title: 'fish',
			content:
				'snow diameter will merely week differ structure acres prevent layers salmon coffee',
		},
	],
	DOING: [
		{
			id: 'cf2e7f0f',
			title: 'done',
			content:
				'property neighbor dangerous forget given raw fastened folks produce horn direction',
		},
		{
			id: '661f0165',
			title: 'seeing',
			content:
				'straight might important wrong lay likely second porch worried handsome nuts kids',
		},
		{
			id: 'a94d6ec7',
			title: 'neighborhood',
			content:
				'cage earlier route but main value whom bet man medicine major weather swam',
		},
		{
			id: 'dd8bce58',
			title: 'pour',
			content:
				'beneath baseball hunter game fire medicine poetry mass found church check split',
		},
	],
	DONE: [
		{
			id: '1ab3ee92',
			title: 'once',
			content:
				'read thought blanket recall whenever flight ear like post main fort',
		},
		{
			id: 'f93ec221',
			title: 'classroom',
			content:
				'disappear naturally folks explain part generally once hard bill cloud park electricity',
		},
		{
			id: 'ab9a1d10',
			title: 'thy',
			content:
				'its why however join cell buried rope earth lower row drink stay zero',
		},
		{
			id: '8272a33b',
			title: 'recognize',
			content:
				'service truth is badly forget guess wet whether wall orbit driving program',
		},
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
			<div className="flex items-start justify-center w-full gap-5 mt-32">
				<div>
					<SortableContext items={items.TODO} strategy={verticalListSortingStrategy}>
						<DropContainer title="To-do">
							{items.TODO.map((item) => (
								<TaskCard
									key={item.id}
									id={item.id}
									title={item.title}
									content={item.content}
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
						<DropContainer title="Doing">
							{items.DOING.map((item) => (
								<TaskCard
									key={item.id}
									id={item.id}
									title={item.title}
									content={item.content}
								/>
							))}
							{items.DOING.length === 0 ? (
								<Dropzone id="DOING">Drop something</Dropzone>
							) : null}
						</DropContainer>
					</SortableContext>
				</div>
				<div>
					<SortableContext items={items.DONE} strategy={verticalListSortingStrategy}>
						<DropContainer title="Done">
							{items.DONE.map((item) => (
								<TaskCard
									key={item.id}
									id={item.id}
									title={item.title}
									content={item.content}
								/>
							))}
							{items.DONE.length === 0 ? (
								<Dropzone id="DONE">Drop something</Dropzone>
							) : null}
						</DropContainer>
					</SortableContext>
				</div>
			</div>
		</DndContext>
	);
}
