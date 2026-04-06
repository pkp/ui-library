<template>
	<SideModalBody>
		<template #title>
			<span v-if="isAuthor">
				{{ t('submission.reviewRound.submitYourResponse') }}
			</span>
			<span v-else>
				{{ t('submission.reviewRound.authorResponseToReviews') }}
			</span>
		</template>

		<template #description>
			<span
				v-if="isAuthor && !reviewRound.authorResponse"
				class="text-lg-medium"
			>
				{{ t('submission.reviewRound.authorResponse.note') }}
			</span>
			<span
				v-else-if="isAuthor && !!reviewRound.authorResponse"
				class="text-lg-medium"
			>
				{{ t('submission.reviewRound.authorResponse.authorCannotEdit') }}
			</span>
			<span v-else class="text-lg-medium">
				{{
					t('submission.reviewRound.authorResponse.noteForEditor', {
						userFullName: reviewRound.authorResponse.submittedByUser.fullName,
					})
				}}
			</span>
		</template>

		<SideModalLayoutBasic>
			<PkpForm
				v-bind="form"
				@set="set"
				@cancel="closeModal"
				@success="onSuccessFn"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import {computed, inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useAuthorResponseForm} from '@/managers/ReviewRoundResponseManager/useAuthorResponseForm';
import {useCurrentUser} from '@/composables/useCurrentUser';

const closeModal = inject('closeModal');
const {t} = useLocalize();
const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();
const props = defineProps({
	reviewRound: {
		required: true,
		type: Object,
	},
	submission: {required: true, type: Object},
	stageId: {required: true, type: Number},
	authorOptions: {type: Array, required: true},
	onCloseFn: {
		type: Function,
		default: () => () => {},
	},
	onSuccessFn: {
		type: Function,
		required: true,
	},
});

/**
 * Indicates if the current user is an author in the submission's stage
 */
const isAuthor = computed(() => {
	return hasCurrentUserAtLeastOneAssignedRoleInStage(
		props.submission,
		props.stageId,
		[pkp.const.ROLE_ID_AUTHOR],
	);
});

const {form, set} = useAuthorResponseForm({
	submission: props.submission,
	stageId: props.stageId,
	reviewRound: props.reviewRound,
	authorOptions: props.authorOptions,
});
</script>
<style scoped lang="less"></style>
