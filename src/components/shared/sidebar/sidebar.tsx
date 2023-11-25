import { PlusSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { useContext, useState } from 'react';
import AddFolderModal from './add-folder-modal';
import { Link } from 'react-router-dom';
import { UserDataContext } from '@/components/providers/user-data-provider';
import FolderButton from './folder-button';

export default function Sidebar() {
	const { userData } = useContext(UserDataContext);
	const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);

	const handleAddFolderClick = () => {
		setIsAddFolderModalOpen(true);
	};

	return (
		<>
			{isAddFolderModalOpen && (
				<AddFolderModal setIsFolderModalOpen={setIsAddFolderModalOpen} />
			)}

			<div className="flex flex-col h-full gap-5 px-2 py-5 border-r w-52">
				<h1 className="ml-3 font-bold">WERTHFLOW</h1>
				<ul className="flex flex-col">
					{userData.folders &&
						userData.folders.map((folder) => {
							return (
								<Link to={`/${folder.id}`} key={folder.id} className="group">
									<FolderButton folder={folder} />
								</Link>
							);
						})}
				</ul>
				<Button variant={'outline'} onClick={handleAddFolderClick}>
					Add Folder
					<PlusSquare className="h-4 ml-1" />
				</Button>
			</div>
		</>
	);
}
