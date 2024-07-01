<template>
	<TableCell>
		<DropdownActions
			label="More Actions (t)"
			:display-as-ellipsis="true"
			:actions="actionsList"
			@action="handleAction"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/TableNext/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';

import {computed} from 'vue';
const props = defineProps({
	reviewAssignment: {type: Object, required: true},
	submission: {type: Object, required: true},
});

const {openSideModal} = useModal();
const {t} = useLocalize();

const actionsList = computed(() => {
	const actions = [];
	const reviewAssignmentStatusId = props.reviewAssignment.statusId;
	// Review Details
	if (
		reviewAssignmentStatusId !== pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED
	) {
		actions.push({
			label: 'Review Details',
			name: 'reviewDetails',
		});
	}

	// Email Reviewer
	actions.push({
		label: 'Email Reviewer',
		name: 'emailReviewer',
	});

	// add condition if current user is not assigned author
	const currentUserNotAssignedAuthor = true;

	if (currentUserNotAssignedAuthor) {
		// Resend request reviewer
		if (
			reviewAssignmentStatusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED
		) {
			actions.push({
				label: 'Resend Request',
				name: 'resendRequest',
			});
		}

		// Edit
		if (
			reviewAssignmentStatusId !== pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED
		) {
			actions.push({
				label: 'Edit',
				name: 'editReview',
			});

			actions.push({
				label: props.reviewAssignment.dateConfirmed
					? 'Cancel Reviewer'
					: 'Unassign Reviewer',
				name: props.reviewAssignment.dateConfirmed
					? 'cancelReviewer'
					: 'unassignReviewer',
			});
		} else {
			actions.push({
				label: 'Reinstate reviewer',
				name: 'reinstateReviewer',
			});
		}
	}

	// History
	actions.push({
		label: 'History',
		name: 'reviewHistory',
	});

	// Login as TODO condition
	actions.push({
		label: 'Login as',
		name: 'loginAs',
	});

	// Gossip TODO condition
	actions.push({
		label: 'Editorial Notes',
		name: 'editorialNotes',
	});

	return actions;
});

function handleAction(actionName) {
	// http://localhost:7003/index.php/publicknowledge/$$$call$$$/grid/users/reviewer/reviewer-grid/read-review?submissionId=13&reviewAssignmentId=21&stageId=3&round=0

	if (actionName === 'reviewDetails') {
		const {url} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'readReview',
			params: {
				submissionId: props.submission.id,
				reviewAssignmentId: props.reviewAssignment.id,
				stageId: props.submission.stageId,
			},
		});
		openSideModal(
			'LegacyAjax',
			{
				legacyOptions: {
					title: t('editor.review.reviewDetails'),
					url,
				},
			},
			{
				onClose: async () => {
					//finishedCallback();
				},
			},
		);
	} else if (actionName === 'emailReviewer') {
		const {url} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'sendEmail',
			params: {
				submissionId: props.submission.id,
				reviewAssignmentId: props.reviewAssignment.id,
				stageId: props.submission.stageId,
			},
		});
		openSideModal(
			'LegacyAjax',
			{
				legacyOptions: {
					title: t('editor.review.emailReviewer'),
					url,
				},
			},
			{
				onClose: async () => {
					//finishedCallback();
				},
			},
		);
	} else if (actionName === 'editReview') {
		const {url} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'editReview',
			params: {
				submissionId: props.submission.id,
				reviewAssignmentId: props.reviewAssignment.id,
				stageId: props.submission.stageId,
			},
		});
		openSideModal(
			'LegacyAjax',
			{
				legacyOptions: {
					title: t('editor.submissionReview.editReview'),
					url,
				},
			},
			{
				onClose: async () => {
					//finishedCallback();
				},
			},
		);
	}
}
</script>
