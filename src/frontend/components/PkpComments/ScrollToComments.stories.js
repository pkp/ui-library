import '@/styles/frontend-theme.css';
import PkpScrollToComments from './PkpScrollToComments.vue';
import PkpScrollToCommentsLogInto from './PkpScrollToCommentsLogInto.vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';

export default {
	title: 'Frontend/PkpComments/PkpScrollToComments',
	component: PkpScrollToComments,
	render: () => ({
		components: {PkpScrollToComments},
		template: '<PkpScrollToComments />',
	}),
};

// ============================================================================
// DEFAULT STORY
// ============================================================================

export const Primary = {
	decorators: [
		(story) => {
			const originalUser = window.pkp.currentUser;
			window.pkp.currentUser = null;

			return {
				setup() {
					return {
						onUnmounted: () => {
							window.pkp.currentUser = originalUser;
						},
					};
				},
				components: {story},
				template: '<story />',
			};
		},
	],
};

// ============================================================================
// CUSTOMIZATION STORIES
// ============================================================================

export const CustomAllComments = {
	name: 'Customize: All Comments Link',
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates customizing the "All Comments" link by overriding the default slot with custom content.',
			},
		},
	},
	render: () => ({
		components: {PkpScrollToComments, PkpScrollToCommentsLogInto},
		setup() {
			const commentsStore = usePkpCommentsStore();
			return {commentsStore};
		},
		template: `
			<PkpScrollToComments>
				<a href="#public-comments" style="font-weight: bold; color: #007bff;">
					View all {{ commentsStore.allCommentsCount }} comments below
				</a>
				<PkpScrollToCommentsLogInto />
			</PkpScrollToComments>
		`,
	}),
};

export const CustomLogInto = {
	name: 'Customize: Login Button',
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates customizing the login button by overriding the default slot with custom content.',
			},
		},
	},
	decorators: [
		(story) => {
			const originalUser = window.pkp.currentUser;
			window.pkp.currentUser = null;

			return {
				setup() {
					return {
						onUnmounted: () => {
							window.pkp.currentUser = originalUser;
						},
					};
				},
				components: {story},
				template: '<story />',
			};
		},
	],
	render: () => ({
		components: {PkpScrollToComments, PkpScrollToCommentsLogInto},
		template: `
			<PkpScrollToComments>
				<PkpScrollToCommentsLogInto
					:styles="{root: 'my-custom-login-button'}"
				/>
			</PkpScrollToComments>
		`,
	}),
};
