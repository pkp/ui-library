<template>
	<TableCell>
		<PkpButton
			v-if="canAssignEditor"
			@click="submissionsPageStore.openAssignParticipantModal(submission)"
		>
			{{ t('submission.list.assignEditor') }}
		</PkpButton>
		<template v-else>
			<ActivityIndicatorPopup />
		</template>
	</TableCell>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import ActivityIndicatorPopup from '@/components/ActivityIndicatorPopup/ActivityIndicatorPopup.vue';
import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore';
import PkpButton from '@/components/Button/Button.vue';

const {submission} = defineProps({submission: Object});

const submissionsPageStore = useSubmissionsPageStore();

const needsEditors = computed(
	() =>
		!!submission.stages.find(
			(stage) =>
				stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION &&
				!!stage.statusId &&
				stage.statusId === pkp.const.STAGE_STATUS_SUBMISSION_UNASSIGNED,
		),
);

const roles = [pkp.const.ROLE_ID_MANAGER, pkp.const.ROLE_ID_SITE_ADMIN];

const isManager = computed(
	() => !!pkp.currentUser.roles.find((role) => roles.includes(role)),
);

const canAssignEditor = computed(() => isManager.value && needsEditors.value);
</script>
