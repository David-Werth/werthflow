import { useDroppable } from '@dnd-kit/core';

type Props = { children: React.ReactNode; id: string };

export function Dropzone(props: Props) {
	const { setNodeRef } = useDroppable({
		id: props.id,
	});
	return (
		<div
			ref={setNodeRef}
			className="flex items-center justify-center w-full h-12 rounded-lg bg-neutral-100 text-slate-500"
		>
			{props.children}
		</div>
	);
}
