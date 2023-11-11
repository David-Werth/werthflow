import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';

type Props = {
	id: string;
	title: string;
	content: string;
	handleEditClick(): boolean;
};

export default function TaskCard({
	id,
	title,
	content,
	handleEditClick,
}: Props) {
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
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`cursor-grab ${isDragging ? 'z-40 cursor-grabbing' : ''}`}
		>
			<Card className="w-full">
				<CardHeader className="flex flex-row justify-between px-4 py-3">
					<CardTitle className="text-xl">{title}</CardTitle>
					<Edit
						className="h-4 cursor-pointer text-muted-foreground hover:text-foreground"
						onMouseDown={() => handleEditClick()}
					/>
				</CardHeader>
				{content && (
					<CardContent className="px-4 pb-3 text-muted-foreground">
						{content}
					</CardContent>
				)}
			</Card>
		</div>
	);
}
