import SideMenu from './SideMenu.vue';

export default {
	title: 'Components/SideMenu',
	component: SideMenu,
	render: (args) => ({
		components: {SideMenu},
		setup() {
			function startNewSubmission(actionArgs) {
				console.log('startNewSubmission clicked', actionArgs);
			}

			function otherAction(actionArgs) {
				console.log('otherAction clicked', actionArgs);
			}

			function handleActions(action, actionArgs) {
				switch (action) {
					case 'startNewSubmission':
						startNewSubmission(actionArgs);
						break;
					case 'otherAction':
						otherAction(actionArgs);
						break;
					default:
						console.error(`No handler for action: ${action}`);
				}
			}
			return {args, handleActions};
		},
		template: '<SideMenu v-bind="args" @action="handleActions" />',
	}),
};

export const Default = {
	args: {
		items: [
			{
				label: 'Editorial Dashboard',
				icon: 'Dashboard',
				isCurrent: false,
				items: [
					{
						label: 'Action required by me',
						link: '#',
						isCurrent: true,
						badge: {
							slot: 20,
							isWarnable: true,
						},
					},
					{
						label: 'Assigned to me',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 45,
						},
					},
					{
						label: 'Active submissions',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 100,
						},
					},
					{
						label: 'All in submission stage',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 35,
						},
					},
					{
						label: 'Needs reviewers',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 5,
						},
					},
					{
						label: 'Awaiting reviews',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 6,
						},
					},
					{
						label: 'Reviews submitted',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 4,
						},
					},
					{
						label: 'Reviews overdue',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 10,
							isWarnable: true,
						},
					},
					{
						label: 'Author revisions submitted',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 5,
						},
					},
					{
						label: 'All in review stage',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 10,
						},
					},
					{
						label: 'All in copyediting stage',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 10,
						},
					},
					{
						label: 'All in production stage',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 12,
						},
					},
					{
						label: 'Scheduled for publishing',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 16,
						},
					},
					{
						label: 'Published',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 75,
						},
					},
					{
						label: 'Declined',
						link: '#',
						isCurrent: false,
						badge: {
							slot: 10,
						},
					},
					{
						label: 'Start a New Submission',
						link: '#',
						isCurrent: false,
						action: 'startNewSubmission',
						actionArgs: {
							param1: 1,
							param2: 2,
						},
					},
				],
			},
			{
				label: 'My Assignments as Reviewer',
				icon: 'ReviewAssignments',
				isCurrent: false,
				link: '#',
			},
			{
				label: 'My Submissions as Author',
				icon: 'MySubmissions',
				isCurrent: false,
				link: '#',
			},
			{
				label: 'Issues',
				icon: 'Issues',
				isCurrent: false,
				link: '#',
			},
			{
				label: 'Announcements',
				icon: 'Announcements',
				isCurrent: false,
				link: '#',
			},
			{
				label: 'DOIs',
				icon: 'NavDoi',
				isCurrent: false,
				link: '#',
			},
			{
				label: 'Institutes',
				icon: 'Institutes',
				isCurrent: false,
				link: '#',
			},
		],
	},
};

export const WithColorStripe = {
	args: {
		items: [
			{
				label: 'Submission Stages',
				isCurrent: true,
				items: [
					{
						label: 'Desk Review',
						link: '#',
						isCurrent: false,
						colorStripe: 'border-stage-desk-review',
					},
					{
						label: 'Review',
						link: '#',
						isCurrent: false,
						colorStripe: 'border-stage-in-review',
					},
					{
						label: 'Copyediting',
						link: '#',
						isCurrent: false,
						colorStripe: 'border-stage-copyediting',
					},
					{
						label: 'Production',
						link: '#',
						isCurrent: false,
						colorStripe: 'border-stage-production',
					},
					{
						label: 'Scheduled',
						link: '#',
						isCurrent: false,
						colorStripe: 'border-stage-scheduled-for-publishing',
					},
					{
						label: 'Incomoplete Submission',
						link: '#',
						isCurrent: false,
						colorStripe: 'border-stage-incomplete-submission',
					},
					{
						label: 'Published',
						link: '#',
						isCurrent: false,
						colorStripe: 'border-stage-published',
					},
					{
						label: 'Declined',
						link: '#',
						isCurrent: false,
						colorStripe: 'border-stage-declined',
					},
				],
			},
		],
	},
};

export const ExpandedMenu = {
	args: {
		items: [
			{
				label: 'Workflow',
				icon: 'thumbs-up',
				isCurrent: false,
				items: [
					{
						label: 'Submission',
						link: '#',
						isCurrent: false,
						colorStripe: 'border-stage-desk-review',
					},
					{
						label: 'Review',
						link: '#',
						isCurrent: false,
						items: [
							{
								label: 'Review Round 1',
								link: '#',
								isCurrent: true,
							},
							{
								label: 'New Review Round',
								link: '#',
								isCurrent: false,
							},
						],
					},
					{
						label: 'Copyediting',
						link: '#',
						isCurrent: false,
					},
					{
						label: 'Production',
						link: '#',
						isCurrent: false,
					},
				],
			},
			{
				label: 'Publication',
				icon: 'MySubmissions',
				isCurrent: false,
				isOpen: true,
				items: [
					{
						label: 'Title & Abstract',
						link: '#',
						isCurrent: false,
					},
					{
						label: 'Contributors',
						link: '#',
						isCurrent: false,
					},
					{
						label: 'Metadata',
						link: '#',
						isCurrent: false,
					},
					{
						label: 'References',
						link: '#',
						isCurrent: false,
					},
					{
						label: 'Galleys',
						link: '#',
						isCurrent: false,
					},
					{
						label: 'Permissions & Disclosure',
						link: '#',
						isCurrent: false,
					},
					{
						label: 'Issue',
						link: '#',
						isCurrent: false,
					},
				],
			},
		],
	},
};
