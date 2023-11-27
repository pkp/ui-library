import Button from './Button.vue';
import Icon from '@/components/Icon/Icon.vue';

import {ref} from 'vue';
export default {
	title: 'Basic Components/Button',
	component: Button,
};

export const Default = {
	render: (args) => ({
		components: {Button},
		setup() {
			return {args};
		},
		template: '<Button v-bind="args">Submit</Button>',
	}),
	args: {},
};

export const Primary = {
	render: (args) => ({
		components: {Button},
		setup() {
			return {args};
		},
		template: '<Button v-bind="args">Primary</Button>',
	}),
	args: {
		isPrimary: true,
	},
};

export const Warnable = {
	render: (args) => ({
		components: {Button},
		setup() {
			return {args};
		},
		template: '<Button v-bind="args">Delete</Button>',
	}),
	args: {
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
	render: (args) => ({
		components: {Button},
		setup() {
			const isActive = ref(false);
			return {args, isActive};
		},
		template: `
			<Button v-bind="args">
				Button-like Link
			</Button>`,
	}),
	args: {element: 'a', href: 'https://example.org'},
};

export const LinkLikeButton = {
	render: (args) => ({
		components: {Button},
		setup() {
			return {args};
		},
		template: `
			<Button v-bind="args">
				Link-like Button
			</Button>`,
	}),
	args: {isLink: true},
};
