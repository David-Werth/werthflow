import { Items } from '@/lib/types/items';
import { createContext, useState } from 'react';

type TaskContextType = {
	items: Items;
	setItems: React.Dispatch<React.SetStateAction<Items>>;
};

export const TaskContext = createContext<TaskContextType>(
	{} as TaskContextType
);

const initItems = {
	TODO: [],
	DOING: [],
	DONE: [],
};

export const TaskContextWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [items, setItems] = useState<Items>(initItems);

	return (
		<TaskContext.Provider value={{ items, setItems }}>
			{children}
		</TaskContext.Provider>
	);
};
