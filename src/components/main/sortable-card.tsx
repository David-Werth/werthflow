import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DropContainer } from './drop-container';
import TaskCard from './task-card';
import { Sortable } from '@/lib/types/sortable';
import { Dropzone } from './dropzone';
import { useContext } from 'react';
import { UserDataContext } from '../providers/user-data-provider';
import { Trash2 } from 'lucide-react';

export default function SortableCard({ sortable }: { sortable: Sortable }) {
	const { userData, setUserData } = useContext(UserDataContext);

	const folderId = sortable.folderId;
	const folderIndex = userData.folders.findIndex(
		(folder) => folderId === folder.id
	);

	const handleDeleteClick = async () => {
		try {
			const updatedUserData = { ...userData };
			updatedUserData.folders[folderIndex].sortables = updatedUserData.folders[
				folderIndex
			].sortables.filter((s) => s.id !== sortable.id);

			setUserData({ ...updatedUserData });

			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/sortable/${sortable.id}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (!res.ok) {
				throw new Error('An error occurred');
			}
		} catch (error) {
			console.error('Error deleting sortable:', error);
		}
	};

	return (
		<div className="relative group/sortable">
			<Trash2
				className="absolute z-50 hidden h-6 p-1 transition-colors border shadow-sm cursor-pointer group-hover/sortable:block bg-card text-muted-foreground hover:text-primary hover:border-primary rounded-2xl -right-2 -top-2"
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
