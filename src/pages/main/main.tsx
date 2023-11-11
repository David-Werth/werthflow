import Board from '@/components/main/board';
import { Items } from '@/lib/types/items';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

const initItems = {
	TODO: [],
	DOING: [],
	DONE: [],
};

export default function Main() {
	const { user } = useUser();

	const [items, setItems] = useState<Items>(initItems);

	useEffect(() => {
		if (user?.username) {
			/*
			 * Update or insert a user in the database
			 */
			async function createUser(id: string, username: string, items: string) {
				const res = await fetch(`${apiUrl}/user/${id}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ name: username, tasks: items }),
				});
				if (res.ok) {
					const { data } = await res.json();
					console.log(data);
				} else console.log('not nice');
			}

			/*
			 * Function to get user data from the database
			 */
			async function getUser(id: string, username: string) {
				let res = await fetch(`${apiUrl}/user/${id}`);

				if (res.ok) {
					const { data } = await res.json();
					if (!data) {
						createUser(id, username, JSON.stringify(items));
					} else {
						setItems(JSON.parse(data.tasks));
					}
				} else {
					createUser(id, username, JSON.stringify(items));
				}
			}

			getUser(user.id, user.username);
		}
	}, []);

	useEffect(() => {
		async function updateUserTasks(id: string, items: string) {
			const res = await fetch(`${apiUrl}/user/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ tasks: items }),
			});

			if (res.ok) {
				// const { data } = await res.json();
			} else {
				console.log('We have a problem', res.status);
			}
		}
		if (user?.id) updateUserTasks(user.id, JSON.stringify(items));
	}, [items]);

	return (
		<div>
			<Board items={items} setItems={setItems} />
		</div>
	);
}
