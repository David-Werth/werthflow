import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';

type Props = {
	id: string;
	title: string;
	content: string;
	handleEditClick(id: string, title: string, content: string): boolean;
};

export default function TaskCard({
	id,
	title,
	content,
	handleEditClick,
}: Props) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: id,
			transition: {
				duration: 100,
				easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
			},
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
			className="active:cursor-grabbing active:z-40"
		>
			<Card className="w-full">
				<CardHeader className="px-4 py-3 flex flex-row justify-between">
					<CardTitle className="text-xl cursor-text">{title}</CardTitle>
					<Edit
						className="h-4 cursor-pointer text-muted-foreground hover:text-foreground"
						onMouseDown={() => handleEditClick(id, title, content)}
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
