import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { PanInfo, motion, useAnimation } from 'framer-motion';
import { useState } from 'react';

//listen for info.offset.x and update based on that

export default function CardTest() {
	const controls = useAnimation();

	const [currentVariant, setCurretVariant] = useState<String>('toDo');

	function onDragEnd(
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) {
		console.log(info.offset.x);
		if (info.offset.x > 100 && info.offset.x < 200) {
			if (currentVariant == 'toDo') {
				controls.start('inProgress');
				setCurretVariant('inProgress');
			} else {
				controls.start('done');
				setCurretVariant('done');
			}
		} else if (info.offset.x > 200) {
			controls.start('done');
			setCurretVariant('done');
		} else if (info.offset.x < -100) {
			if (currentVariant == 'inProgress') {
				controls.start('toDo');
				setCurretVariant('toDo');
			} else if (currentVariant == 'done') {
				controls.start('inProgress');
				setCurretVariant('inProgress');
			} else {
				controls.start('toDo');
				setCurretVariant('toDo');
			}
		} else {
			controls.start('toDo');
			setCurretVariant('toDo');
		}
	}

	return (
		<motion.div
			drag
			onDragEnd={onDragEnd}
			initial="toDo"
			animate={controls}
			transition={{
				type: 'spring',
				damping: 30,
				stiffness: 600,
			}}
			variants={{
				toDo: { x: 0 },
				inProgress: { x: '100%' },
				done: { x: '200%' },
			}}
			dragConstraints={{ top: 0, bottom: 0 }}
			whileDrag={{ scale: 1.1 }}
		>
			<Card>
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
