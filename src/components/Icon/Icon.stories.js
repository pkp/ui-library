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
			'Notifications',
			'NotVisible',
			'OpenReview',
			'Orcid',
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
