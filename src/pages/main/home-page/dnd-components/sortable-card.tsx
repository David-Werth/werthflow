import { useContext } from 'react';
import { Trash2 } from 'lucide-react';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Sortable } from '@/types/sortable';
import { UserDataContext } from '@/providers/user-data-provider';
import DropContainer from '@/pages/main/home-page/dnd-components/drop-container';
import TaskCard from '@/pages/main/home-page/dnd-components/task-card';
import Dropzone from '@/pages/main/home-page/dnd-components/dropzone';

// Wrapper component for rendering a column
export default function SortableCard({ sortable }: { sortable: Sortable }) {
	const { userData, setUserData } = useContext(UserDataContext);

	const folderId = sortable.folderId;
	const folderIndex = userData.folders.findIndex(
		(folder) => folderId === folder.id
	);

	const handleDeleteClick = async () => {
		if (confirm('Are you sure you want to delete this?')) {
			try {
				const updatedUserData = { ...userData };
				updatedUserData.folders[folderIndex].sortables = updatedUserData.folders[
					folderIndex
				].sortables.filter((s) => s.id !== sortable.id);

				setUserData({ ...updatedUserData });

				await fetch(`${import.meta.env.VITE_API_URL}/sortable/${sortable.id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				});
			} catch (error) {
				console.error('Error deleting sortable:', error);
			}
		}
	};

	return (
		<div className="relative group/sortable">
			<Trash2
				className="absolute hidden h-6 p-1 transition-colors border shadow-sm cursor-pointer group-hover/sortable:block bg-card text-muted-foreground hover:text-primary hover:border-primary rounded-2xl -right-2 -top-2"
				onMouseDown={handleDeleteClick}
			/>
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
