import '@/styles/frontend-theme.css';
import PkpIcon from '../PkpIcon.vue';

export default {
	title: 'Frontend/PkpIcon',
	component: PkpIcon,
	render: (args) => ({
		components: {PkpIcon},
		setup() {
			return {args};
		},
		template: '<PkpIcon v-bind="args" />',
	}),
};

export const Primary = {
	args: {
		icon: 'Search',
		size: 24,
	},
};

export const Sizes = {
	name: 'Icon Sizes',
	render: (args) => ({
		components: {PkpIcon},
		setup() {
			return {args};
		},
		template: `
			<div style="display: flex; align-items: center; gap: 16px;">
				<div style="text-align: center;">
					<PkpIcon icon="Search" :size="16" />
					<div style="font-size: 12px; margin-top: 4px;">16px</div>
				</div>
				<div style="text-align: center;">
					<PkpIcon icon="Search" :size="24" />
					<div style="font-size: 12px; margin-top: 4px;">24px</div>
				</div>
				<div style="text-align: center;">
					<PkpIcon icon="Search" :size="32" />
					<div style="font-size: 12px; margin-top: 4px;">32px</div>
				</div>
				<div style="text-align: center;">
					<PkpIcon icon="Search" :size="48" />
					<div style="font-size: 12px; margin-top: 4px;">48px</div>
				</div>
			</div>
		`,
	}),
};

export const CommonIcons = {
	name: 'Common Icons',
	render: (args) => ({
		components: {PkpIcon},
		setup() {
			const icons = [
				'Orcid',
				'OrcidUnauthenticated',
				'MoreOptions',
				'Search',
				'Download',
				'Edit',
				'Email',
				'User',
				'Settings',
				'Help',
				'ChevronDown',
				'ChevronUp',
			];
			return {args, icons};
		},
		template: `
			<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
				<div v-for="icon in icons" :key="icon" style="display: flex; align-items: center; gap: 8px;">
					<PkpIcon :icon="icon" :size="24" />
					<span style="font-size: 14px;">{{ icon }}</span>
				</div>
			</div>
		`,
	}),
};
