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
		icon: 'Help',
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
					<PkpIcon icon="Help" :size="16" />
					<div style="font-size: 12px; margin-top: 4px;">16px</div>
				</div>
				<div style="text-align: center;">
					<PkpIcon icon="Help" :size="24" />
					<div style="font-size: 12px; margin-top: 4px;">24px</div>
				</div>
				<div style="text-align: center;">
					<PkpIcon icon="Help" :size="32" />
					<div style="font-size: 12px; margin-top: 4px;">32px</div>
				</div>
				<div style="text-align: center;">
					<PkpIcon icon="Help" :size="48" />
					<div style="font-size: 12px; margin-top: 4px;">48px</div>
				</div>
			</div>
		`,
	}),
};

export const AllBladeIcons = {
	name: 'All Blade Icons',
	render: (args) => ({
		components: {PkpIcon},
		setup() {
			const icons = [
				'Cancel',
				'ChevronDown',
				'Error',
				'Help',
				'MoreOptions',
				'Orcid',
				'OrcidUnauthenticated',
				'ReviewApproved',
				'ReviewAuthorResponse',
				'ReviewComments',
				'ReviewNotApproved',
				'ReviewRevisionsRequested',
				'User',
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
