import { Edit, Save, Trash2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserDataContext } from '@/providers/user-data-provider';
import { Sortable } from '@/types/sortable';
import { Task } from '@/types/task';

type Props = {
	id: string;
	title: string;
	content?: string;
	sortable: Sortable;
};

// Component to render a task card
export default function TaskCard({ id, title, content, sortable }: Props) {
	const { userData, setUserData } = useContext(UserDataContext);
	const [taskData, setTaskData] = useState({ id, title, content });
	const [isEditMode, setIsEditMode] = useState(false);

	const folderId = sortable.folderId;
	const folderIndex = userData.folders.findIndex(
		(folder) => folderId === folder.id
	);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: id,
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	const handleDeleteClick = async () => {
		const sortableIndex =
			userData.folders[folderIndex].sortables.indexOf(sortable);

		try {
			const updatedUserData = { ...userData };
			updatedUserData.folders[folderIndex].sortables[sortableIndex].tasks =
				updatedUserData.folders[folderIndex].sortables[sortableIndex].tasks.filter(
					(task) => task.id !== id
				);

			setUserData({ ...userData, folders: updatedUserData.folders });

			await fetch(`${import.meta.env.VITE_API_URL}/task/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	const handleEditClick = async () => {
		const sortableIndex =
			userData.folders[folderIndex].sortables.indexOf(sortable);
		setIsEditMode((prevEditMode) => !prevEditMode);
		console.log(userData);

		if (isEditMode) {
			try {
				const updatedUserData = { ...userData };
				const updatedTask = {
					title: taskData.title,
					content: taskData.content,
				};
				updatedUserData.folders[folderIndex].sortables[sortableIndex].tasks =
					updatedUserData.folders[folderIndex].sortables[sortableIndex].tasks.map(
						(task) => (task.id === id ? updatedTask : task)
					) as Task[];
				updatedUserData.tasks = updatedUserData.tasks.map((task) =>
					task.id === id ? updatedTask : task
				) as Task[];
				setUserData({
					...userData,
					folders: updatedUserData.folders,
					sortables: updatedUserData.sortables,
					tasks: updatedUserData.tasks,
				});

				await fetch(`${import.meta.env.VITE_API_URL}/task/${id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedTask),
				});
			} catch (error) {
				console.error('Error updating task:', error);
			}
		}
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value;
		setTaskData((prevTaskData) => ({ ...prevTaskData, title: newTitle }));
	};

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newContent = e.target.value;
		setTaskData((prevTaskData) => ({ ...prevTaskData, content: newContent }));
	};

	return (
		<Card
			className={`w-full max-h-fit group ${
				isEditMode ? 'outline-dashed outline-muted' : ''
			} ${isDragging ? 'z-40 cursor-grabbing' : 'z-30 cursor-grab'}`}
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
		>
			<CardHeader className="relative flex flex-row justify-between px-4 py-3">
				<CardTitle className="text-xl break-all">
					{isEditMode ? (
						<Input
							onChange={handleTitleChange}
							value={taskData.title}
							className="text-xl bg-transparent "
							spellCheck="false"
						/>
					) : (
						taskData.title
					)}
				</CardTitle>
				{!isEditMode ? (
					<Edit
						className="flex-shrink-0 h-4 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
						onMouseDown={handleEditClick}
					/>
				) : (
					<Save
						className="flex-shrink-0 h-4 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
						onMouseDown={handleEditClick}
					/>
				)}
				<Trash2
					className="absolute hidden h-6 p-1 transition-colors border shadow-sm cursor-pointer group-hover:block bg-card text-muted-foreground hover:text-primary hover:border-primary rounded-2xl -right-2 -top-4"
					onMouseDown={handleDeleteClick}
				/>
			</CardHeader>
			{!taskData.content && !isEditMode ? null : (
				<CardContent className="px-4 pb-3 text-muted-foreground">
					{isEditMode ? (
						<Textarea
							onChange={handleTextareaChange}
							value={taskData.content}
							className="text-base bg-transparent"
							spellCheck="false"
						/>
					) : (
						taskData.content
					)}
				</CardContent>
			)}
		</Card>
	);
}
