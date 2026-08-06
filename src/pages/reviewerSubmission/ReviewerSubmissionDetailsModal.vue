<template>
	<SideModalBody class="text-base-normal">
		<template #title>
			{{ t('reviewer.step1.viewAllDetails') }}
		</template>
		<SideModalLayoutBasic>
			<div v-if="isLoading" class="flex justify-center p-8">
				<Spinner />
			</div>
			<PkpForm
				v-else
				v-bind="form"
				field-heading-element="h2"
				:display-only="true"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useReviewerSubmissionDetailsForm} from './useReviewerSubmissionDetailsForm';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpForm from '@/components/Form/Form.vue';

const props = defineProps({
	submissionId: {type: Number, required: true},
	publicationId: {type: Number, required: true},
	/** Used to render a data citation in the read-only view modal */
	dataCitationEditForm: {type: Object, default: () => ({})},
});

const {t} = useLocalize();

const {form, isLoading} = useReviewerSubmissionDetailsForm({
	submissionId: props.submissionId,
	publicationId: props.publicationId,
	dataCitationEditForm: props.dataCitationEditForm,
});
</script>
