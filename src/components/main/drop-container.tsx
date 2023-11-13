import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
	children: React.ReactNode;
	title: string;
};

export function DropContainer({ children, title }: Props) {
	return (
		<Card className="max-w-full  h-min w-96">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">{children}</CardContent>
		</Card>
	);
}
