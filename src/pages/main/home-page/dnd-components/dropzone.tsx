import { useDroppable } from '@dnd-kit/core';

type Props = { children: React.ReactNode; id: string };

// Component to show when column is empty
export default function Dropzone(props: Props) {
	const { setNodeRef } = useDroppable({
		id: props.id,
	});
	return (
		<div
			ref={setNodeRef}
			className="flex items-center justify-center w-full h-12 rounded-lg bg-muted text-muted-foreground"
		>
			{props.children}
		</div>
	);
}
