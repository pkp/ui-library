import SideMenu from './SideMenu.vue';
import {useSideMenu} from '@/composables/useSideMenu.js';
import {useModal} from '@/composables/useModal.js';

export default {
	title: 'Components/SideMenu',
	component: SideMenu,
	render: (args) => ({
		components: {SideMenu},
		setup() {
			const {sideMenuProps, setExpandedKeys} = useSideMenu(args.items, {
				activeItemKey: 'action_required',
				onActionFn: handleActions,
			});

			setExpandedKeys(['action_required', 'editorial_dashboard']);

			const {openDialog} = useModal();
			function startNewSubmission(actionArgs) {
				openDialog({
					name: 'startNewSubmission',
					title: 'Start New Submission',
					message: 'Modal for starting new submission',
					close: () => {},
				});
			}

			function handleActions(action, actionArgs) {
				switch (action) {
					case 'startNewSubmission':
						startNewSubmission(actionArgs);
						break;
					default:
						console.error(`No handler for action: ${action}`);
				}
			}
			return {args, sideMenuProps};
		},
		template: '<SideMenu v-bind="sideMenuProps" />',
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
						link: '#action_required',
						badge: {
							slot: 20,
							colorVariant: 'attention',
						},
					},
					{
						label: 'Assigned to me',
						key: 'assigned_to_me',
						link: '#assigned_to_me',
						badge: {
							slot: 45,
						},
					},
					{
						label: 'Active submissions',
						key: 'active_submissions',
						link: '#active_submissions',
						badge: {
							slot: 100,
						},
					},
					{
						label: 'All in submission stage',
						key: 'all_in_submission_stage',
						link: '#all_in_submission_stage',
						badge: {
							slot: 35,
						},
					},
					{
						label: 'Needs reviewers',
						key: 'needs_reviewers',
						link: '#needs_reviewers',
						badge: {
							slot: 5,
						},
					},
					{
						label: 'Awaiting reviews',
						key: 'awaiting_reviews',
						link: '#awaiting_reviews',
						badge: {
							slot: 6,
						},
					},
					{
						label: 'Reviews submitted',
						key: 'reviews_submitted',
						link: '#reviews_submitted',
						badge: {
							slot: 4,
						},
					},
					{
						label: 'Reviews overdue',
						key: 'reviews_overdue',
						link: '#reviews_overdue',
						badge: {
							slot: 10,
							colorVariant: 'attention',
						},
					},
					{
						label: 'Author revisions submitted',
						key: 'author_revisions_submitted',
						link: '#author_revisions_submitted',
						badge: {
							slot: 5,
						},
					},
					{
						label: 'All in review stage',
						key: 'all_in_review_stage',
						link: '#all_in_review_stage',
						badge: {
							slot: 10,
						},
					},
					{
						label: 'All in copyediting stage',
						key: 'all_in_copyediting_stage',
						link: '#all_in_copyediting_stage',
						badge: {
							slot: 10,
						},
					},
					{
						label: 'All in production stage',
						key: 'all_in_production_stage',
						link: '#all_in_production_stage',
						badge: {
							slot: 12,
						},
					},
					{
						label: 'Scheduled for publishing',
						key: 'scheduled_for_publishing',
						link: '#scheduled_for_publishing',
						badge: {
							slot: 16,
						},
					},
					{
						label: 'Published',
						key: 'published',
						link: '#published',
						badge: {
							slot: 75,
						},
					},
					{
						label: 'Declined',
						key: 'declined',
						link: '#declined',
						badge: {
							slot: 10,
						},
					},
					{
						label: 'Start a New Submission',
						key: 'start_a_new_submission',
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
				link: '#ReviewAssignments',
			},
			{
				label: 'My Submissions as Author',
				key: 'my_submissions_as_author',
				icon: 'MySubmissions',
				link: '#MySubmissions',
			},
			{
				label: 'Issues',
				key: 'issues',
				icon: 'Issues',
				link: '#Issues',
			},
			{
				label: 'Announcements',
				key: 'announcements',
				icon: 'Announcements',
				link: '#Announcements',
			},
			{
				label: 'DOIs',
				key: 'dois',
				icon: 'NavDoi',
				link: '#NavDoi',
			},
			{
				label: 'Institutes',
				key: 'institutes',
				icon: 'Institutes',
				link: '#Institutes',
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
			const {sideMenuProps, setExpandedKeys} = useSideMenu(args.items, {
				activeItemKey,
			});

			setExpandedKeys(expandedKeys);
			return {args, sideMenuProps};
		},
		template: '<SideMenu v-bind="sideMenuProps" />',
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
						link: '#desk_review',
						colorStripe: 'border-stage-desk-review',
					},
					{
						label: 'Review',
						key: 'review',
						link: '#review',
						colorStripe: 'border-stage-in-review',
					},
					{
						label: 'Copyediting',
						key: 'copyediting',
						link: '#copyediting',
						colorStripe: 'border-stage-copyediting',
					},
					{
						label: 'Production',
						key: 'production',
						link: '#production',
						colorStripe: 'border-stage-production',
					},
					{
						label: 'Scheduled',
						key: 'scheduled',
						link: '#scheduled',
						colorStripe: 'border-stage-scheduled-for-publishing',
					},
					{
						label: 'Incomoplete Submission',
						key: 'incomplete_submission',
						link: '#incomplete_submission',
						colorStripe: 'border-stage-incomplete-submission',
					},
					{
						label: 'Published',
						key: 'published',
						link: '#published',
						colorStripe: 'border-stage-published',
					},
					{
						label: 'Declined',
						key: 'declined',
						link: '#declined',
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
			const {sideMenuProps, setExpandedKeys} = useSideMenu(args.items, {
				activeItemKey,
			});

			setExpandedKeys(expandedKeys);
			return {args, sideMenuProps};
		},
		template: '<SideMenu v-bind="sideMenuProps" />',
	}),
	args: {
		items: [
			{
				label: 'Workflow',
				key: 'workflow',
				icon: 'Workflow',
				items: [
					{
						label: 'Submission',
						key: 'submission',
						link: '#submission',
						colorStripe: 'border-stage-desk-review',
					},
					{
						label: 'Review',
						key: 'review',
						link: '#review',
						items: [
							{
								label: 'Review Round 1',
								key: 'review_round_1',
								link: '#review_round_1',
							},
							{
								label: 'New Review Round',
								key: 'new_review_round',
								link: '#new_review_round',
							},
						],
					},
					{
						label: 'Copyediting',
						key: 'copyediting',
						link: '#copyediting',
					},
					{
						label: 'Production',
						key: 'production',
						link: '#production',
					},
				],
			},
			{
				label: 'Publication',
				key: 'publication',
				icon: 'Publication',
				isOpen: true,
				items: [
					{
						label: 'Title & Abstract',
						key: 'title_and_abstract',
						link: '#title_and_abstract',
					},
					{
						label: 'Contributors',
						key: 'contributors',
						link: '#contributors',
					},
					{
						label: 'Metadata',
						key: 'metadata',
						link: '#metadata',
					},
					{
						label: 'References',
						key: 'references',
						link: '#references',
					},
					{
						label: 'Galleys',
						key: 'galleys',
						link: '#galleys',
					},
					{
						label: 'Permissions & Disclosure',
						key: 'permissions_and_disclosure',
						link: '#permissions_and_disclosure',
					},
					{
						label: 'Issue',
						key: 'issue',
						link: '#issue',
					},
				],
			},
		],
	},
};
