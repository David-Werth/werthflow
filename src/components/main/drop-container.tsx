import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusSquare } from 'lucide-react';

type Props = {
	children: React.ReactNode;
	title: string;
	setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DropContainer({ children, title, setIsAddModalOpen }: Props) {
	function handleAddItemClick() {
		setIsAddModalOpen(true);
	}

	return (
		<Card className="h-min w-96">
			<CardHeader>
				<CardTitle className="flex items-center justify-between select-none">
					{title}
					<PlusSquare
						className="transition-all cursor-pointer text-muted-foreground hover:text-foreground"
						onClick={handleAddItemClick}
					/>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">{children}</CardContent>
		</Card>
	);
}
