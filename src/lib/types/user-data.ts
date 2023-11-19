import { Folder } from './folder';

export type UserData = {
	id?: string;
	userId: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
	folders: Folder[];
};
