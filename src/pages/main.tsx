import TodoCard from '@/components/main/todo-card';
import { UserButton } from '@clerk/clerk-react';

export default function Main() {
	return (
		<div className="flex items-center justify-center w-full h-full">
			<div className="fixed right-5 top-5">
				<UserButton />
			</div>
			<div className="grid max-w-3xl grid-cols-4">
				<div>
					test
					<TodoCard />
					<TodoCard />
				</div>
				<div>test</div>
				<div>test</div>
			</div>
		</div>
	);
}
