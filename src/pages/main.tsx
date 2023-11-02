import TodoCard from '@/components/main/todo-card';
import { cards } from '@/lib/mock/card-data';
import { UserButton } from '@clerk/clerk-react';

export default function Main() {
	return (
		<div className="flex items-center justify-center w-full h-full">
			<div className="fixed right-5 top-5">
				<UserButton afterSignOutUrl="http://localhost:5173/" />
			</div>
			<div className="grid max-w-3xl grid-cols-4">
				<div>
					To-do
					{cards.map((card) => {
						return (
							<TodoCard state={card.state} title={card.title} content={card.content} />
						);
					})}
				</div>
				<div>In Progress</div>
				<div>Done</div>
			</div>
		</div>
	);
}
