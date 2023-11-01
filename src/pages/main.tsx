import CardTest from '@/components/main/card-test';

export default function Main() {
	return (
		<div className="flex items-center justify-center w-full h-full">
			<div className="grid max-w-3xl grid-cols-4">
				<div>
					test
					<CardTest />
				</div>
				<div>test</div>
				<div>test</div>
			</div>
		</div>
	);
}
