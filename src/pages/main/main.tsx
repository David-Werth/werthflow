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
			async function upsertUser(id: string, username: string) {
				const res = await fetch(`${apiUrl}/user/${id}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ name: username }),
				});
				if (res.ok) {
					console.log(await res.json());
				} else console.log('not nice');
			}

			async function getUser(id: string, username: string) {
				let res = await fetch(`${apiUrl}/user/${id}`);
				if (res.ok) {
					const { data } = await res.json();

					//check if username was updated
					if (data.name === username) {
					} else upsertUser(id, username);
				} else {
					upsertUser(id, username);
				}
			}

			getUser(user.id, user.username);
		}
	}, []);

	return (
		<div>
			<Board items={items} setItems={setItems} />
		</div>
	);
}
