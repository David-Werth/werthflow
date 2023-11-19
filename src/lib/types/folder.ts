import { Sortable } from './sortable';

export type Folder = {
	id: string;
	title: string;
	userId: string;
	createdAt?: string;
	updatedAt?: string;
	sortables: Sortable[];
};
