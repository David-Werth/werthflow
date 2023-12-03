import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PlusSquare } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

import { Button } from '@/components/ui/button';
import { UserDataContext } from '@/providers/user-data-provider';
import AddFolderModal from '@/pages/main/home-page/modals/add-folder-modal';
import FolderButton from '@/pages/main/home-page/sidebar/folder-button';
import ModeToggle from '@/components/shared/mode-toggle';

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
				className={`flex flex-col h-full gap-5 px-2 py-5 border-r min-w-[250px] md:relative absolute bg-background transition-all -translate-x-[250px] -mr-[250px] z-40 shadow-lg ${
					isSidebarOpen && 'translate-x-0 mr-0'
				}`}
			>
				<div
					className="absolute -right-6 top-[45vh] bg-card border border-l-0 rounded-r-md h-20 w-6 flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
					onClick={() => setIsSidebarOpen((prev) => !prev)}
				>
					{!isSidebarOpen ? (
						<>
							<ArrowRight className="h-4 animate-pulse" />
						</>
					) : (
						<>
							<ArrowLeft className="h-4 animate-pulse" />
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
				<div className="fixed left-7 bottom-5">
					<ModeToggle />
				</div>
				<div className="fixed right-7 bottom-5">
					<UserButton
						afterSignOutUrl="/"
						appearance={{
							elements: { userButtonBox: 'h-10' },
						}}
					/>
				</div>
			</div>
		</>
	);
}
