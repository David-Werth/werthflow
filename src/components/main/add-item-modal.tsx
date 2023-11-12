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
import { useContext } from 'react';
import { TaskContext } from '../providers/task-provider';

const formSchema = z.object({
	title: z.string(),
	notes: z.string().optional(),
});

type Props = {
	setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddItemModal({ setIsAddModalOpen }: Props) {
	const { items, setItems } = useContext(TaskContext);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			notes: '',
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		let updatedTasks = [
			...items.TODO,
			{
				id: crypto.randomUUID(),
				title: values.title,
				content: values.notes,
			},
		];

		setItems({
			...items,
			TODO: updatedTasks,
		});

		setIsAddModalOpen(false);
	}

	function handleCancelButtonClick() {
		setIsAddModalOpen(false);
	}

	return (
		<div
			id="background"
			className="absolute z-50 flex items-center justify-center w-full h-full backdrop-blur-sm"
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
								name="notes"
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
								<Button type="submit" className="w-full">
									Add
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
