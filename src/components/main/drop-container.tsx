import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dropzone } from './dropzone';
import { Task } from '@/lib/types/task';

type Props = {
	children: React.ReactNode;
	title: string;
	tasks: Task[];
};

export function DropContainer({ children, title, tasks }: Props) {
	return (
		<Card className="max-w-full h-min w-96">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{children}
				{!tasks ||
					(tasks.length === 0 && <Dropzone id="TODO">Drop something</Dropzone>)}
			</CardContent>
		</Card>
	);
}
