import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { useContext } from 'react';
import { TaskContext } from '../providers/task-provider';
import { useFindContainer } from '@/hooks/useFindContainer';
import { Items } from '@/lib/types/items';

type Props = {
	id: string;
	title: string;
	content: string | undefined;
};

export default function TaskCard({ id, title, content }: Props) {
	const { items, setItems } = useContext(TaskContext);

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

	return (
		<Card
			className="w-full max-h-fit"
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
		>
			<CardHeader className="flex flex-row justify-between px-4 py-3">
				<CardTitle className="text-xl break-all">{title}</CardTitle>
				<Trash2
					className="flex-shrink-0 h-4 cursor-pointer text-muted-foreground hover:text-foreground"
					onMouseDown={() => handleDeleteClick()}
				/>
			</CardHeader>
			{content && (
				<CardContent className="px-4 pb-3 text-muted-foreground">
					{content}
				</CardContent>
			)}
		</Card>
	);
}
