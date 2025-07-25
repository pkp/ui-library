<template>
	<div v-if="!isLoading">
		<h3>COMMENTS</h3>
		<template v-if="currentUser">
			<label for="comment-input">Add comment</label>
			<div style="margin: 10px 0; display: flex; gap: 10px">
				<input
					id="comment-input"
					v-model="commentText"
					class="flex-1"
					type="text"
					placeholder="Write your comment here..."
				/>
				<PkpButton :is-primary="true" @click="addComment">Add</PkpButton>
			</div>
			<!--			<PkpForm v-bind="currentCommentForm"></PkpForm>-->
		</template>
		<template v-else>
			<a :href="loginUrl" style="text-decoration: none">log in</a>
			<span>&nbsp;to comment or report a comment</span>
		</template>

		<template v-if="comments.length">
			<ul>
				<li
					v-for="comment in comments"
					:key="comment.id"
					class="mt-8 border-b border-b-light pb-2"
				>
					<div class="flex justify-between gap-4">
						<span class="font-semibold">
							{{ comment.commentText }}
							<span
								v-if="comment.isReported"
								class="text-sm-light text-negative"
							>
								(Reported)
							</span>
						</span>
						<PkpButton
							v-if="comment.userId !== currentUser.id"
							:is-warnable="true"
							:is-disabled="!currentUser"
							@click="reportComment(comment.id)"
						>
							Report
						</PkpButton>
					</div>
					<span class="mb-2 opacity-55">by {{ comment.userName }}</span>
				</li>
			</ul>
			<div class="mt-4">
				<PkpButton
					v-if="hasMoreComments"
					:is-primary="true"
					@click="fetchComments"
				>
					Load More Comments
				</PkpButton>
			</div>
		</template>

		<p v-else>There are no comments made for this publication version</p>
	</div>
</template>

<script setup>
import {cloneDeep} from 'lodash';

import {computed, onMounted, ref} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useForm} from '@/composables/useForm';
// import PkpForm from '@/components/Form/Form.vue';
const props = defineProps({
	data: {
		type: String,
		required: true,
		validator(value) {
			const parsed = JSON.parse(value);

			if (!Object.prototype.hasOwnProperty.call(parsed, 'publicationId')) {
				throw new Error('publicationId is missing in `data` json prop');
			}

			if (
				!Object.prototype.hasOwnProperty.call(
					parsed,
					'articleLatestPublicationId',
				)
			) {
				throw new Error(
					'articleLatestPublicationId is missing in `data` json prop',
				);
			}

			if (typeof parsed.publicationId !== 'number') {
				throw new Error('publicationId must be a number in `data` json prop');
			}

			if (typeof parsed.articleLatestPublicationId !== 'number') {
				throw new Error(
					'articleLatestPublicationId must be a number in `data` json prop',
				);
			}

			if (!Object.prototype.hasOwnProperty.call(parsed, 'itemsPerPage')) {
				throw new Error('itemsPerPage is missing in `data` json prop');
			}

			if (typeof parsed.itemsPerPage !== 'number') {
				throw new Error('itemsPerPage must be a number in `data` json prop');
			}

			if (
				!Object.prototype.hasOwnProperty.call(parsed, 'userCommentForm') ||
				!Object.prototype.hasOwnProperty.call(parsed, 'userCommentReportForm')
			) {
				throw new Error(
					'userCommentForm or userCommentReportForm is missing in `data` json prop',
				);
			}

			// userCommentForm and userCommentReportForm should be objects
			if (
				typeof parsed.userCommentForm !== 'object' ||
				typeof parsed.userCommentReportForm !== 'object'
			) {
				throw new Error(
					'userCommentForm and userCommentReportForm must be objects in `data` json prop',
				);
			}

			if (typeof parsed.itemsPerPage !== 'number') {
				throw new Error('itemsPerPage must be a number in `data` json prop');
			}

			return true;
		},
	},
	articleLatestPublicationId: {
		type: Number,
		required: true,
	},
});
const currentUser = ref();
const commentText = ref('');
let comments = ref([]);
const currentPage = ref(0);
const pageCount = ref(0);
const currentReportForm = ref({});
const {
	publicationId,
	articleLatestPublicationId,
	userCommentForm,
	userCommentReportForm,
	itemsPerPage,
} = JSON.parse(props.data);

const isLoading = ref(true);
const hasMoreComments = computed(() => pageCount.value > currentPage.value);

const {form: currentCommentForm} = useForm(cloneDeep(userCommentForm));
currentCommentForm.value.hiddenFields.publicationId = publicationId;

function onCommentSaved(data) {
	// Can be removed once PkpForm component is used
	commentText.value = '';

	// Add the new comment to the top of the comments list.
	// Since comments require approval before being public, this is done to allow the person making the comment to see it immediately (it will not be there on page reload).
	// It probably makes sense to remove this and instead show the user a message that the comment is pending approval.
	comments.value.unshift(data);
}

async function addComment() {
	if (articleLatestPublicationId !== publicationId) {
		return;
	}

	// The logic below will no longer be needed once PkpForm component is used
	const {apiUrl} = useUrl('comments');
	const {
		fetch: submitComment,
		isSuccess,
		data,
	} = useFetch(apiUrl, {
		method: 'POST',
		body: {
			publicationId,
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

function onCommentReportSaved(commentId) {
	comments.value.forEach((comment) => {
		if (comment.id === commentId) {
			comment.isReported = true;
		}
	});
}

function getCommentReportForm(comment) {
	const preparedForm = cloneDeep(userCommentReportForm);
	const {form, setAction} = useForm(preparedForm);

	setAction(`${preparedForm.action}/${comment.id}/reports`);

	return form;
}

async function reportComment(commentId) {
	if (!currentUser.value) {
		throw new Error('User must be logged in to report a comment');
	}

	currentReportForm.value = getCommentReportForm(
		comments.value.find((comment) => comment.id === commentId),
	);

	// The report submission logic below will not be needed once pkpForm component is used
	const {apiUrl} = useUrl(`comments/${commentId}/reports`);

	const {fetch: postReport, isSuccess} = useFetch(apiUrl, {
		method: 'POST',
		body: {note: 'Inappropriate content'},
	});
	await postReport();

	if (isSuccess.value) {
		onCommentReportSaved(commentId);
	} else {
		throw new Error('Error reporting comment');
	}
}

async function fetchComments() {
	const {apiUrl} = useUrl(`comments/public?publicationIds=${publicationId}`);

	currentPage.value += 1;
	const {items, pagination, fetch} = useFetchPaginated(apiUrl, {
		currentPage,
		pageSize: itemsPerPage,
	});

	await fetch();
	comments.value = [...comments.value, ...items.value];
	pageCount.value = pagination.value.pageCount;
}

// Fetch comments after a short delay to ensure `pkp` global var is loaded before use
onMounted(() => {
	setTimeout(async () => {
		currentUser.value = pkp.currentUser;
		await fetchComments();
		isLoading.value = false;
	}, 500);
});
</script>

<style scoped lang="less"></style>
