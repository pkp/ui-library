<template>
	<TableCell>
		<pkp-button
			v-if="isManager && needsEditors(submission)"
			@click="openAssignParticipant(submission)"
		>
			{{ t('submission.list.assignEditor') }}
		</pkp-button>
		<template v-else>TODO</template>
	</TableCell>
</template>

<script>
import TableCell from '@/components/TableNext/TableCell.vue';

export default {
	components: {
		TableCell,
	},
	props: {
		submission: Object,
	},
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
