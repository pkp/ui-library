<template>
	<div
		v-if="store.invitationPayload.disabled"
		class="m-8 border-x border-b border-t border-light bg-secondary p-4"
	>
		<h2 class="text-xl-bold text-heading">
			{{ t('userInvitation.user.disableTitle') }}
		</h2>
		<p class="text-base-normal text-secondary">
			{{ t('userInvitation.user.disableMessage') }}
		</p>
	</div>
	<div>
		<div v-if="Object.keys(store.errors).length" class="p-4">
			<FormErrorSummary :errors="store.errors" />
		</div>
		<PkpForm
			v-bind="reviewerRevieweDetailsForm"
			class="userInvitation__stepForm"
			:show-error-footer="false"
			@set="updateReviewerRevieweDetailsForm"
		></PkpForm>
	</div>
	<div v-if="fileManagerProps.submission" class="m-8">
		<FileManager
			v-bind="fileManagerProps"
			v-model:selected-file-ids="selectedFileIds"
		></FileManager>
	</div>
</template>
<script setup>
import {defineProps, computed, ref, onMounted, watch} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import {useForm} from '@/composables/useForm';
import FormErrorSummary from '@/components/Form/FormErrorSummary.vue';
import {useLocalize} from '@/composables/useLocalize';
import FileManager from '@/managers/FileManager/FileManager.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

const props = defineProps({
	form: {type: Object, required: true},
	validateFields: {type: Array, required: true},
});
const {
	form: reviewerRevieweDetailsForm,
	connectWithPayload,
	connectWithErrors,
	set,
	structuredErrors,
} = useForm(props.form);

const store = useUserInvitationPageStore();
const {t} = useLocalize();
const submission = ref(null);
const selectedFileIds = ref([]);

reviewerRevieweDetailsForm.value.fields.forEach((field) => {
	if (store.invitationPayload[field.name] === null) {
		store.updatePayload(field.name, field.value, false);
	} else {
		store.updatePayload(field.name, store.invitationPayload[field.name], false);
	}
});
connectWithPayload(store.invitationPayload);

/*
 * Update the payload by using form values on multilingual or not
 * @param id string
 * @param form Object
 * @param c
 * @param d
 */
function updateReviewerRevieweDetailsForm(id, form, c, d) {
	set(id, form, c, d);
	if (form.fields) {
		form.fields.forEach((field) => {
			store.updatePayload(field.name, field.value, false);
		});
	}
}

/**
 * handing errors and covert dot notation to object
 */
const sectionErrors = computed(() => {
	return structuredErrors(store.errors);
});
connectWithErrors(sectionErrors);

/** fetch submissiom file url */
const {apiUrl: fetchSubmissionApiUrl} = useUrl(
	`submissions/${store.invitationPayload.submissionId}`,
);

async function getSubmission() {
	const {data, fetch} = useFetch(fetchSubmissionApiUrl, {});
	await fetch();
	if (data.value) {
		// assign into the ref so reactivity is preserved
		submission.value = data.value;
	}
}

const fileManagerProps = computed(() => {
	return {
		namespace: 'EDITOR_REVIEW_FILES_SELECT',
		submission: submission.value,
		submissionStageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
		reviewRoundId: store.invitationPayload.reviewRoundId,
	};
});

onMounted(async () => {
	await getSubmission();
});

// persist selected file ids into the page store so it can be used elsewhere
watch(selectedFileIds, (fileIds) => {
	store.updatePayload('selectedFileIds', fileIds, false);
});
</script>
