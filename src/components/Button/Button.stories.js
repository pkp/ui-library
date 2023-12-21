import Button from './Button.vue';
import Icon from '@/components/Icon/Icon.vue';

import {ref} from 'vue';
export default {
	title: 'Components/Button',
	component: Button,
	render: (args) => ({
		components: {Button},
		setup() {
			return {args};
		},
		template: '<Button v-bind="args">{{args.slot}}</Button>',
	}),
};

export const Default = {
	args: {
		slot: 'Submit',
	},
};

export const Primary = {
	args: {
		slot: 'Primary',
		isPrimary: true,
	},
};

export const Warnable = {
	args: {
		slot: 'Delete',
		isWarnable: true,
	},
};

export const WithIcon = {
	render: (args) => ({
		components: {Button, Icon},
		setup() {
			return {args};
		},
		template: `
			<Button v-bind="args">
				<Icon icon="filter" :inline="true" />
				Filters
			</Button>`,
	}),
};

export const ExpandDetails = {
	render: (args) => ({
		components: {Button},
		setup() {
			const isActive = ref(false);
			return {args, isActive};
		},
		template: `
			<Button v-bind="args" :is-active="isActive" @click="isActive = !isActive">
				Expand Details
			</Button>`,
	}),
};

export const ButtonLikeLink = {
	args: {slot: 'Button-like Link', element: 'a', href: 'https://example.org'},
};

export const LinkLikeButton = {
	args: {slot: 'Link-like Button', isLink: true},
};
