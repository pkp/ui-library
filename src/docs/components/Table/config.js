import articleStats from './helpers/articleStats.js';
import articleStatsColumns from './helpers/articleStatsColumns.js';

export const props = {
	label: 'Example Table',
	description: '',
	labelledBy: '',
	describedBy: '',
	columns: articleStatsColumns,
	rows: articleStats.slice(0, 10),
	orderBy: '',
	orderDirection: false
};

export const propDocs = [
	{
		key: 'columns',
		description: 'An array of configuration objects for each column.'
	},
	{
		key: 'describedBy',
		description:
			'The id of one or more HTML elements that describe the table, to be used in an <code>aria-describedby</code> attribute. This prop is not required unless additional information about the table is available and not included in the <code>description</code> prop.'
	},
	{
		key: 'description',
		description: 'An optional description of the table.'
	},
	{
		key: 'label',
		description:
			'A name for the table. If no <code>label</code> is provided, you must make use of the <code>labelledBy</code> prop.'
	},
	{
		key: 'labelledBy',
		description:
			'The id of one or more HTML elements that name the table, to be used in an <code>aria-labelledby</code> attribute. This prop should not be used if a <code>label</code> is provided.'
	},
	{
		key: 'orderBy',
		description: 'The name of the column that the rows are ordered by.'
	},
	{
		key: 'orderDirection',
		description: 'The direction that rows are ordered by as a boolean.'
	},
	{
		key: 'rows',
		description: 'The items to display in the table.'
	}
];

export const emitDocs = [
	{
		key: 'order-by',
		description:
			'Make a request to reorder the items in the table. Passes the requested `orderBy` and `orderDirection` params.'
	}
];

export default {
	emitDocs,
	props,
	propDocs
};
