type CardState = 'TODO' | 'INPROGRESS' | 'DONE';

type Cards = {
	id: string;
	title: string;
	content: string;
	state: CardState;
}[];

export const cards: Cards = [
	{
		id: 'b38d41f2-9eb9-5b84-bf1f-4eda4e8353d2',
		title: 'youth',
		content: 'account prevent tent against claws make gulf hope',
		state: 'TODO',
	},
	{
		id: 'fcd5d786-662d-52a7-a99b-bbe2a6d5e791',
		title: 'card',
		content: 'youth shut lost coat twenty something',
		state: 'TODO',
	},
	{
		id: '2ef1937d-ef6e-5c3f-a746-5fbde71c25ff',
		title: 'stranger',
		content: 'wheel eleven rapidly tired its early yard military ',
		state: 'TODO',
	},
	{
		id: '26f59c1b-1cdf-575c-8959-49ee40adbfd6',
		title: 'road',
		content: 'mistake operation replace smile couple bag flag ',
		state: 'TODO',
	},
	{
		id: 'acfbbd09-f55b-5482-8ca0-2628b15838f2',
		title: 'way',
		content: 'grade history hide from vegetable noted afraid angle ',
		state: 'TODO',
	},
];
