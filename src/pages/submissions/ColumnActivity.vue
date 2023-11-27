<template>
	<TableCell>
		<PkpButton
			v-if="isManager && needsEditors(submission)"
			@click="submissionsPageStore.openAssignParticipantModal(submission)"
		>
			{{ t('submission.list.assignEditor') }}
		</PkpButton>
		<template v-else>
			<ActivityIndicatorPopup />
		</template>
	</TableCell>
</template>

<script>
import TableCell from '@/components/TableNext/TableCell.vue';
import ActivityIndicatorPopup from '@/components/ActivityIndicatorPopup/ActivityIndicatorPopup.vue';
import {mapStores} from 'pinia';
import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore';
import PkpButton from '@/components/Button/Button.vue';
export default {
	components: {
		PkpButton,
		TableCell,
		ActivityIndicatorPopup,
	},
	props: {
		submission: Object,
	},
	computed: {...mapStores(useSubmissionsPageStore)},
	methods: {
		/**
		 * Whether or not a submission needs an editor to be assigned
		 */
		needsEditors(submission) {
			return !!submission.stages.find(
				(stage) =>
					stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION &&
					!!stage.statusId &&
					stage.statusId === pkp.const.STAGE_STATUS_SUBMISSION_UNASSIGNED,
			);
		},
		/**
		 * Whether the current user is a manager (or admin)
		 */
		isManager() {
			const roles = [pkp.const.ROLE_ID_MANAGER, pkp.const.ROLE_ID_SITE_ADMIN];

			return !!pkp.currentUser.roles.find((role) => roles.includes(role));
		},
	},
};
</script>
