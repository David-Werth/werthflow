import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function TaskCard({ id }: { id: string }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: id,
		data: {
			type: 'type1',
		},
	});
	const style = {
		transform: CSS.Translate.toString(transform),
	};

	return (
		<motion.div
			drag
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className="active:cursor-grabbing w-fit"
			transition={{
				type: 'spring',
				damping: 30,
				stiffness: 100,
			}}
			whileDrag={{ scale: 1.05 }}
		>
			<Card className="w-fit">
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Card Content</p>
				</CardContent>
				<CardFooter>
					<p>Card Footer</p>
				</CardFooter>
			</Card>
		</motion.div>
	);
}
