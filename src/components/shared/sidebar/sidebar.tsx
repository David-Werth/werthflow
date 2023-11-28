import { ArrowLeft, ArrowRight, PlusSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { useContext, useState } from 'react';
import AddFolderModal from './add-folder-modal';
import { Link } from 'react-router-dom';
import { UserDataContext } from '@/components/providers/user-data-provider';
import FolderButton from './folder-button';

export default function Sidebar() {
	const { userData } = useContext(UserDataContext);
	const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<>
			{isAddFolderModalOpen && (
				<AddFolderModal setIsFolderModalOpen={setIsAddFolderModalOpen} />
			)}

			<div
				className={`flex flex-col h-full gap-5 px-2 py-5 border-r min-w-[250px] relative transition-all -translate-x-[250px] -mr-[250px] xl:translate-x-0 xl:mr-0 z-50 shadow-lg ${
					!isSidebarOpen &&
					'xl:-translate-x-[250px] xl:-mr-[250px] translate-x-0 mr-0'
				}`}
			>
				<div
					className="absolute -right-6 top-[45vh] bg-background border border-l-0 rounded-r-md h-20 w-6 flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
					onClick={() => setIsSidebarOpen((prev) => !prev)}
				>
					{isSidebarOpen ? (
						<>
							<ArrowLeft className="h-4 hidden xl:block" />
							<ArrowRight className="h-4 xl:hidden" />
						</>
					) : (
						<>
							<ArrowLeft className="h-4 xl:hidden" />
							<ArrowRight className="h-4 hidden xl:block" />
						</>
					)}
				</div>
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
				<Button variant={'outline'} onClick={() => setIsAddFolderModalOpen(true)}>
					Add Folder
					<PlusSquare className="h-4 ml-1" />
				</Button>
			</div>
		</>
	);
}
