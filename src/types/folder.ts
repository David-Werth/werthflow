import { Sortable } from './sortable';
import { Task } from './task';

export type Folder = {
	id: string;
	title: string;
	userId: string;
	createdAt?: string;
	updatedAt?: string;
	sortables: Sortable[];
	tasks: Task[];
};
