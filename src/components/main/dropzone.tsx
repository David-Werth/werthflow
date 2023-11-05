import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDroppable } from '@dnd-kit/core';

type Props = { children: React.ReactNode; title: string; id: string };

export function Dropzone(props: Props) {
	const { setNodeRef } = useDroppable({
		id: props.id,
	});
	return (
		// <Card className="h-min w-96" ref={setNodeRef}>
		<Card className="h-min w-96">
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">{props.children}</CardContent>
		</Card>
	);
}
