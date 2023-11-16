import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Trash2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { TaskContext } from '../providers/task-provider';
import { useFindContainer } from '@/hooks/useFindContainer';
import { Items } from '@/lib/types/items';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type Props = {
	id: string;
	title: string;
	content: string | undefined;
};

export default function TaskCard({ id, title, content }: Props) {
	const { items, setItems } = useContext(TaskContext);

	const [itemData, setItemData] = useState({ id, title, content });

	const [isEditMode, setIsEditMode] = useState(false);

	const container = useFindContainer(id, items);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: id,
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		cursor: isDragging ? 'grabbing' : 'grab',
		zIndex: isDragging ? '40' : '30',
	};

	function handleDeleteClick() {
		const updatedItems = items[container as keyof Items].filter(
			(item) => item.id !== id
		);

		setItems({
			...items,
			[container as keyof Items]: updatedItems,
		});
	}

	function handleEditClick() {
		setIsEditMode((isEditMode) => !isEditMode);

		if (isEditMode) {
			const updatedItem = {
				title: itemData.title,
				content: itemData.content,
			};

			setItems({
				...items,
				[container as keyof Items]: items[container as keyof Items].map((item) =>
					item.id === id
						? { id: id, title: updatedItem.title, content: updatedItem.content }
						: item
				),
			});
		}
	}

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newTitle = e.target.value;
		setItemData({ ...itemData, title: newTitle });
	}

	function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const newContent = e.target.value;
		setItemData({ ...itemData, content: newContent });
	}

	return (
		<Card
			className={`w-full max-h-fit group ${
				isEditMode ? 'outline-dashed outline-muted' : ''
			}`}
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
		>
			<CardHeader className="relative flex flex-row justify-between px-4 py-3">
				<CardTitle className="text-xl break-all">
					{isEditMode ? (
						<Input
							onChange={handleTitleChange}
							value={itemData.title}
							className="text-xl bg-transparent "
							spellCheck="false"
						/>
					) : (
						itemData.title
					)}
				</CardTitle>
				{!isEditMode ? (
					<Edit
						className="flex-shrink-0 h-4 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
						onMouseDown={handleEditClick}
					/>
				) : (
					<Save
						className="flex-shrink-0 h-4 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
						onMouseDown={handleEditClick}
					/>
				)}
				<Trash2
					className="absolute hidden h-6 p-1 transition-colors border shadow-sm cursor-pointer group-hover:block bg-card text-muted-foreground hover:text-primary hover:border-primary rounded-2xl -right-2 -top-4"
					onMouseDown={handleDeleteClick}
				/>
			</CardHeader>
			{!itemData.content && !isEditMode ? null : (
				<CardContent className="px-4 pb-3 text-muted-foreground">
					{isEditMode ? (
						<Textarea
							onChange={handleTextareaChange}
							value={itemData.content}
							className="text-base bg-transparent h-max"
							spellCheck="false"
						/>
					) : (
						<p className="text-base whitespace-pre-wrap">{itemData.content}</p>
					)}
				</CardContent>
			)}
		</Card>
	);
}
