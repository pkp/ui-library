import {ref} from 'vue';
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

export const Controlled = {
	args: {
		id: 'controlled-combobox',
		items: countries,
		placeholder: 'Search for a country...',
	},
	render: (args) => ({
		components: {PkpCombobox},
		setup() {
			const selected = ref(null);
			const setFrance = () => {
				selected.value = countries.find((c) => c.value === 'fr');
			};
			const reset = () => {
				selected.value = null;
			};
			return {args, selected, setFrance, reset};
		},
		template: `
			<div>
				<label for="controlled-combobox">Country (controlled)</label>
				<PkpCombobox v-bind="args" v-model="selected" />
				<div style="margin-top: 1rem;">
					<strong>Selected:</strong> {{ selected ? selected.label : 'None' }}
				</div>
				<div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
					<button @click="setFrance">Set to France</button>
					<button @click="reset">Reset</button>
				</div>
			</div>
		`,
	}),
};

export const WithDefaultValue = {
	args: {
		id: 'default-value-combobox',
		items: countries,
		placeholder: 'Search for a country...',
		defaultValue: countries.find((c) => c.value === 'fr'),
	},
	render: (args) => ({
		components: {PkpCombobox},
		setup() {
			return {args};
		},
		template: `
			<div>
				<label for="default-value-combobox">Country (with default)</label>
				<PkpCombobox v-bind="args" />
			</div>
		`,
	}),
};
