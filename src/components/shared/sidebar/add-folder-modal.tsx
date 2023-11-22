import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@clerk/clerk-react';
import { useContext, useState } from 'react';
import { UserDataContext } from '@/components/providers/user-data-provider';
import { Folder } from '@/lib/types/folder';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
	title: z.string().min(1, 'Please enter a title'),
});

type Props = {
	setIsFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddFolderModal({ setIsFolderModalOpen }: Props) {
	const { user } = useUser();
	const { userData, setUserData } = useContext(UserDataContext);

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		async function createFolder(id: string, title: string) {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/folder/${id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title: title }),
			});
			if (res.ok) {
				const { data } = await res.json();

				const updatedFolders: Folder[] = [
					{
						id: data.id,
						title: data.title,
						userId: data.userId,
						sortables: data.sortables,
					},
					...userData.folders,
				];

				setUserData({ ...userData, folders: updatedFolders });
				setIsLoading(false);
			} else setIsError(true);
		}
		if (user?.id) createFolder(user?.id, values.title);

		setIsFolderModalOpen(false);
	}

	function handleCancelButtonClick() {
		setIsFolderModalOpen(false);
	}

	return (
		<div className="absolute z-50 flex items-center justify-center w-full h-full px-5 backdrop-blur-sm">
			<Card className="drop-shadow-md w-96">
				<CardHeader className="gap-6">
					<div className="flex flex-row items-start justify-between">
						<CardTitle>Add a Folder</CardTitle>
						<Button
							type="reset"
							variant={'link'}
							onClick={handleCancelButtonClick}
							className="p-0 m-0 h-fit"
						>
							Cancel
						</Button>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="Folder title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full">
								<Button type="submit" className="w-full">
									{isLoading ? <Loader2 className="h-4" /> : 'Add'}
								</Button>
							</div>
						</form>
					</Form>
				</CardHeader>
			</Card>
		</div>
	);
}
