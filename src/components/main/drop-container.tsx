import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = { children: React.ReactNode; title: string };

export function DropContainer(props: Props) {
	return (
		<Card className="h-min w-96">
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">{props.children}</CardContent>
		</Card>
	);
}
