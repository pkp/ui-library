import Icon from './Icon.vue';

export default {
	title: 'Components/Icon',
	component: Icon,
	render: (args) => ({
		components: {Icon},
		setup() {
			return {args};
		},
		template: `
			<Icon v-bind="args" />
		`,
	}),
};

export const Bug = {
	args: {icon: 'bug'},
};

export const InfoCircle = {
	args: {icon: 'Help', class: 'w-5 h-5'},
};

export const ExclamationTriangle = {
	args: {icon: 'exclamation-triangle'},
};

export const InlineIcon = {
	render: (args) => ({
		components: {Icon},
		setup() {
			return {args};
		},
		template: `
			<div><Icon v-bind="args" />Search</div>
		`,
	}),

	args: {icon: 'search', inline: true},
};

export const iconGallery = {
	render: (args) => ({
		components: {Icon},
		setup() {
			return {args};
		},
		template: `
			<div v-for="icon in args.icons" class="flex mt-4 text-primary">
				<div class="inline-flex">
					<Icon class="w-6 h-6" :icon="icon" />	
				</div>
				<div class="ms-4">{{icon}}</div>
			</div>
		`,
	}),

	args: {
		icons: [
			'Announcements',
			'AnonymousReview',
			'AttachFile',
			'BackButton',
			'Bold',
			'Bullets',
			'Cancel',
			'Catalog',
			'Complete',
			'Dashboard',
			'DecreaseTextSize',
			'DisableUser',
			'Dropdown',
			'Dropup',
			'Edit',
			'Email',
			'EmailOpened',
			'Expand',
			'DefaultDocument',
			'FileAudio',
			'FileDoc',
			'FileEpub',
			'FileExcel',
			'FileHtml',
			'FileImage',
			'FilePdf',
			'FileVideo',
			'FileZip',
			'Help',
			'InProgress',
			'IncreaseTextSize',
			'InsertContent',
			'Institutes',
			'Issues',
			'Italics',
			'LoginAs',
			'MergeUser',
			'MoreOptions',
			'MySubmissions',
			'NavDoi',
			'NavAdmin',
			'Notifications',
			'OpenReview',
			'Orcid',
			'Overdue',
			'Payment',
			'ReadRecommendation',
			'ReviewAssignments',
			'ReviewSent',
			'Search',
			'Settings',
			'Sort',
			'Statistics',
			'Tools',
			'Underline',
			'Url',
			'UsefulTips',
			'View',
		],
	},
};
