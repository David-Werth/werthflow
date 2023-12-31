import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cable, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

import { UserDataContext } from '@/providers/user-data-provider';
import { LoadingState } from '@/types/loading-state';
import { UserData } from '@/types/user-data';
import Board from '@/pages/main/home-page/dnd-components/board';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Homepage() {
	const { user } = useUser();
	const navigate = useNavigate();
	const { setUserData } = useContext(UserDataContext);
	const [loadingState, setLoadingState] = useState<LoadingState>('loading');

	useEffect(() => {
		setUserData({} as UserData);

		if (user?.username) {
			// Function to create a new user if not exists / is first sign in
			const createUser = async (id: string, username: string): Promise<void> => {
				try {
					const res = await fetch(`${apiUrl}/user/${id}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ name: username }),
					});

					if (res.ok) {
						setLoadingState('loaded');
						const { data } = await res.json();
						setUserData(data as UserData);
					} else {
						setLoadingState('error');
					}
				} catch (error) {
					console.error('Error creating user:', error);
					setLoadingState('error');
				}
			};

			const getUserById = async (id: string, username: string) => {
				setLoadingState('loading');

				try {
					const res = await fetch(`${apiUrl}/user/${id}`);

					if (res.ok) {
						const { data } = await res.json();

						setUserData(data as UserData);

						// Redirect to the first folder if available
						if (data.folders[0]) navigate(`/${data.folders[0].id}`);
						setLoadingState('loaded');
					} else {
						createUser(id, username);
						setLoadingState('error');
					}
				} catch (error) {
					console.error('Error fetching user data:', error);
					setLoadingState('error');
				}
			};
			getUserById(user.id, user.username);
		}
	}, []);

	return (
		<>
			{loadingState === 'loading' ? (
				<div className="flex flex-col items-center justify-center w-full h-full gap-5">
					<Loader2 className="w-10 h-10 animate-spin" />
					{(loadingState as LoadingState) === 'error' && (
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
