<template>
	<div>
		<span class="text-lg-normal">
			{{ t('submission.list.changeSubmissionLanguage.currentLanguage') }}
		</span>
		<span class="text-lg-bold text-heading">{{ languageLabel }}</span>
		<PkpButton
			v-if="canChangeSubmissionLanguage"
			is-link
			@click="handleChangeLanguage"
		>
			{{ t('submission.list.changeSubmissionLanguage.buttonLabel') }}
		</PkpButton>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import PkpButton from '@/components/Button/Button.vue';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';

const {t} = useLocalize();

const props = defineProps({
	submission: {type: Object, required: true},
	canChangeSubmissionLanguage: {type: Boolean, required: true},
});

const languageLabel = computed(
	() => props.submission.metadataLocales[props.submission.locale],
);

const store = useWorkflowStore();

function handleChangeLanguage() {
	store.workflowChangeSubmissionLanguage();
}
</script>
