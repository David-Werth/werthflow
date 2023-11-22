import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { UserDataContext } from '../providers/user-data-provider';
import { Loader2 } from 'lucide-react';
import { Task } from '@/lib/types/task';
import { useLocation } from 'react-router-dom';

const formSchema = z.object({
	title: z.string().min(1, 'Please enter a title'),
	content: z.string().optional(),
});

type Props = {
	setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddItemModal({ setIsAddModalOpen }: Props) {
	const { userData, setUserData } = useContext(UserDataContext);

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	const location = useLocation();
	const folderIndex = userData.folders.findIndex(
		(folder) => folder.id === location.pathname.replace('/', '')
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			content: '',
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		async function createFolder(id: string, title: string, content?: string) {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/task/${id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sortableId: id,
					index: 0,
					title: title,
					content: content,
				}),
			});
			if (res.ok) {
				const { data } = await res.json();

				let updatedUserData = userData;
				const newTask: Task = {
					id: data.id,
					index: data.index,
					title: data.title,
					content: data.content,
					sortableId: data.sortableId,
				};

				updatedUserData.folders[folderIndex].sortables[0].tasks = [
					...updatedUserData.folders[folderIndex].sortables[0].tasks,
					newTask,
				];

				setUserData({ ...userData, folders: updatedUserData.folders });

				setIsLoading(false);
				setIsAddModalOpen(false);
			} else setIsError(true);
		}
		createFolder(
			userData.folders[folderIndex].sortables[0].id,
			values.title,
			values.content
		);
	}

	function handleCancelButtonClick() {
		setIsAddModalOpen(false);
	}

	return (
		<div
			id="background"
			className="absolute z-50 flex items-center justify-center w-full h-full px-5 backdrop-blur-sm"
		>
			<Card className="drop-shadow-md w-96">
				<CardHeader className="flex-row items-start justify-between">
					<CardTitle>Add a To-do</CardTitle>
					<Button
						type="reset"
						variant={'link'}
						onClick={handleCancelButtonClick}
						className="p-0 m-0 h-fit"
					>
						Cancel
					</Button>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="To-do title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<div className="flex justify-between">
											<FormLabel>Notes</FormLabel>
											<FormDescription>Optional</FormDescription>
										</div>
										<FormControl>
											<Textarea placeholder="Add your notes" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full">
								{isError && <p>Something went wrong...</p>}
								<Button type="submit" className="w-full">
									{isLoading ? <Loader2 className="h-4 animate-spin" /> : 'Add'}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
