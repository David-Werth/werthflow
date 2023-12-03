import { Task } from './task';

export type Sortable = {
	id: string;
	title: string;
	folderId: string;
	createdAt?: string;
	updatedAt?: string;
	tasks: Task[];
};
