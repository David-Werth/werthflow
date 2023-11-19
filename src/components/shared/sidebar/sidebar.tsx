import { PlusSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { useState } from 'react';
import AddFolderModal from './add-folder-modal';

export default function Sidebar() {
	const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

	function handleAddFolderClick() {
		setIsFolderModalOpen(true);
	}

	return (
		<>
			{isFolderModalOpen && (
				<AddFolderModal setIsFolderModalOpen={setIsFolderModalOpen} />
			)}
			<div className="fixed flex flex-col h-full gap-5 p-3 border-r">
				<h1 className="font-bold">WERTHFLOW</h1>
				<ul className="flex flex-col">
					<Button variant={'ghost'} className="justify-start">
						Folder1
					</Button>
					<Button variant={'ghost'} className="justify-start">
						Folder2
					</Button>
				</ul>
				<Button onClick={handleAddFolderClick}>
					Add Folder
					<PlusSquare className="h-4 ml-1" />
				</Button>
			</div>
		</>
	);
}
