export default [
	{
		name: 'id',
		label: 'ID',
		value(row) {
			return row.object.id;
		}
	},
	{
		name: 'title',
		label: 'Title',
		isRowHeader: true,
		value(row) {
			return row.object.fullTitle.en_US;
		}
	},
	{
		name: 'author',
		label: 'Contributors',
		value(row) {
			return row.object.authorString;
		}
	},
	{
		name: 'abstractViews',
		label: 'Abstract Views',
		value: 'abstractViews'
	},
	{
		name: 'galleyViews',
		label: 'Galley Views',
		value: 'galleyViews'
	},
	{
		name: 'pdf',
		label: 'PDF',
		value: 'pdf'
	},
	{
		name: 'html',
		label: 'HTML',
		value: 'html'
	},
	{
		name: 'other',
		label: 'Other',
		value: 'other'
	},
	{
		name: 'total',
		label: 'Total',
		value: 'total'
	}
];
