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

export const UsefulTips = {
	args: {icon: 'UsefulTips', class: 'h-5 w-5'},
};

export const Help = {
	args: {icon: 'Help', class: 'h-5 w-5'},
};

export const Error = {
	args: {icon: 'Error', class: 'h-5 w-5'},
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

	args: {icon: 'Search', class: 'h-5 w-5', inline: true},
};

export const IconGallery = {
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
			'Add',
			'AlignCenter',
			'AlignLeft',
			'AlignRight',
			'Announcements',
			'AnonymousReview',
			'ArchivedFile',
			'ArrowLeft',
			'ArrowRight',
			'AttachFile',
			'Attention',
			'BackButton',
			'Bold',
			'Book',
			'Bullets',
			'Calendar',
			'Cancel',
			'Catalog',
			'Checkbox',
			'CheckboxTicked',
			'ChevronDown',
			'ChevronLeft',
			'ChevronRight',
			'ChevronUp',
			'Clock',
			'Comment',
			'Complete',
			'Dashboard',
			'Declined',
			'DefaultDocument',
			'DecreaseTextSize',
			'Desktop',
			'DisableUser',
			'Download',
			'Dropdown',
			'Dropup',
			'Edit',
			'Email',
			'EmailOpened',
			'Error',
			'Expand',
			'FileAudio',
			'FileCode',
			'FileDoc',
			'FileEpub',
			'FileExcel',
			'FileHtml',
			'FileImage',
			'FilePdf',
			'FilePowerpoint',
			'FileText',
			'FileVideo',
			'FileZip',
			'Filter',
			'Globe',
			'Hdd',
			'Help',
			'History',
			'InProgress',
			'IncreaseTextSize',
			'InsertContent',
			'Institutes',
			'Issues',
			'Italics',
			'Lock',
			'LoginAs',
			'MergeUser',
			'Minus',
			'Money',
			'MoreOptions',
			'MySubmissions',
			'NavDoi',
			'NavAdmin',
			'New',
			'OpenNewTab',
			'Notifications',
			'NotVisible',
			'OpenReview',
			'Orcid',
			'OrcidUnauthenticated',
			'Overdue',
			'Paste',
			'Payment',
			'Photo',
			'Pin',
			'Print',
			'Publication',
			'Question',
			'ReadRecommendation',
			'ReinstateReviewer',
			'ReviewAssignments',
			'ReviewRequestDeclined',
			'ReviewSent',
			'ROR',
			'Search',
			'Settings',
			'Sitemap',
			'Sort',
			'Star',
			'StarTicked',
			'Statistics',
			'Tools',
			'Underline',
			'Unlock',
			'Upload',
			'Url',
			'UsefulTips',
			'User',
			'View',
			'Workflow',
		],
	},
};
