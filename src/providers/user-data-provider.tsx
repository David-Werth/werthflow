import { createContext, useState } from 'react';
import { UserData } from '@/types/user-data';

type UserDataContextType = {
	userData: UserData;
	setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};

export const UserDataContext = createContext<UserDataContextType>(
	{} as UserDataContextType
);

export const UserDataContextWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [userData, setUserData] = useState({} as UserData);

	return (
		<UserDataContext.Provider value={{ userData, setUserData }}>
			{children}
		</UserDataContext.Provider>
	);
};
