import Board from '@/components/main/board';
import { UserDataContext } from '@/components/providers/user-data-provider';
import Sidebar from '@/components/shared/sidebar/sidebar';
import { UserData } from '@/lib/types/user-data';
import { useUser } from '@clerk/clerk-react';
import { Cable, Loader2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Main() {
	const { user } = useUser();

	const { setUserData } = useContext(UserDataContext);

	const [isLoading, setIsLoading] = useState(false);

	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (user?.username) {
			/*
			 * Create user after signin
			 */
			async function createUser(id: string, username: string) {
				const res = await fetch(`${apiUrl}/user/${id}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ name: username }),
				});
				if (res.ok) {
					setIsLoading(false);
				} else setIsError(true);
			}

			/*
			 * Function to get user data from the database
			 */
			async function getUserById(id: string, username: string) {
				setIsLoading(true);

				const res = await fetch(`${apiUrl}/user/${id}`);

				if (res.ok) {
					const { data } = await res.json();
					setUserData(data as UserData);
					setIsLoading(false);
				} else {
					createUser(id, username);
				}
			}

			getUserById(user.id, user.username);
		}
	}, []);

	return (
		<>
			<Sidebar />
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
