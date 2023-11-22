import Board from '@/components/main/board';
import { TaskContext } from '@/components/providers/task-provider';
import { useUser } from '@clerk/clerk-react';
import { Cable, Loader2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Main() {
	const { user } = useUser();

	const { items, setItems } = useContext(TaskContext);

	const [isLoading, setIsLoading] = useState(false);

	const [isError, setIsError] = useState(false);

	const [isFetched, setIsFetched] = useState(false);

	useEffect(() => {
		if (user?.username) {
			/*
			 * Create user after signin if new user
			 */
			async function createUser(id: string, username: string, data: string) {
				setItems({
					TODO: [],
					DOING: [],
					DONE: [],
				});
				const res = await fetch(`${apiUrl}/user/${id}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ name: username, tasks: data }),
				});
				if (res.ok) {
					setIsLoading(false);
					setIsFetched(true);
				} else setIsError(true);
			}

			/*
			 *  Get user data from database
			 */
			async function getUser(id: string, username: string) {
				setIsLoading(true);

				const res = await fetch(`${apiUrl}/user/${id}`);

				if (res.ok) {
					const { data } = await res.json();
					if (!data) {
						createUser(id, username, JSON.stringify(items));
					} else {
						setItems(JSON.parse(data.tasks));
						setIsLoading(false);
						setIsFetched(true);
					}
				} else {
					createUser(id, username, JSON.stringify(items));
				}
			}

			getUser(user.id, user.username);
		}
	}, []);

	useEffect(() => {
		async function updateUserTasks(id: string, data: string) {
			const res = await fetch(`${apiUrl}/user/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ tasks: data }),
			});

			if (res.ok) {
				setIsError(false);
			} else {
				setIsError(true);
			}
		}
		if (user && isFetched) {
			updateUserTasks(user.id, JSON.stringify(items));
		}
	}, [items]);

	return (
		<>
			{isLoading ? (
				<div className="flex flex-col items-center justify-center w-full h-full gap-5">
					<Loader2 className="w-10 h-10 animate-spin" />
					{isError && (
						<p className="text-xl">
							Please check your connection! <Cable className="inline-block" />
						</p>
					)}
				</div>
			) : (
				<Board />
			)}
		</>
	);
}
