import { UserDataContext } from '@/components/providers/user-data-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Folder } from '@/lib/types/folder';
import { Edit, Save, Trash2 } from 'lucide-react';
import { useContext, useState } from 'react';

export default function FolderButton({ folder }: { folder: Folder }) {
	const { userData, setUserData } = useContext(UserDataContext);
	const [folderTitle, setFolderTitle] = useState(folder.title);

	const [isEditMode, setIsEditMode] = useState(false);

	const folderIndex = userData.folders.indexOf(folder);

	const handleEditFolderClick = async () => {
		setIsEditMode((prevEditMode) => !prevEditMode);

		if (isEditMode) {
			try {
				const updatedUserData = { ...userData };
				updatedUserData.folders[folderIndex].title = folderTitle;
				setUserData({ ...userData, folders: updatedUserData.folders });

				await fetch(`${import.meta.env.VITE_API_URL}/folder/${folder.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ folderTitle }),
				});
			} catch (error) {
				console.error('Error updating folder:', error);
			}
		}
	};

	const handleDeleteClick = async () => {
		try {
			const updatedUserData = { ...userData };
			updatedUserData.folders = userData.folders.filter((f) => f.id !== folder.id);
			setUserData({ ...userData, folders: updatedUserData.folders });

			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/folder/${folder.id}`,
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
			console.error('Error deleting folder:', error);
		}
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFolderTitle(e.target.value);
	};
	return (
		<Button variant={'ghost'} className="relative justify-between w-full group">
			{isEditMode ? (
				<>
					<Input
						onChange={handleTitleChange}
						value={folderTitle}
						className="m-0 -ml-4 bg-transparent"
						spellCheck="false"
					/>
					<Save
						className="flex-shrink-0 h-4 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
						onMouseDown={handleEditFolderClick}
					/>
				</>
			) : (
				<>
					{folderTitle}
					<Edit
						className="flex-shrink-0 hidden h-4 transition-colors cursor-pointer text-muted-foreground hover:text-foreground group-hover:block"
						onMouseDown={handleEditFolderClick}
					/>
				</>
			)}
			<Trash2
				className="absolute hidden h-6 p-1 transition-colors border shadow-sm cursor-pointer group-hover:block bg-card text-muted-foreground hover:text-primary hover:border-primary rounded-2xl -right-2 -top-2"
				onMouseDown={handleDeleteClick}
			/>
		</Button>
	);
}
