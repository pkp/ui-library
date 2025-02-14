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
				<Icon icon="Comment" class="h-3 w-3 me-1" :inline="true" />{{args.slot}}
			</Badge>`,
	}),
};

export const WithIcon = {
	args: {
		slot: 'Review sent',
		label: 'Review review sent',
		icon: 'ReviewSent',
		colorVariant: 'stage-in-review-bg',
	},
};

export const VariantDefaultOnDark = {
	args: {
		slot: 'Review overdue',
		label: 'Review overdue',
		colorVariant: 'default-on-dark',
	},
	decorators: [
		() => ({
			template: '<div class="bg-selection-dark p-2"><story/></div>',
		}),
	],
};

export const VariantPrimary = {
	args: {
		slot: 'Review overdue',
		label: 'Review overdue',
		colorVariant: 'primary',
	},
};

export const VariantPrimaryBg = {
	args: {
		slot: 'Review overdue',
		label: 'Review overdue',
		colorVariant: 'primary-bg',
	},
};

export const VariantSuccessBg = {
	args: {
		slot: 'Review overdue',
		label: 'Review overdue',
		colorVariant: 'success-bg',
	},
};

export const VariantAttention = {
	args: {
		slot: 'Competing interests',
		label: 'Competing interests',
		colorVariant: 'attention',
	},
};

export const VariantAttentionBg = {
	args: {
		slot: 'Review overdue',
		label: 'Review overdue',
		colorVariant: 'attention-bg',
	},
};

export const VariantNegativeBg = {
	args: {
		slot: 'Review overdue',
		label: 'Review overdue',
		colorVariant: 'negative-bg',
	},
};

export const VariantStageInReviewBg = {
	args: {
		slot: 'Review overdue',
		label: 'Review overdue',
		colorVariant: 'stage-in-review-bg',
	},
};
