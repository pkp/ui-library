import Notification from './Notification.vue';
import Icon from '@/components/Icon/Icon.vue';
import {ref} from 'vue';

export default {
	title: 'Components/Notification',
	component: Notification,
};

export const Default = {
	render: (args) => ({
		components: {Notification},
		setup() {
			return {args};
		},
		template: `
			<Notification v-bind="args" >
				Revisions have been submitted and a decision is required.
			</Notification>
		`,
	}),
	args: {},
};

export const Success = {
	render: (args) => ({
		components: {Notification},
		setup() {
			return {args};
		},
		template: `
			<Notification v-bind="args" >
				This article has been been successfully published.
				<a href="#">View Article</a>
				.
			</Notification>
		`,
	}),
	args: {type: 'success'},
};

export const Warning = {
	render: (args) => ({
		components: {Notification, Icon},
		setup() {
			return {args};
		},
		template: `
			<Notification v-bind="args" >
				<Icon icon="Error" class="h-5 w-5 me-1" :inline="true" />
				<span class="align-middle">
					This submission does not have any contributors. At least one contributor
					must be provided.
				</span>
			</Notification>
		`,
	}),
	args: {type: 'warning'},
};

export const CanBeDismissed = {
	render: (args) => ({
		components: {Notification, Icon},
		setup() {
			const dismissed = ref(false);
			function dismiss() {
				dismissed.value = true;
			}
			return {args, dismissed, dismiss};
		},
		template: `
			<Notification v-bind="args" v-if="!dismissed" @dismiss="dismiss" >
				This notification can be dismissed.
			</Notification>
		`,
	}),
	args: {type: 'warning', canDismiss: true},
};
