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

export const Secondary = {
	args: {
		slot: 'Submit',
	},
};

export const Warnable = {
	args: {
		slot: 'Delete',
		isWarnable: true,
	},
};

export const IsCompact = {
	args: {
		slot: 'Delete',
		isCompact: true,
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
				<ul class="bg-medium">
					<li>					
						<Button v-bind="args" isActive>
							<Badge :on-dark-background="true">
								<span class="text-base-bold">
									{{ 15 }}
								</span>
							</Badge>
							<span class="ms-1">
								Action Required by me
							</span>
						</Button>
					</li>
					<li class="-mt-[1px]">					
						<Button v-bind="args">
							<Badge>
								<span :class="">
									{{ 10 }}
								</span>
							</Badge>
							<span class="ms-1">
								Author revision submitted
							</span>

						</Button>
					</li>
					<li class="-mt-[1px]">					
						<Button v-bind="args">
							<Badge>
								<span :class="">
									{{ 10 }}
								</span>
							</Badge>
							<span class="ms-1">
								Author revision submitted long view name
							</span>
						</Button>
					</li>
				</ul>
				</div>	
			</div>
			`,
	}),

	args: {
		isFullWidth: true,
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
					<Button >
						<Icon class="w-5 h-5" icon="BackButton" />
						Back
					</Button>
				</div>	
				<div class="mt-2">
					<Button >
						<Icon class="w-5 h-5" icon="Search"/>
						Search
					</Button>
				</div>
				<div class="mt-2">
					<Button isWarnable>
						<Icon class="w-5 h-5" icon="Cancel" />
						Search
					</Button>
				</div>
				<div class="mt-2">
					<Button isActive>
						<Icon class="w-5 h-5" icon="Cancel" />
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
	args: {slot: 'Button-like Link', element: 'a', href: 'https://example.org'},
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
					Link like Button
				</Button>
			</div>
				
				`,
	}),
	args: {isLink: true},
};
