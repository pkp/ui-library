<template>
	<SideModalBody>
		<template #title>
			{{ t('editor.review.modifyReview') }}
		</template>
		<template #description>
			{{ submissionTitle }}
		</template>
		<template #post-description>
			<Spinner v-if="isLoadingReview"></Spinner>
		</template>

		<SideModalLayoutBasic>
			<PkpForm
				v-bind="form"
				class="[&_.semantic-defaults>p:first-child]:mt-0"
				@cancel="closeModal"
				@set="set"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {computed, inject} from 'vue';
import {t} from '@/utils/i18n';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useReviewDetailsEdit} from './useReviewDetailsEdit';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const props = defineProps({
	submission: {type: Object, required: true},
	submissionStageId: {type: Number, required: true},
	reviewRoundId: {type: Number, required: true},
	reviewAssignment: {type: Object, required: true},
	recommendations: {type: Array, required: false, default: () => []},
	onSavedFn: {type: Function, default: () => () => {}},
});

const closeModal = inject('closeModal');
const {localizeSubmission} = useLocalize();
const {getCurrentPublication} = useSubmission();

const submissionTitle = computed(() => {
	const currentPublication = getCurrentPublication(props.submission);

	return localizeSubmission(
		currentPublication.fullTitle,
		currentPublication.locale,
	);
});

const {form, set, isLoadingReview} = useReviewDetailsEdit(props);
</script>
