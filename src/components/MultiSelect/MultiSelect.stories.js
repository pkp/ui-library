import {ref} from 'vue';
import MultiSelect from './MultiSelect.vue';

export default {
	title: 'Components/MultiSelect',
	component: MultiSelect,
	render: (args) => ({
		components: {MultiSelect},
		setup() {
			const value = ref(args.modelValue ?? []);
			return {args, value};
		},
		template: `
			<div style="max-width: 20rem;">
				<MultiSelect v-bind="args" v-model="value" />
				<p style="margin-top: 0.5rem;">
					<strong>Selected:</strong> {{ value.length ? value.join(', ') : 'None' }}
				</p>
			</div>
		`,
	}),
};

// Use case: selecting which review rounds to associate with a publication.
const reviewRounds = [
	{value: 1, label: 'Round 1'},
	{value: 2, label: 'Round 2'},
	{value: 3, label: 'Round 3'},
	{value: 4, label: 'Round 4'},
];

export const Default = {
	args: {
		modelValue: [],
		options: reviewRounds,
		ariaLabel: 'Review rounds',
		placeholder: 'Select review rounds',
	},
};

export const Preselected = {
	args: {
		modelValue: [2],
		options: reviewRounds,
		ariaLabel: 'Review rounds',
		placeholder: 'Select review rounds',
	},
};

// Round 1 is already associated with a different publication: it is still listed
// so the user can see it, but it is disabled and cannot be selected.
export const DisabledOption = {
	args: {
		modelValue: [],
		options: reviewRounds.map((round) =>
			round.value === 1 ? {...round, disabled: true} : round,
		),
		ariaLabel: 'Review rounds',
		placeholder: 'Select review rounds',
	},
};

// Round 1 is locked to this publication: it shows as selected (checked) but is
// disabled, so the user can see it is included yet cannot unselect it.
export const DisabledOptionSelected = {
	args: {
		modelValue: [1],
		options: reviewRounds.map((round) =>
			round.value === 1 ? {...round, disabled: true} : round,
		),
		ariaLabel: 'Review rounds',
		placeholder: 'Select review rounds',
	},
};

export const Disabled = {
	args: {
		modelValue: [2],
		options: reviewRounds,
		ariaLabel: 'Review rounds',
		placeholder: 'Select review rounds',
		disabled: true,
	},
};
