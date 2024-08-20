import SideMenu from './SideMenu.vue';
import {useSideMenu} from '@/composables/useSideMenu.js';

export default {
	title: 'Components/SideMenu',
	component: SideMenu,
	render: (args) => ({
		components: {SideMenu},
		setup() {
			const {sideMenuProps, setExpandedKeys, setActiveItemKey} =
				useSideMenu('action_required');

			setExpandedKeys(['action_required', 'editorial_dashboard']);

			function startNewSubmission(actionArgs) {
				setActiveItemKey(actionArgs.key);
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
			return {args, sideMenuProps, handleActions};
		},
		template:
			'<SideMenu v-bind="{...args, ...sideMenuProps}" @action="handleActions" />',
	}),
};

export const Default = {
	args: {
		items: [
			{
				label: 'Editorial Dashboard',
				key: 'editorial_dashboard',
				icon: 'Dashboard',
				items: [
					{
						label: 'Action required by me',
						key: 'action_required',
						link: '#',
						badge: {
							slot: 20,
							isWarnable: true,
						},
					},
					{
						label: 'Assigned to me',
						key: 'assigned_to_me',
						link: '#',
						badge: {
							slot: 45,
						},
					},
					{
						label: 'Active submissions',
						key: 'active_submissions',
						link: '#',
						badge: {
							slot: 100,
						},
					},
					{
						label: 'All in submission stage',
						key: 'all_in_submission_stage',
						link: '#',
						badge: {
							slot: 35,
						},
					},
					{
						label: 'Needs reviewers',
						key: 'needs_reviewers',
						link: '#',
						badge: {
							slot: 5,
						},
					},
					{
						label: 'Awaiting reviews',
						key: 'awaiting_reviews',
						link: '#',
						badge: {
							slot: 6,
						},
					},
					{
						label: 'Reviews submitted',
						key: 'reviews_submitted',
						link: '#',
						badge: {
							slot: 4,
						},
					},
					{
						label: 'Reviews overdue',
						key: 'reviews_overdue',
						link: '#',
						badge: {
							slot: 10,
							isWarnable: true,
						},
					},
					{
						label: 'Author revisions submitted',
						key: 'author_revisions_submitted',
						link: '#',
						badge: {
							slot: 5,
						},
					},
					{
						label: 'All in review stage',
						key: 'all_in_review_stage',
						link: '#',
						badge: {
							slot: 10,
						},
					},
					{
						label: 'All in copyediting stage',
						key: 'all_in_copyediting_stage',
						link: '#',
						badge: {
							slot: 10,
						},
					},
					{
						label: 'All in production stage',
						key: 'all_in_production_stage',
						link: '#',
						badge: {
							slot: 12,
						},
					},
					{
						label: 'Scheduled for publishing',
						key: 'scheduled_for_publishing',
						link: '#',
						badge: {
							slot: 16,
						},
					},
					{
						label: 'Published',
						key: 'published',
						link: '#',
						badge: {
							slot: 75,
						},
					},
					{
						label: 'Declined',
						key: 'declined',
						link: '#',
						badge: {
							slot: 10,
						},
					},
					{
						label: 'Start a New Submission',
						key: 'start_a_new_submission',
						link: '#',
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
				key: 'my_assignments_as_reviewer',
				icon: 'ReviewAssignments',
				link: '#',
			},
			{
				label: 'My Submissions as Author',
				key: 'my_submissions_as_author',
				icon: 'MySubmissions',
				link: '#',
			},
			{
				label: 'Issues',
				key: 'issues',
				icon: 'Issues',
				link: '#',
			},
			{
				label: 'Announcements',
				key: 'announcements',
				icon: 'Announcements',
				link: '#',
			},
			{
				label: 'DOIs',
				key: 'dois',
				icon: 'NavDoi',
				link: '#',
			},
			{
				label: 'Institutes',
				key: 'institutes',
				icon: 'Institutes',
				link: '#',
			},
		],
	},
};

export const WithColorStripe = {
	render: (args) => ({
		components: {SideMenu},
		setup() {
			const activeItemKey = 'submission_stages';
			const expandedKeys = ['submission_stages'];
			const {sideMenuProps, setExpandedKeys} = useSideMenu(activeItemKey);

			setExpandedKeys(expandedKeys);
			return {args, sideMenuProps};
		},
		template: '<SideMenu v-bind="{...args, ...sideMenuProps}" />',
	}),
	args: {
		items: [
			{
				label: 'Submission Stages',
				key: 'submission_stages',
				items: [
					{
						label: 'Desk Review',
						key: 'desk_review',
						link: '#',
						colorStripe: 'border-stage-desk-review',
					},
					{
						label: 'Review',
						key: 'review',
						link: '#',
						colorStripe: 'border-stage-in-review',
					},
					{
						label: 'Copyediting',
						key: 'copyediting',
						link: '#',
						colorStripe: 'border-stage-copyediting',
					},
					{
						label: 'Production',
						key: 'production',
						link: '#',
						colorStripe: 'border-stage-production',
					},
					{
						label: 'Scheduled',
						key: 'scheduled',
						link: '#',
						colorStripe: 'border-stage-scheduled-for-publishing',
					},
					{
						label: 'Incomoplete Submission',
						key: 'incomplete_submission',
						link: '#',
						colorStripe: 'border-stage-incomplete-submission',
					},
					{
						label: 'Published',
						key: 'published',
						link: '#',
						colorStripe: 'border-stage-published',
					},
					{
						label: 'Declined',
						key: 'declined',
						link: '#',
						colorStripe: 'border-stage-declined',
					},
				],
			},
		],
	},
};

export const ExpandedMenu = {
	render: (args) => ({
		components: {SideMenu},
		setup() {
			const activeItemKey = 'review_round_1';
			const expandedKeys = ['workflow', 'review', 'publication'];
			const {sideMenuProps, setExpandedKeys} = useSideMenu(activeItemKey);

			setExpandedKeys(expandedKeys);
			return {args, sideMenuProps};
		},
		template: '<SideMenu v-bind="{...args, ...sideMenuProps}" />',
	}),
	args: {
		items: [
			{
				label: 'Workflow',
				key: 'workflow',
				icon: 'Dashboard',
				items: [
					{
						label: 'Submission',
						key: 'submission',
						link: '#',
						colorStripe: 'border-stage-desk-review',
					},
					{
						label: 'Review',
						key: 'review',
						link: '#',
						items: [
							{
								label: 'Review Round 1',
								key: 'review_round_1',
								link: '#',
							},
							{
								label: 'New Review Round',
								key: 'new_review_round',
								link: '#',
							},
						],
					},
					{
						label: 'Copyediting',
						key: 'copyediting',
						link: '#',
					},
					{
						label: 'Production',
						key: 'production',
						link: '#',
					},
				],
			},
			{
				label: 'Publication',
				key: 'publication',
				icon: 'MySubmissions',
				isOpen: true,
				items: [
					{
						label: 'Title & Abstract',
						key: 'title_and_abstract',
						link: '#',
					},
					{
						label: 'Contributors',
						key: 'contributors',
						link: '#',
					},
					{
						label: 'Metadata',
						key: 'metadata',
						link: '#',
					},
					{
						label: 'References',
						key: 'references',
						link: '#',
					},
					{
						label: 'Galleys',
						key: 'galleys',
						link: '#',
					},
					{
						label: 'Permissions & Disclosure',
						key: 'permissions_and_disclosure',
						link: '#',
					},
					{
						label: 'Issue',
						key: 'issue',
						link: '#',
					},
				],
			},
		],
	},
};
