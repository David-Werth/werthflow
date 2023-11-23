import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DropContainer } from './drop-container';
import TaskCard from './task-card';
import { Sortable } from '@/lib/types/sortable';
import { Dropzone } from './dropzone';

export default function Sortable({ sortable }: { sortable: Sortable }) {
	return (
		<div>
			<SortableContext
				items={sortable.tasks}
				strategy={verticalListSortingStrategy}
			>
				<DropContainer sortable={sortable}>
					{sortable.tasks.map((task) => (
						<TaskCard
							key={task.id}
							id={task.id}
							title={task.title}
							content={task.content}
							sortable={sortable}
						/>
					))}
					{sortable.tasks.length === 0 && (
						<Dropzone id={sortable.id}>Drop something</Dropzone>
					)}
				</DropContainer>
			</SortableContext>
		</div>
	);
}
