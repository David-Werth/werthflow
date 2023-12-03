import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sortable } from '@/types/sortable';

type Props = {
	children: React.ReactNode;
	sortable: Sortable;
};

// Wrapper component for task cards
export default function DropContainer({ children, sortable }: Props) {
	return (
		<Card className="max-w-full h-min w-96">
			<CardHeader>
				<CardTitle>{sortable.title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">{children}</CardContent>
		</Card>
	);
}
