import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DropContainer } from './drop-container';
import TaskCard from './task-card';
import { Sortable } from '@/lib/types/sortable';

export default function Sortable({ sortable }: { sortable: Sortable }) {
	return (
		<div>
			<SortableContext
				items={sortable.tasks}
				strategy={verticalListSortingStrategy}
			>
				<DropContainer title={sortable.title} tasks={sortable.tasks}>
					{sortable.tasks.map((task) => (
						<TaskCard
							key={task.id}
							id={task.id}
							title={task.title}
							content={task.content}
						/>
					))}
				</DropContainer>
			</SortableContext>
		</div>
	);
}
