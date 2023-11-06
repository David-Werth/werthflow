import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TaskCard({ id, title }: { id: string; title: string }) {
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
			className="active:cursor-grabbing active:z-50"
		>
			<Card className="w-full">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Card Content</p>
				</CardContent>
			</Card>
		</div>
	);
}
