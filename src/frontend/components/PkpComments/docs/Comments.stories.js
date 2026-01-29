import Comments from './PkpComments.vue';
import BaseComments from './base/BaseComments.vue';
import '../../../styles/_frontend-theme.less';
import BaseCommentsLogInto from './base/BaseCommentsLogInto.vue';
import BaseCommentsNotificationNotLatest from './base/BaseCommentsNotificationNotLatest.vue';
import BaseCommentsNew from './base/BaseCommentsNew.vue';
import BaseCommentsNewInput from './base/BaseCommentsNewInput.vue';
import BaseCommentsNewSubmit from './base/BaseCommentsNewSubmit.vue';
import BaseCommentsNotificationMessageNeedsApproval from './base/BaseCommentsNotificationMessageNeedsApproval.vue';
import BaseCommentsMessageActions from './base/BaseCommentsMessageActions.vue';
import {http, HttpResponse} from 'msw';

// Mock comment data (includes an unapproved comment from current user to show approval notice)
const mockComments = [
	{
		id: 1,
		publicationId: 100,
		userId: 5,
		commentText:
			'This is a fascinating study that provides valuable insights into the research methodology. The authors have done an excellent job presenting their findings.',
		createdAt: '2024-01-15 10:30:00',
		isApproved: true,
		isReported: false,
		userName: 'Maria Rodriguez',
		userAffiliation: 'University of Barcelona, Department of Biology',
		userOrcidDisplayValue: 'https://orcid.org/0000-0002-1234-5678',
		isUserOrcidAuthenticated: true,
	},
	{
		id: 4,
		publicationId: 100,
		userId: 20, // Matches pkp.currentUser.id to show approval notice
		commentText:
			'I have submitted a comment that is still awaiting moderation. This demonstrates the approval notice feature.',
		createdAt: '2024-01-18 16:00:00',
		isApproved: false, // Unapproved comment
		isReported: false,
		userName: 'Daniel Barnes',
		userAffiliation: 'Test University',
		userOrcidDisplayValue: null,
		isUserOrcidAuthenticated: false,
	},
	{
		id: 2,
		publicationId: 100,
		userId: 8,
		commentText:
			'I have a question about the statistical methods used in Table 3. Could the authors clarify the choice of significance threshold?',
		createdAt: '2024-01-16 14:45:00',
		isApproved: true,
		isReported: false,
		userName: 'James Chen',
		userAffiliation: 'National Taiwan University, Statistics Department',
		userOrcidDisplayValue: null,
		isUserOrcidAuthenticated: false,
	},
	{
		id: 3,
		publicationId: 100,
		userId: 12,
		commentText:
			'The discussion section raises important points about future research directions. I would be interested to see follow-up studies on this topic.',
		createdAt: '2024-01-17 09:15:00',
		isApproved: true,
		isReported: false,
		userName: 'Sarah Thompson',
		userAffiliation: 'Oxford University, Research Institute',
		userOrcidDisplayValue: 'https://orcid.org/0000-0003-9876-5432',
		isUserOrcidAuthenticated: true,
	},
];

const mockCommentsVersion2 = [
	{
		id: 4,
		publicationId: 99,
		userId: 15,
		commentText:
			'This earlier version of the paper had some issues that were addressed in the revision. Good to see the improvements.',
		createdAt: '2023-12-01 11:20:00',
		isApproved: true,
		isReported: false,
		userName: 'David Kim',
		userAffiliation: 'Seoul National University',
		userOrcidDisplayValue: null,
		isUserOrcidAuthenticated: false,
	},
];

// Component props
const defaultArgs = {
	latestPublicationId: 100,
	publications: [
		{id: 100, version: 2},
		{id: 99, version: 1},
	],
	itemsPerPage: 10,
	loginUrl: 'https://mock/index.php/publicknowledge/login',
	commentsCountPerPublication: {
		100: 4,
		99: 1,
	},
	allCommentsCount: 5,
};

// MSW handlers for all stories
const commentsHandlers = [
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/comments/public',
		({request}) => {
			const url = new URL(request.url);
			const publicationIds = url.searchParams.get('publicationIds');

			let comments = [];
			if (publicationIds === '100') {
				comments = mockComments;
			} else if (publicationIds === '99') {
				comments = mockCommentsVersion2;
			}

			return HttpResponse.json({
				items: comments,
				itemsMax: comments.length,
			});
		},
	),
];

export default {
	title: 'Frontend/PkpComments',
	component: Comments,
	render: (args) => ({
		components: {Comments},
		setup() {
			return {args};
		},
		template: '<Comments v-bind="args"></Comments>',
	}),
};

// ============================================================================
// DEFAULT STORY
// ============================================================================

export const Primary = {
	args: defaultArgs,
	parameters: {
		msw: {
			handlers: commentsHandlers,
		},
	},
};

// ============================================================================
// STATE STORIES
// These stories demonstrate different component states
// ============================================================================

export const StateLoggedOut = {
	name: 'State: Logged Out User',
	args: defaultArgs,
	parameters: {
		msw: {
			handlers: commentsHandlers,
		},
		docs: {
			description: {
				story:
					'Shows the comments view for a user who is not logged in, demonstrating the login button.',
			},
		},
	},
	decorators: [
		(story) => {
			// Temporarily set currentUser to null to simulate logged out state
			const originalUser = window.pkp.currentUser;
			window.pkp.currentUser = null;

			return {
				setup() {
					// Restore original user on unmount
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
// These stories demonstrate how to customize the component appearance
// ============================================================================

// Reordered message layout - shows author at top instead of bottom
export const CustomMessageReordered = {
	name: 'Customize: Message Reordered',
	args: defaultArgs,
	parameters: {
		msw: {
			handlers: commentsHandlers,
		},
		docs: {
			description: {
				story:
					'Demonstrates reordering message elements - showing author at top instead of bottom.',
			},
		},
	},
	render: (args) => ({
		components: {BaseComments},
		setup() {
			return {args};
		},
		template: `
			<BaseComments v-bind="args">
				<template #message="{ message }">
					<header class="PkpComments__messageHeader">
						<span class="PkpComments__authorName">{{ message.userName }}</span>
						<time class="PkpComments__messageDate" :datetime="message.createdAt">
							{{ new Date(message.createdAt).toLocaleDateString() }}
						</time>
					</header>
					<p class="PkpComments__messageBody">{{ message.commentText }}</p>
				</template>
			</BaseComments>
		`,
	}),
};

// Custom version header - add extra info like comment count
export const CustomVersionHeader = {
	name: 'Customize: Version Header',
	args: defaultArgs,
	parameters: {
		msw: {
			handlers: commentsHandlers,
		},
		docs: {
			description: {
				story:
					'Demonstrates adding extra information to version headers, like comment count.',
			},
		},
	},
	render: (args) => ({
		components: {BaseComments},
		setup() {
			return {args};
		},
		template: `
			<BaseComments v-bind="args">
				<template #versionHeader="{ publication, messages }">
					<span>Version {{ publication.version }}</span>
					<span>({{ messages.length }} {{ messages.length === 1 ? 'comment' : 'comments' }})</span>
				</template>
			</BaseComments>
		`,
	}),
};

// Full layout override using default slot
// For theme plugins that need complete control over the structure
export const CustomFullLayout = {
	name: 'Customize: Full Layout',
	args: defaultArgs,
	parameters: {
		msw: {
			handlers: commentsHandlers,
		},
		docs: {
			description: {
				story: `
Demonstrates full layout control using the default slot.
Use this approach when theme plugins need to completely restructure the comments layout.
The store provides access to comments data and helper methods.
				`,
			},
		},
	},
	render: (args) => ({
		components: {
			BaseComments,
			BaseCommentsLogInto,
			BaseCommentsNotificationNotLatest,
			BaseCommentsNew,
			BaseCommentsNewInput,
			BaseCommentsNewSubmit,
			BaseCommentsNotificationMessageNeedsApproval,
			BaseCommentsMessageActions,
		},
		setup() {
			return {args};
		},
		template: `
			<BaseComments v-bind="args">
				<template #default="{ publications, store }">
					<!-- Flat layout instead of accordion -->
					<section
						v-for="publication in publications"
						:key="publication.id"
						class="PkpComments__versionSection"
					>
						<h3 class="PkpComments__versionTitle">
							Version {{ publication.version }}
							({{ store.getComments(publication.id).length }} comments)
						</h3>

						<BaseCommentsLogInto :publication="publication" />
						<BaseCommentsNotificationNotLatest :publication="publication" />

						<div v-if="store.isLatestPublication(publication.id) && store.getCurrentUser()">
							<BaseCommentsNew :publication="publication">
								<BaseCommentsNewInput />
								<BaseCommentsNewSubmit :publication="publication" />
							</BaseCommentsNew>
						</div>

						<p v-if="store.getComments(publication.id).length === 0">
							No comments yet.
						</p>

						<article
							v-for="message in store.getComments(publication.id)"
							:key="message.id"
							class="PkpComments__message"
						>
							<BaseCommentsNotificationMessageNeedsApproval :message="message" />

							<header class="PkpComments__messageHeader">
								<span class="PkpComments__authorName">{{ message.userName }}</span>
								<time class="PkpComments__messageDate" :datetime="message.createdAt">
									{{ new Date(message.createdAt).toLocaleDateString() }}
								</time>
								<BaseCommentsMessageActions :publication="publication" :message="message" />
							</header>

							<p class="PkpComments__messageBody">{{ message.commentText }}</p>

							<footer v-if="message.userAffiliation" class="PkpComments__messageFooter">
								{{ message.userAffiliation }}
							</footer>
						</article>
					</section>
				</template>
			</BaseComments>
		`,
	}),
};
