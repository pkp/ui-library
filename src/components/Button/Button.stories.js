import Button from './Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import Badge from '@/components/Badge/Badge.vue';

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

export const Primary = {
	args: {
		slot: 'Primary',
		isPrimary: true,
	},
};

export const PrimaryDisabled = {
	args: {
		slot: 'Primary Disabled',
		isPrimary: true,
		isDisabled: true,
	},
};

export const Secondary = {
	args: {
		slot: 'Submit',
	},
};

export const SecondaryDisabled = {
	args: {
		slot: 'Submit',
		isDisabled: true,
	},
};

export const Warnable = {
	args: {
		slot: 'Delete',
		isWarnable: true,
	},
};

export const WarnableDisabled = {
	args: {
		slot: 'Delete',
		isWarnable: true,
		isDisabled: true,
	},
};

export const IsCompact = {
	args: {
		slot: 'Delete',
		sizeVariant: 'compact',
	},
};

export const isFullWidth = {
	render: (args) => ({
		components: {Button, Badge},
		setup() {
			return {args};
		},
		template: `
			<div class="flex">
				<ul class="">
					<li v-for="item in args.items" class="border-t last:border-b border-light border-l border-r">					
						<Button v-bind="args" :is-active="item.isSelected">
							<Badge :color-variant="item.isSelected ? 'default-on-dark' : 'primary'">
								<span class="text-base-bold">
									{{ item.number }}
								</span>
							</Badge>
							<span class="ms-1">
								{{item.label}}
							</span>
						</Button>
					</li>
				</ul>	
			</div>
			`,
	}),

	args: {
		sizeVariant: 'fullWidth',
		items: [
			{
				isSelected: true,
				label: 'Action Required by me',
				number: 10,
			},
			{
				isSelected: false,
				label: 'Author revision submitted',
				number: 10,
			},
			{
				isSelected: false,
				label: 'Author revision submitted long view name',
				number: 10,
			},
		],
	},
};

export const WithIcon = {
	render: (args) => ({
		components: {Button, Icon},
		setup() {
			return {args};
		},
		template: `
			<div>
				<div>
					<Button icon="BackButton" >
						Back
					</Button>
				</div>	
				<div class="mt-2">
					<Button icon="Search">
						Search
					</Button>
				</div>
				<div class="mt-2">
					<Button icon="Cancel" isWarnable>
						Search
					</Button>
				</div>
				<div class="mt-2">
					<Button icon="Cancel" isActive>
						Search
					</Button>
				</div>

			</div>
			`,
	}),
};

export const IsActive = {
	render: (args) => ({
		components: {Button},
		setup() {
			const isActive = ref(false);
			function toggle() {
				isActive.value = !isActive.value;
			}
			return {args, isActive, toggle};
		},
		template: `
			<Button v-bind="args" :is-active="isActive" @click="toggle">
				Expand Details
			</Button>`,
	}),
};

export const ButtonLikeLink = {
	args: {
		slot: 'Button-like Link',
		element: 'a',
		href: 'https://example.org',
		isDisabled: true,
	},
};

export const LinkLikeButton = {
	render: (args) => ({
		components: {Button},
		setup() {
			return {args};
		},
		template: `
			<div>
				<Button v-bind="args">
					Link like Button
				</Button>
			</div>
			<div>
				<Button v-bind="args" isWarnable>
					<Icon class="w-5 h-5" icon="Cancel" />
					Link like Button Warnable
				</Button>
			</div>
			<div>
				<Button v-bind="args" icon="Cancel" isDisabled>
					Link like Button Disabled
				</Button>
			</div>

				
				`,
	}),
	args: {isLink: true},
};
