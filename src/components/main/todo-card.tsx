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

type CardState = 'TODO' | 'INPROGRESS' | 'DONE';

export default function TodoCard({
	state,
	title,
	content,
}: {
	state: CardState;
	title: string;
	content: string;
}) {
	const controls = useAnimation();

	const [currentVariant, setCurretVariant] = useState<CardState>(state);

	function onDragEnd(
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) {
		if (info.offset.x > 100 && info.offset.x < 200) {
			if (currentVariant == 'TODO') {
				controls.start('INPROGRESS');
				setCurretVariant('INPROGRESS');
			} else {
				controls.start('DONE');
				setCurretVariant('DONE');
			}
		} else if (info.offset.x > 200) {
			controls.start('DONE');
			setCurretVariant('DONE');
		} else if (info.offset.x < -100 && info.offset.x > -200) {
			if (currentVariant == 'INPROGRESS') {
				controls.start('TODO');
				setCurretVariant('TODO');
			} else if (currentVariant == 'DONE') {
				controls.start('INPROGRESS');
				setCurretVariant('INPROGRESS');
			} else {
				controls.start('TODO');
				setCurretVariant('TODO');
			}
		} else if (info.offset.x < -200) {
			controls.start('TODO');
			setCurretVariant('TODO');
		} else {
			controls.start(currentVariant.toString());
		}
	}

	return (
		<motion.div
			drag
			onDragEnd={onDragEnd}
			initial="TODO"
			animate={controls}
			transition={{
				type: 'spring',
				damping: 30,
				stiffness: 600,
			}}
			variants={{
				TODO: { x: 0 },
				INPROGRESS: { x: '100%' },
				DONE: { x: '200%' },
			}}
			whileDrag={{ scale: 1.05 }}
			dragConstraints={{ top: 0, bottom: 0 }}
			className="active:cursor-grabbing cursor-grab"
		>
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{content}</CardDescription>
				</CardHeader>
				{/* <CardContent>
					<p>Card Content</p>
				</CardContent> */}
				{/* <CardFooter>
					<p>Card Footer</p>
				</CardFooter> */}
			</Card>
		</motion.div>
	);
}

//
//
// context that takes ids of cards and arrages based on index
//
//
//
//
