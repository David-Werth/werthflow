import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { UserDataContext } from '@/components/providers/user-data-provider';
import { Task } from '@/lib/types/task';

const formSchema = z.object({
	title: z.string().min(1, 'Please enter a title'),
	content: z.string().optional(),
});

type Props = {
	setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddItemModal({ setIsAddModalOpen }: Props) {
	const { userData, setUserData } = useContext(UserDataContext);

	const [loadingState, setLoadingState] = useState({
		isLoading: false,
		isError: false,
	});

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

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoadingState({ isLoading: true, isError: false });
		console.log(userData.folders[folderIndex]);

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/task/${
					userData.folders[folderIndex].sortables[0].id
				}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						sortableId: userData.folders[folderIndex].sortables[0].id,
						index: 0,
						title: values.title,
						content: values.content,
					}),
				}
			);

			if (res.ok) {
				const { data } = await res.json();
				const newTask: Task = {
					id: data.id,
					index: data.index,
					title: data.title,
					content: data.content,
					sortableId: data.sortableId,
				};

				const updatedUserData = { ...userData };
				updatedUserData.folders[folderIndex].sortables[0].tasks = [
					...updatedUserData.folders[folderIndex].sortables[0].tasks,
					newTask,
				];

				setUserData(updatedUserData);
				setLoadingState({ isLoading: false, isError: false });
				setIsAddModalOpen(false);
			} else {
				throw new Error('Failed to add task');
			}
		} catch (error) {
			console.error(error);
			setLoadingState({ isLoading: false, isError: true });
		}
	};

	return (
		<div className="absolute z-50 flex items-center justify-center w-full h-full px-5 backdrop-blur-sm">
			<Card className="drop-shadow-md w-96">
				<CardHeader className="flex-row items-start justify-between">
					<CardTitle>Add a To-do</CardTitle>
					<Button
						type="reset"
						variant={'link'}
						onClick={() => setIsAddModalOpen(false)}
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
								{loadingState.isError && <p>Something went wrong...</p>}
								<Button type="submit" className="w-full">
									{loadingState.isLoading ? (
										<Loader2 className="h-4 animate-spin" />
									) : (
										'Add'
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
