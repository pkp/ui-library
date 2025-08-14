<template>
	<div>
		<div v-if="!isLatestPublication" class="commentsList__commentNotAllowed">
			<PkpIcon class="commentsList__errorIcon" icon="Error" />
			<span>{{ t('userComment.discussionClosed') }}</span>
		</div>

		<div v-if="isLatestPublication && !!currentUser">
			<PkpTextarea
				placeholder="What do you think about this publication? Type your comments here."
				:model-value="commentText"
				@update:model-value="updateCommentText"
			/>

			<PkpButton
				style="margin-top: 1.5rem"
				:is-secondary="true"
				:disabled="!commentText.trim()"
				@click="addComment"
			>
				{{ t('form.submit') }}
			</PkpButton>
		</div>
		<template v-if="comments.length">
			<ul class="commentsList__items">
				<li
					v-for="comment in comments"
					:key="comment.id"
					class="commentsList__item"
				>
					<div class="commentsList__item--content">
						<div
							v-if="
								currentUser &&
								comment.userId === currentUser.id &&
								!comment.isApproved
							"
							class="commentsList__item--approvalNotice"
						>
							<PkpIcon
								icon="Help"
								class="commentsList__item--helpIcon"
							></PkpIcon>
							{{ t('userComment.approvalNotice') }}
						</div>

						<div class="commentsList__item--actions">
							<p class="commentsList__item--timestamp">
								{{ formatShortDateTime(comment.createdAt) }}
							</p>
							<PkpDropdownActions
								:items="getCommentActions(comment)"
								@select="
									(actionName) => commentActionMethods[actionName](comment)
								"
							></PkpDropdownActions>
						</div>

						<div
							v-strip-unsafe-html="comment.commentText.trim()"
							class="commentsList__item--commentText"
						></div>

						<div class="commentsList__item--author">
							<PkpAvatarInitials :initials="comment.userInitials" />
							<div class="commentsList__item--authorInfo">
								<span class="commentsList__item--authorName">
									{{ comment.userName }}
								</span>
								<span
									v-if="comment.userOrcidDisplayValue"
									class="commentsList__item--orcid"
								>
									{{ comment.userOrcidDisplayValue }}
								</span>
								<span
									v-if="comment.userAffiliation"
									class="commentsList__item--affiliation"
								>
									{{ comment.userAffiliation }}
								</span>
							</div>
						</div>
					</div>
				</li>
			</ul>

			<div class="commentsList__showMore">
				<PkpButton v-if="hasMoreComments" @click="fetchComments">
					{{ t('userComment.showMore', {count: showMoreCommentsCount}) }}
				</PkpButton>
			</div>
		</template>
	</div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpTextarea from '@/frontend/components/PkpTextarea/PkpTextarea.vue';
import PkpDropdownActions from '@/frontend/components/PkpDropdownActions/PkpDropdownActions.vue';
import PkpUserCommentReportModal from '@/frontend/components/PkpUserComment/PkpUserCommentReportModal.vue';
import PkpAvatarInitials from '@/frontend/components/PkpAvatarInitials/pkpAvatarInitials.vue';
import {usePkpModal} from '@/frontend/composables/usePkpModal';
import {usePkpFetch} from '@/frontend/composables/usePkpFetch';
import {useUrl} from '@/frontend/composables/usePkpUrl';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const {openModal, closeModal, openDialogNetworkError} = usePkpModal();
const {formatShortDateTime} = usePkpDate();
const currentUser = pkp.currentUser;

const props = defineProps({
	publicationId: {
		type: Number,
		required: true,
	},
	isLatestPublication: {
		type: Boolean,
		default: false,
		required: true,
	},
	itemsPerPage: {
		type: Number,
		required: true,
	},
	totalPublicationComments: {
		type: Number,
		required: true,
		default: 0,
	},
});
let comments = ref([]);

const showMoreCommentsCount = ref(props.totalPublicationComments);

const currentPage = ref(0);
const pageCount = ref(0);

const hasMoreComments = computed(() => pageCount.value > currentPage.value);
const commentText = ref('');

const commentActionMethods = {
	commentReport,
	deleteComment,
};

function deleteComment(comment) {
	if (!currentUser || currentUser.id !== comment.userId) {
		throw new Error('Only the comment author can delete the comment');
	}

	const {openDialog} = usePkpModal();
	openDialog({
		title: 'Delete Comment',
		message: t('userComment.deleteCommentConfirm', {
			comment: comment.commentText,
		}),
		actions: [
			{
				label: t('common.delete'),
				isWarnable: true,
				callback: async (close) => {
					const {apiUrl} = useUrl(`comments/${comment.id}`);
					const {fetch: deleteComment, isSuccess} = usePkpFetch(apiUrl, {
						method: 'DELETE',
					});
					await deleteComment();
					if (isSuccess.value) {
						comments.value = comments.value.filter((c) => c.id !== comment.id);
					} else {
						openDialogNetworkError();
					}

					close();
				},
			},
			{
				label: t('common.cancel'),
				callback: (close) => {
					close();
				},
			},
		],
	});
}

function canReportComment(comment) {
	return currentUser && currentUser.id !== comment.userId && comment.isApproved;
}

function updateCommentText(value) {
	commentText.value = value;
}

function getCommentActions(comment) {
	const actions = [];

	if (!currentUser || currentUser.id !== comment.userId) {
		actions.push({
			label: 'Report',
			name: 'commentReport',
			disabled: !canReportComment(comment),
		});
	}
	if (currentUser && currentUser.id === comment.userId) {
		actions.push({
			label: 'Delete',
			name: 'deleteComment',
		});
	}
	return actions;
}

function commentReport(comment) {
	openModal(PkpUserCommentReportModal, {
		title: 'Report Comment',
		comment,
		onSubmit: performCommentReport,
		onCancel: () => closeModal(PkpUserCommentReportModal),
	});
}

async function addComment() {
	if (!props.isLatestPublication || !currentUser || !commentText.value.trim()) {
		return;
	}

	// The logic below will no longer be needed once PkpForm component is used
	const {apiUrl} = useUrl('comments');
	const {
		fetch: submitComment,
		isSuccess,
		data,
	} = usePkpFetch(apiUrl, {
		method: 'POST',
		body: {
			publicationId: props.publicationId,
			commentText: commentText.value,
		},
	});
	await submitComment();
	if (isSuccess.value) {
		onCommentSaved(data.value);
	} else {
		throw new Error('Error saving comment');
	}
}

async function performCommentReport(comment, reportText) {
	const commentId = comment.id;
	if (!currentUser) {
		throw new Error('User must be logged in to report a comment');
	}

	const {apiUrl} = useUrl(`comments/${commentId}/reports`);

	const {fetch: postReport, isSuccess} = usePkpFetch(apiUrl, {
		method: 'POST',
		body: {
			note: reportText,
		},
	});
	await postReport();

	if (!isSuccess.value) {
		openDialogNetworkError();
	} else {
		comments.value.forEach((comment) => {
			if (comment.id === commentId) {
				comment.isReported = true;
			}
		});
	}
	closeModal(PkpUserCommentReportModal);
}

function onCommentSaved(data) {
	commentText.value = '';

	// Add the new comment to the top of the comments list.
	comments.value.unshift(data);
}

async function fetchComments() {
	const {apiUrl} = useUrl(
		`comments/public?publicationIds=${props.publicationId}`,
	);

	currentPage.value += 1;
	const {items, pagination, fetch} = useFetchPaginated(apiUrl, {
		currentPage,
		pageSize: props.itemsPerPage,
	});

	await fetch();
	comments.value = [...comments.value, ...items.value];
	pageCount.value = pagination.value.pageCount;
	showMoreCommentsCount.value =
		showMoreCommentsCount.value - props.itemsPerPage;
}

onMounted(() => fetchComments());
</script>

<style>
.commentsList__item {
	list-style-type: none;
	margin-top: 2rem;
}

.commentsList__item--content {
	background-color: var(--pkp-background-color-tertiary);
	border-radius: var(--pkp-radius);

	padding-bottom: 1rem;
}

.commentsList__item--commentText {
	color: #222222;
	font-size: 0.85rem;
	padding-left: 2rem;
	padding-right: 2rem;
}

.commentsList__item--timestamp {
	font-size: 0.75rem;
	color: #7a7a7a;
}

.commentsList__item--author {
	margin-top: 0.75rem;
	margin-bottom: 2rem;
	color: #000;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding-left: 2rem;
	padding-right: 2rem;
}

.commentsList__item--authorName {
	font-weight: bold;
}

.commentsList__item--authorInfo {
	display: flex;
	flex-direction: column;
}

.commentsList__item--orcid {
	color: var(--pkp-text-color-secondary);
}

.commentsList__item--orcid,
.commentsList__item--affiliation {
	font-size: 0.65rem;
}

.commentsList__item--helpIcon,
.commentsList__errorIcon {
	width: 1.25rem;
	height: 1.25rem;
}

.commentsList__item--approvalNotice {
	color: var(--pkp-color-primary);
	display: flex;
	gap: 0.5rem;
	margin-top: 1rem;
	align-items: center;
	padding-left: 2rem;
	padding-right: 2rem;
	padding-top: 1rem;
}

.commentsList__commentNotAllowed {
	background-color: #f9e1e173;
	padding: 1.5rem;
	border-radius: 0.65rem;
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.commentsList__items {
	padding: 0;
	margin: 0;
}

.commentsList__item--actions {
	display: flex;
	justify-content: space-between;
	padding-left: 2rem;
	padding-right: 2rem;
}

.commentsList__showMore {
	margin-top: 2rem;
}
</style>
