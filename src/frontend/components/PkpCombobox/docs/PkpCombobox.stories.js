import '@/styles/frontend-theme.css';
import PkpCombobox from '../PkpCombobox.vue';

export default {
	title: 'Frontend/PkpCombobox',
	component: PkpCombobox,
	render: (args) => ({
		components: {PkpCombobox},
		setup() {
			return {args};
		},
		template: '<PkpCombobox v-bind="args" />',
	}),
};

const countries = [
	{value: 'us', label: 'United States'},
	{value: 'ca', label: 'Canada'},
	{value: 'mx', label: 'Mexico'},
	{value: 'gb', label: 'United Kingdom'},
	{value: 'fr', label: 'France'},
	{value: 'de', label: 'Germany'},
	{value: 'es', label: 'Spain'},
	{value: 'it', label: 'Italy'},
	{value: 'jp', label: 'Japan'},
	{value: 'cn', label: 'China'},
	{value: 'br', label: 'Brazil'},
	{value: 'au', label: 'Australia'},
];

export const Primary = {
	args: {
		id: 'country-combobox',
		items: countries,
		placeholder: 'Search for a country...',
	},
	render: (args) => ({
		components: {PkpCombobox},
		setup() {
			return {args};
		},
		template: `
			<div>
				<label for="country-combobox">Country</label>
				<PkpCombobox v-bind="args" />
			</div>
		`,
	}),
};
