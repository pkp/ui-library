import issue from '@/docs/data/issue';
import doi from '@/docs/data/doi';

export default [
	issue,
	{
		...issue,
		id: 2,
		identification: 'Vol 1. No 2. (2020): Issue Number 2',
		number: '2',
		doiObject: {
			...doi,
			identifier: '10.987/iss456'
		},
		title: {
			en_US: 'Issue Number 2',
			fr_CA: 'Issue Number 2'
		}
	},
	{
		...issue,
		id: 3,
		identification: 'Vol 1. No 3. (2020): Issue Number 3',
		number: '3',
		doiObject: {
			...doi,
			identifier: '10.987/iss789'
		},
		title: {
			en_US: 'Issue Number 3',
			fr_CA: 'Issue Number 3'
		}
	},
	{
		...issue,
		id: 4,
		identification: 'Vol 1. No 4. (2020): Issue Number 4',
		number: '4',
		doiObject: {
			...doi,
			identifier: '10.987/iss012'
		},
		title: {
			en_US: 'Issue Number 4',
			fr_CA: 'Issue Number 4'
		}
	}
];
