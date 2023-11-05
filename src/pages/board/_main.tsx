import { Dropzone } from '@/components/main/dropzone';
import TaskCard from '@/components/main/task-card';
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { useState } from 'react';

export default function Main() {
	const containers = ['TODO', 'DOING', 'DONE'];
	const [parent, setParent] = useState<UniqueIdentifier | null>(null);
	const draggableMarkup = <TaskCard id="draggable" />;

	function handleDragEnd(event: DragEndEvent) {
		const { over } = event;
		setParent(over ? over.id : null);
	}

	return (
		<DndContext onDragEnd={handleDragEnd}>
			{parent === null ? draggableMarkup : null}
			<div className="grid w-full h-full grid-cols-3">
				{containers.map((id) => (
					<Dropzone key={id} id={id}>
						{parent === id ? draggableMarkup : 'Drop here'}
					</Dropzone>
				))}
			</div>
		</DndContext>
	);
}
