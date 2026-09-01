<template>
	<SideModalBody>
		<template #title>
			{{ modalTitle }}
		</template>
		<template #post-description>
			<Spinner v-if="isLoadingReview"></Spinner>
			<p v-else-if="modifiedByMessage" class="text-lg-normal text-secondary">
				{{ modifiedByMessage }}
			</p>
		</template>
		<SideModalLayoutBasic>
			<PkpForm
				v-bind="form"
				class="[&_.semantic-defaults>p:first-child]:mt-0"
				field-heading-element="h2"
				:display-only="true"
				@set="set"
			/>
			<!-- Out of the form's footer, since neither button saves the form -->
			<div class="mt-6 border-t border-light pt-4">
				<p
					v-if="confirmBlockedMessage"
					class="mb-4 text-end text-lg-normal text-secondary"
				>
					{{ confirmBlockedMessage }}
				</p>
				<ButtonRow>
					<PkpButton :is-warnable="true" @click="closeModal">
						{{ t('common.cancel') }}
					</PkpButton>
					<PkpButton :is-disabled="isLoadingReview" @click="editReview">
						{{ t('editor.review.modifyReview') }}
					</PkpButton>
					<PkpButton
						:is-disabled="
							isLoadingReview ||
							isConfirming ||
							isConfirmed ||
							!!confirmBlockedMessage
						"
						@click="confirm"
					>
						{{ t('editor.review.markAsComplete') }}
					</PkpButton>
				</ButtonRow>
			</div>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {computed, inject} from 'vue';
import {t} from '@/utils/i18n';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useReviewDetails} from './useReviewDetails';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const props = defineProps({
	submission: {type: Object, required: true},
	submissionStageId: {type: Number, required: true},
	reviewRoundId: {type: Number, required: true},
	reviewAssignment: {type: Object, required: true},
	recommendations: {type: Array, required: true},
	onDataChangedFn: {type: Function, default: () => () => {}},
});

const closeModal = inject('closeModal');
const {localizeSubmission} = useLocalize();
const {getCurrentPublication} = useSubmission();

const modalTitle = computed(() => {
	const currentPublication = getCurrentPublication(props.submission);

	return `${t('semicolon', {label: t('editor.review.reviewDetails')})} ${localizeSubmission(
		currentPublication.fullTitle,
		currentPublication.locale,
	)}`;
});

const {
	form,
	set,
	isLoadingReview,
	isConfirming,
	isConfirmed,
	confirmBlockedMessage,
	confirm,
	editReview,
	modifiedByMessage,
} = useReviewDetails(props);
</script>
