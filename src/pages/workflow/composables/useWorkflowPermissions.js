import {computed} from 'vue';
import {useSubmission} from '@/composables/useSubmission';
import {EditorialRoles, useCurrentUser} from '@/composables/useCurrentUser';

function hasIntersection(arr1, arr2) {
	const set = new Set(arr1);
	return arr2.some((item) => set.has(item));
}

export function useWorkflowPermissions({submission, selectedPublication}) {
	const {getActiveStage, getStageById} = useSubmission();
	const {hasCurrentUserAtLeastOneRole} = useCurrentUser();

	const permissions = computed(() => {
		// View title, metadata, etc.
		let canAccessPublication = false;
		let canEditPublication = false;
		// Access to galleys and issue entry
		let canAccessProduction = false;
		// Ability to publish, unpublish and create versions
		let canPublish = false;
		// Access to activity log
		let canAccessEditorialHistory = false;
		// Changing submission language
		let canChangeSubmissionLanguage = false;

		let accessibleStages = [];

		if (!submission.value) {
			return {
				canAccessPublication,
				canAccessProduction,
				canEditPublication,
				canPublish,
				canAccessEditorialHistory,
				accessibleStages,
			};
		}

		const activeStage = getActiveStage(submission.value);
		const productionStage = getStageById(
			submission.value,
			pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
		);

		submission.value.stages.forEach((stage) => {
			if (stage.currentUserAssignedRoles.length) {
				accessibleStages.push(stage.id);
			}
		});

		// TODO this will be replaced by with one flag from backend
		productionStage.stageAssignments
			.filter(
				(stageAssignment) => stageAssignment.userId === pkp.currentUser.id,
			)
			.forEach((stageAssignment) => {
				if (stageAssignment.canChangeMetadata) {
					canEditPublication = true;
				}
			});
		if (hasCurrentUserAtLeastOneRole([pkp.const.ROLE_ID_MANAGER])) {
			canEditPublication = true;
		}

		if (
			selectedPublication.value &&
			selectedPublication.value?.status === pkp.const.STATUS_PUBLISHED
		) {
			canEditPublication = false;
		}

		if (
			hasIntersection(activeStage.currentUserAssignedRoles, [
				...EditorialRoles,
				pkp.const.ROLE_ID_AUTHOR,
			])
		) {
			canAccessPublication = true;

			if (
				hasIntersection(productionStage.currentUserAssignedRoles, [
					...EditorialRoles,
					pkp.const.ROLE_ID_AUTHOR,
				])
			) {
				canAccessProduction = true;
			}
			if (
				!productionStage.currentUserCanRecommendOnly &&
				hasIntersection(productionStage.currentUserAssignedRoles, [
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_MANAGER,
				])
			) {
				canPublish = true;
			}
		}

		if (
			hasIntersection(activeStage.currentUserAssignedRoles, [
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_SUB_EDITOR,
			])
		) {
			canAccessEditorialHistory = true;
		}

		if (canPublish || canEditPublication) {
			canChangeSubmissionLanguage = true;
		}

		return {
			canAccessPublication,
			canAccessProduction,
			canEditPublication,
			canPublish,
			canAccessEditorialHistory,
			canChangeSubmissionLanguage,
			accessibleStages,
		};
	});

	return {permissions};
}
