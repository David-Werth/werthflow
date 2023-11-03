import { useDroppable } from '@dnd-kit/core';

type Props = { children: React.ReactNode; id: string };

export function Dropzone(props: Props) {
	const { isOver, setNodeRef } = useDroppable({
		id: props.id,
		data: {
			accepts: ['type1', 'type2'],
		},
	});
	const style = {
		color: isOver ? 'green' : undefined,
	};

	return (
		<div ref={setNodeRef} style={style} className="p-4 border border-black">
			{props.children}
		</div>
	);
}
