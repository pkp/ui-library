<template>
	<div>
		<div
			v-if="!isLatestPublication"
			class="pkpUserCommentsList__commentNotAllowed"
		>
			<PkpIcon class="pkpUserCommentsList__errorIcon" icon="Error" />
			<span>{{ t('userComment.discussionClosed') }}</span>
		</div>

		<div v-if="isLatestPublication && !!currentUser">
			<PkpTextarea
				:placeholder="t('userComment.addYourComment')"
				:label="t('userComment.addYourComment')"
				:is-label-sr-only="true"
				:model-value="commentText"
				@update:model-value="updateCommentText"
			/>

			<PkpButton
				class="pkpUserCommentsList__submitButton"
				:is-secondary="true"
				:disabled="!commentText.trim()"
				@click="commentAdd"
			>
				{{ t('form.submit') }}
			</PkpButton>
		</div>
		<template v-if="comments.length">
			<ul class="pkpUserCommentsList__items">
				<li
					v-for="comment in comments"
					:key="comment.id"
					class="pkpUserCommentsList__item"
				>
					<div class="pkpUserCommentsList__item--content">
						<div
							v-if="
								currentUser &&
								comment.userId === currentUser.id &&
								!comment.isApproved
							"
							class="pkpUserCommentsList__item--approvalNotice"
						>
							<PkpIcon
								icon="Help"
								class="pkpUserCommentsList__item--helpIcon"
							></PkpIcon>
							{{ t('userComment.awaitingApprovalNotice') }}
						</div>

						<div class="pkpUserCommentsList__item--actions">
							<p class="pkpUserCommentsList__item--timestamp">
								{{ formatShortDateTime(comment.createdAt) }}
							</p>
							<PkpDropdownActions
								v-if="!!currentUser"
								:items="getCommentActions(comment)"
								@select="
									(actionName) => commentActionMethods[actionName](comment)
								"
							></PkpDropdownActions>
						</div>

						<div
							v-strip-unsafe-html="comment.commentText.trim()"
							class="pkpUserCommentsList__item--commentText"
						></div>

						<div class="pkpUserCommentsList__item--author">
							<div class="pkpUserCommentsList__item--authorInfo">
								<span class="pkpUserCommentsList__item--authorName">
									{{ comment.userName }}
								</span>

								<a
									v-if="comment.userOrcidDisplayValue"
									:href="comment.userOrcidDisplayValue"
									target="_blank"
									class="pkpUserCommentsList__item--orcid"
								>
									<span class="pkpUserCommentsList__item--orcidContainer">
										<PkpIcon
											:icon="
												comment.isUserOrcidAuthenticated
													? 'Orcid'
													: 'OrcidUnauthenticated'
											"
											class="pkpUserCommentsList__item--orcidIcon"
											style="height: 1rem; width: 1rem"
										/>
										{{ comment.userOrcidDisplayValue }}
									</span>
								</a>
								<span
									v-if="comment.userAffiliation"
									class="pkpUserCommentsList__item--affiliation"
								>
									{{ comment.userAffiliation }}
								</span>
							</div>
						</div>
					</div>
				</li>
			</ul>

			<div class="pkpUserCommentsList__showMore">
				<PkpButton v-if="hasMoreComments" @click="() => loadComments()">
					{{ t('userComment.showMore', {count: showMoreCommentsCount}) }}
				</PkpButton>
			</div>
		</template>
	</div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpTextarea from '@/frontend/components/PkpTextarea/PkpTextarea.vue';
import PkpDropdownActions from '@/frontend/components/PkpDropdownActions/PkpDropdownActions.vue';
import PkpUserCommentReportModal from '@/frontend/components/PkpUserComment/PkpUserCommentReportModal.vue';
import {usePkpModal} from '@/frontend/composables/usePkpModal';
import {usePkpFetch} from '@/frontend/composables/usePkpFetch';
import {useUrl} from '@/frontend/composables/usePkpUrl';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {useFetchPaginated} from '@/composables/useFetchPaginated';

const {t} = usePkpLocalize();
const {openModal, closeModal} = usePkpModal();

const {formatShortDateTime} = usePkpDate();
const currentUser = pkp.currentUser;

const props = defineProps({
	/** The ID of the publication version for which comments are being displayed */
	publicationId: {
		type: Number,
		required: true,
	},
	/** Indicates if the publication is the latest version */
	isLatestPublication: {
		type: Boolean,
		default: false,
		required: true,
	},
	/** Number of comments to fetch per page */
	itemsPerPage: {
		type: Number,
		required: true,
	},
	/** Total number of approved comments for this publication version*/
	totalPublicationComments: {
		type: Number,
		required: true,
		default: 0,
	},
});

let comments = ref([]);
const showMoreCommentsCount = ref(0);
const currentPage = ref(0);
const pageCount = ref(0);
const commentText = ref('');

const hasMoreComments = computed(() => pageCount.value > currentPage.value);

/*
 * Methods for handling comment actions
 */
const commentActionMethods = {
	commentReport,
	commentDelete,
};

/**
 * Deletes a comment.
 * @param comment - The comment to be deleted.
 */
function commentDelete(comment) {
	if (!currentUser || currentUser.id !== comment.userId) {
		throw new Error('Only the comment author can delete the comment');
	}

	const {openDialog, openDialogNetworkError} = usePkpModal();

	openDialog({
		title: t('userComment.deleteComment'),
		message: t('userComment.deleteCommentConfirmation', {
			comment: comment.commentText,
		}),
		modalStyle: 'negative',
		actions: [
			{
				label: t('common.delete'),
				callback: async (close) => {
					const {apiUrl} = useUrl(`comments/${comment.id}`);
					const {fetch: deleteComment, isSuccess} = usePkpFetch(apiUrl, {
						method: 'DELETE',
					});
					await deleteComment();
					if (isSuccess.value) {
						// Remove the comment from the list
						comments.value = comments.value.filter((c) => c.id !== comment.id);
					} else {
						openDialogNetworkError();
					}

					close();
				},
			},
			{
				label: t('common.cancel'),
				isSecondary: true,
				callback: (close) => close(),
			},
		],
	});
}

/**
 * Updates the comment text.
 * @param value
 */
function updateCommentText(value) {
	commentText.value = value;
}

/**
 * Returns the actions available for a comment.
 * @param comment
 * @returns {Array<{label: string, name: string, disabled?: boolean}>} - An array of available actions */
function getCommentActions(comment) {
	const actions = [];

	if (currentUser && currentUser.id !== comment.userId) {
		actions.push({
			label: t('userComment.report'),
			name: 'commentReport',
		});
	}

	if (currentUser && currentUser.id === comment.userId) {
		actions.push({
			label: t('userComment.deleteComment'),
			name: 'commentDelete',
		});
	}

	return actions;
}

/**
 * Reports a comment.
 * @param comment - The comment to be reported.
 */
function commentReport(comment) {
	openModal(PkpUserCommentReportModal, {
		title: t('userComment.reportComment'),
		comment,
		onSubmit: performCommentReport,
		onCancel: () => closeModal(PkpUserCommentReportModal),
	});
}

/**
 * Creates a new comment for the publication.
 */
async function commentAdd() {
	if (!props.isLatestPublication || !currentUser || !commentText.value.trim()) {
		return;
	}

	const {openDialogNetworkError} = usePkpModal();
	const {apiUrl} = useUrl('comments');

	const {fetch: submitComment, isSuccess} = usePkpFetch(apiUrl, {
		method: 'POST',
		body: {
			publicationId: props.publicationId,
			commentText: commentText.value,
		},
	});

	await submitComment();

	if (isSuccess.value) {
		commentText.value = '';
		await loadComments(true);
	} else {
		openDialogNetworkError();
	}
}

/**
 * Performs the comment report action.
 * @param comment - The comment to be reported.
 * @param reportText - The text of the report.
 */
async function performCommentReport(comment, reportText) {
	if (!currentUser || !reportText.trim()) {
		return;
	}

	const commentId = comment.id;
	const {apiUrl} = useUrl(`comments/${commentId}/reports`);
	const {openDialogNetworkError} = usePkpModal();

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

/**
 * Loads more comments for publication.
 * @param refresh - Whether to refresh the comments list or append to it. When true, this will refresh the list with the first page of comments.
 */
async function loadComments(refresh = false) {
	const {apiUrl} = useUrl(
		`comments/public?publicationIds=${props.publicationId}`,
	);

	currentPage.value = refresh ? 1 : currentPage.value + 1;
	const {items, pagination, fetch} = useFetchPaginated(apiUrl, {
		currentPage,
		pageSize: props.itemsPerPage,
	});

	await fetch();

	comments.value = refresh ? items.value : [...comments.value, ...items.value];

	pageCount.value = pagination.value.pageCount;

	showMoreCommentsCount.value =
		props.totalPublicationComments -
		comments.value.filter((c) => c.isApproved).length;
}

onMounted(() => loadComments());
</script>

<style>
.pkpUserCommentsList__item {
	list-style-type: none;
	margin-top: 2rem;
}

.pkpUserCommentsList__item--content {
	background-color: var(--pkp-background-color-tertiary);
	border-radius: 15px;
	padding-bottom: 1rem;
}

.pkpUserCommentsList__item--commentText {
	color: var(--pkp-text-color-default);
	font-size: 0.85rem;
	padding-left: 2rem;
	padding-right: 2rem;
}

.pkpUserCommentsList__item--timestamp {
	font-size: 0.75rem;
	color: var(--pkp-text-color-secondary);
}

.pkpUserCommentsList__item--author {
	margin-top: 1.75rem;
	margin-bottom: 2rem;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding-left: 2rem;
	padding-right: 2rem;
}

.pkpUserCommentsList__item--authorName {
	font-size: var(--pkp-text-base-bold);
	font-weight: var(--pkp-text-base-bold--font-weight);
	margin-bottom: 0.25rem;
}

.pkpUserCommentsList__item--authorInfo {
	display: flex;
	flex-direction: column;
	line-height: 1.25rem;
}

.pkpUserCommentsList__item--orcid {
	color: var(--pkp-text-color-secondary);
}

.pkpUserCommentsList__item--orcid,
.pkpUserCommentsList__item--affiliation {
	font-size: var(--pkp-text-sm-light);
}

.pkpUserCommentsList__item--helpIcon,
.pkpUserCommentsList__errorIcon {
	width: 1.25rem;
	height: 1.25rem;
}

.pkpUserCommentsList__item--approvalNotice {
	color: var(--pkp-color-primary);
	display: flex;
	gap: 0.5rem;
	margin-top: 1rem;
	align-items: center;
	padding-left: 2rem;
	padding-right: 2rem;
	padding-top: 1rem;
	font-size: var(--pkp-text-sm-light);
}

.pkpUserCommentsList__commentNotAllowed {
	background-color: #f9e1e173;
	padding: 1.5rem;
	border-radius: 0.65rem;
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.pkpUserCommentsList__items {
	padding: 0;
	margin: 0;
}

.pkpUserCommentsList__item--actions {
	display: flex;
	justify-content: space-between;
	padding-left: 2rem;
	padding-right: 2rem;
}

.pkpUserCommentsList__showMore {
	margin-top: 2rem;
}

.pkpUserCommentsList__submitButton {
	margin-top: 1.5rem;
}

.pkpUserCommentsList__item--orcidContainer {
	display: inline-flex;
	align-items: center;
	gap: 0.1rem;
}
</style>
