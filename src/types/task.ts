export type Task = {
	id: string;
	index: number;
	title: string;
	content?: string;
	sortableId: string;
	userId: string;
	createdAt?: string;
	updatedAt?: string;
};
