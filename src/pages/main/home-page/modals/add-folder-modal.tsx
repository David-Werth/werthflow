import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@clerk/clerk-react';
import { useContext, useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import { UserDataContext } from '@/providers/user-data-provider';
import { Folder } from '@/types/folder';
import { Sortable } from '@/types/sortable';
import { Task } from '@/types/task';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
	title: z.string().min(1, 'Please enter a title'),
});

type Props = {
	setIsFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddFolderModal({ setIsFolderModalOpen }: Props) {
	const { user } = useUser();
	const navigate = useNavigate();
	const { userData, setUserData } = useContext(UserDataContext);

	const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'error'>(
		'idle'
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoadingState('loading');
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/folder/${user?.id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ title: values.title }),
				}
			);

			if (res.ok) {
				const { data } = await res.json();

				const updatedFolders: Folder[] = [
					{
						id: data.id,
						title: data.title,
						userId: data.userId,
						tasks: [] as Task[],
						sortables: [] as Sortable[],
					},
					...userData.folders,
				];

				setUserData({ ...userData, folders: updatedFolders });
				setIsFolderModalOpen(false);
				navigate(`/${data.id}`);
				setLoadingState('idle');
			} else {
				throw new Error('Failed to create folder');
			}
		} catch (error) {
			console.error('Error adding folder:', error);
			setLoadingState('error');
		}
	};

	return (
		<div className="absolute z-50 flex items-center justify-center w-full h-full px-5 backdrop-blur-sm">
			<Card className="drop-shadow-md w-96">
				<CardHeader className="gap-6">
					<div className="flex flex-row items-start justify-between">
						<CardTitle>Add a Folder</CardTitle>
						<Button
							type="reset"
							variant={'link'}
							onClick={() => setIsFolderModalOpen(false)}
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
								{loadingState === 'error' && <p>Something went wrong...</p>}
								<Button type="submit" className="w-full">
									{loadingState === 'loading' ? (
										<Loader2 className="h-4 animate-spin" />
									) : (
										'Add'
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardHeader>
			</Card>
		</div>
	);
}
