import {http, HttpResponse} from 'msw';

import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';
import Icon from '@/components/Icon/Icon.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldBaseAutosuggestMock from '../mocks/field-autosuggest';
import UsernamesMock from '@/mocks/usernames.json';
import InstitutionsMock from '@/mocks/institutions.json';

export default {
	title: 'Forms/FieldBaseAutosuggest',
	component: FieldBaseAutosuggest,
	render: (args) => ({
		components: {Example},
		setup() {
			function change(name, prop, newValue, localeKey) {
				if (localeKey) {
					args[prop][localeKey] = newValue;
				} else {
					args[prop] = newValue;
				}
			}

			return {args, change};
		},
		template: `
			<Example v-bind="args" @change="change" />
		`,
	}),

	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/users',
					async (req, res, ctx) => {
						return HttpResponse.json(UsernamesMock);
					},
				),
			],
		},
		docs: {
			story: {
				height: '300px',
			},
		},
	},
};

const Example = {
	extends: FieldBaseAutosuggest,
	methods: {
		setSuggestions(items) {
			// Escape the search phrase for regex
			// See: https://stackoverflow.com/a/3561711/1723499
			const regex = new RegExp(
				this.inputValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
				'gi',
			);

			const suggestions = items
				.filter((u) => u.fullName.match(regex))
				.filter((u) => !this.currentValue.includes(u.id))
				.map((u) => {
					return {
						value: u.id,
						label: u.fullName,
					};
				});

			this.suggestions = [...suggestions];
		},
	},
};

export const Base = {
	args: {
		...FieldBaseMock,
		...FieldBaseAutosuggestMock,
		apiUrl: 'https://mock/index.php/publicknowledge/api/v1/users',
		label: 'Select Users',
		selected: [],
	},
};

export const Disabled = {
	args: {
		...Base.args,
		isDisabled: true,
		selected: [{value: 1, label: 'Daniel Barnes'}],
		value: [1],
	},
};

export const Inline = {
	args: {
		...Base.args,
		label: 'To:',
		isLabelInline: true,
	},
};

const RORExample = {
	extends: FieldBaseAutosuggest,
	methods: {
		setSuggestions(items) {
			// Escape the search phrase for regex
			// See: https://stackoverflow.com/a/3561711/1723499
			const regex = new RegExp(
				this.inputValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
				'gi',
			);

			const suggestions = items
				.filter((u) => u.fullName.match(regex))
				.filter((u) => !this.currentValue.includes(u.id))
				.map((u) => {
					return {
						value: u.id,
						label: u.fullName,
						hasSlot: u.ror,
					};
				});

			this.suggestions = [...suggestions];
		},
	},
};

export const CustomOptions = {
	render: (args) => ({
		components: {RORExample, Icon},
		setup() {
			function change(name, prop, newValue, localeKey) {
				if (localeKey) {
					args[prop][localeKey] = newValue;
				} else {
					args[prop] = newValue;
				}
			}

			return {args, change};
		},
		template: `
			<RORExample v-bind="args" @change="change">
				<template #input-slot>
					<Icon icon="ROR" class="ms-2 h-auto w-6" :inline="true" />
				</template>
				<template #option="{ suggestion }">
					{{ suggestion.label }}
					<Icon v-if="suggestion.hasSlot" icon="ROR" class="ms-2 h-auto w-6" :inline="true" />
					<a v-if="suggestion.hasSlot" href="#" target="_blank" class="ms-auto flex">
						<span class="sr-only">Open link in new tab</span>
						<Icon icon="NewTab" class="text-primary h-5 w-5" :inline="true" />
					</a>
				</template>
			</RORExample>
		`,
	}),
	args: {
		...FieldBaseMock,
		...FieldBaseAutosuggestMock,
		apiUrl: 'https://mock/index.php/publicknowledge/api/v1/users',
		label: 'Select Users',
		selected: [],
		isMultiple: false,
	},
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/users',
					async (req, res, ctx) => {
						return HttpResponse.json(InstitutionsMock);
					},
				),
			],
		},
		docs: {
			story: {
				height: '300px',
			},
		},
	},
};
