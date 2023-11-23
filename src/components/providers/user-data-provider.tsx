import { UserData } from '@/lib/types/user-data';
import { createContext, useState } from 'react';

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
	// const [folders, setFolders] = useState(userData.folders)

	return (
		<UserDataContext.Provider value={{ userData, setUserData }}>
			{children}
		</UserDataContext.Provider>
	);
};
