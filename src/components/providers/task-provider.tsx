import { Items } from '@/lib/types/items';
import { createContext, useState } from 'react';

type TaskContextType = {
	items: Items;
	setItems: React.Dispatch<React.SetStateAction<Items>>;
};

export const TaskContext = createContext<TaskContextType>(
	{} as TaskContextType
);

export const TaskContextWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [items, setItems] = useState<Items>({
		TODO: [],
		DOING: [],
		DONE: [],
	});

	return (
		<TaskContext.Provider value={{ items, setItems }}>
			{children}
		</TaskContext.Provider>
	);
};
