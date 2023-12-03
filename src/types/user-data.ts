import { Folder } from './folder';
import { Sortable } from './sortable';
import { Task } from './task';

export type UserData = {
	id?: string;
	userId: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
	folders: Folder[];
	sortables: Sortable[];
	tasks: Task[];
};
