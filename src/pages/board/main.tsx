import { Dropzone } from '@/components/main/dropzone';
import TaskCard from '@/components/main/task-card';
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { useState } from 'react';

export default function Main() {
	const containers = ['A', 'B', 'C'];
	const [parent, setParent] = useState<UniqueIdentifier | null>(null);
	const draggableMarkup = <TaskCard id="draggable" />;

	function handleDragEnd(event: DragEndEvent) {
		const { over } = event;

		// If the item is dropped over a container, set it as the parent
		// otherwise reset the parent to `null`
		setParent(over ? over.id : null);
	}

	return (
		<DndContext onDragEnd={handleDragEnd}>
			{parent === null ? draggableMarkup : null}

			{containers.map((id) => (
				// We updated the Droppable component so it would accept an `id`
				// prop and pass it to `useDroppable`
				<Dropzone key={id} id={id}>
					{parent === id ? draggableMarkup : 'Drop here'}
				</Dropzone>
			))}
		</DndContext>
	);
}
