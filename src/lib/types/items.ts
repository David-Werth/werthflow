export type Items = {
	TODO: {
		id: string;
		title: string;
		content: string;
	}[];
	DOING: {
		id: string;
		title: string;
		content: string;
	}[];
	DONE: {
		id: string;
		title: string;
		content: string;
	}[];
};
