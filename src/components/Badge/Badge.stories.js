import Badge from './Badge.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	title: 'Components/Badge',
	component: Badge,
	render: (args) => ({
		components: {Badge},
		setup() {
			return {args};
		},
		template: '<Badge v-bind="args" >{{args.slot}}</Badge>',
	}),
};

export const Default = {
	args: {
		label: '32 submissions',
		slot: '32',
	},
};

export const DefaultOnDarkBackground = {
	args: {
		onDarkBackground: true,
		label: '32 submissions',
		slot: '32',
	},
	decorators: [
		() => ({
			template: '<div class="bg-primary p-2"><story/></div>',
		}),
	],
};

export const IsPrimary = {
	args: {
		slot: '4',
		isPrimary: true,
	},
};

export const IsSuccess = {
	args: {
		slot: 'Published',
		isSuccess: true,
	},
};

export const IsWarnable = {
	args: {
		slot: '7',
		label: '7 new messages',
		isWarnable: true,
	},
};

export const HasDot = {
	args: {
		slot: 'Author',
		label: 'Participant assigned as author',
		hasDot: true,
	},
};

export const Submission = {
	args: {
		slot: 'Submission',
		stage: 'submission',
		label: 'Currently in the submission stage',
		isButton: true,
	},
};

export const IsButton = {
	args: {
		slot: 'Layout Editor',
		label: 'View all layout editors',
		isButton: true,
	},
};

export const Comments = {
	args: {
		slot: '25',
		label: '25 comments',
	},
	render: (args) => ({
		components: {Badge, Icon},
		setup() {
			return {args};
		},
		template: `
			<Badge v-bind="args" >			
				<Icon icon="comment-o" :inline="true" />{{args.slot}}
			</Badge>`,
	}),
};
