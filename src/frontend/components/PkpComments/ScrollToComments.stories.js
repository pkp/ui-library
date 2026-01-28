import PkpScrollToComments from './PkpScrollToComments.vue';
import BaseScrollToComments from './base/BaseScrollToComments.vue';
import '../../../styles/_frontend-theme.less';

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
	name: 'Customize: All Comments Slot',
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates customizing the "All Comments" slot with custom content.',
			},
		},
	},
	render: () => ({
		components: {BaseScrollToComments},
		template: `
			<BaseScrollToComments>
				<template #allComments="{ store }">
					<a href="#public-comments" style="font-weight: bold; color: #007bff;">
						View all {{ store.allCommentsCount }} comments below
					</a>
				</template>
			</BaseScrollToComments>
		`,
	}),
};

export const CustomLogInto = {
	name: 'Customize: Login Slot',
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates customizing the login button slot with custom content.',
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
		components: {BaseScrollToComments},
		template: `
			<BaseScrollToComments>
				<template #logInto="{ store }">
					<button
						@click="store.login"
						style="background: linear-gradient(45deg, #007bff, #00bcd4); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;"
					>
						Sign in to join the discussion
					</button>
				</template>
			</BaseScrollToComments>
		`,
	}),
};
