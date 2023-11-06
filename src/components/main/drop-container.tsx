import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusSquare } from 'lucide-react';

type Props = { children: React.ReactNode; title: string };

export function DropContainer(props: Props) {
	return (
		<Card className="h-min w-96">
			<CardHeader>
				<CardTitle className="flex items-center justify-between select-none">
					{props.title}
					<PlusSquare className="transition-all cursor-pointer text-muted-foreground hover:text-foreground" />
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">{props.children}</CardContent>
		</Card>
	);
}
