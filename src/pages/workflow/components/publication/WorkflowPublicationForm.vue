<template>
	<div v-if="displayNoFieldsEnabled" class="text-lg-normal">
		{{ noFieldsMessage }}
	</div>
	<div v-else class="-m-5">
		<PkpForm
			v-if="form"
			v-bind="form"
			@set="set"
			@success="triggerDataChange"
		></PkpForm>
	</div>
</template>

<script setup>
import {computed, watch} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import {useFetch} from '@/composables/useFetch';
import {useForm} from '@/composables/useForm';
import {useUrl} from '@/composables/useUrl';
import {useDataChanged} from '@/composables/useDataChanged';
import {useApp} from '@/composables/useApp';
import {useWorkflowPublicationFormIssue} from '../../composables/useWorkflowPublicationFormIssue';

const props = defineProps({
	canEdit: {type: Boolean, required: true},
	formName: {type: String, required: true},
	noFieldsMessage: {type: String, required: false, default: null},
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
});

const {isOJS} = useApp();

const relativeUrl = computed(() => {
	return `submissions/${props.submission.id}/publications/${props.publication.id}/_components/${props.formName}`;
});

const {apiUrl: publicationFormUrl} = useUrl(relativeUrl);
const {data: publicationForm, fetch: fetchForm} = useFetch(publicationFormUrl);

watch(
	relativeUrl,
	() => {
		fetchForm();
	},
	{immediate: true},
);

watch(publicationForm, (newPublicationForm) => {
	newPublicationForm.canSubmit = props.canEdit;
});

const displayNoFieldsEnabled = computed(() => {
	if (publicationForm.value && publicationForm.value.fields.length === 0) {
		return true;
	}

	return false;
});

const {set, form} = useForm(publicationForm);

const customFns = {
	metadata: metadataDataChange,
	issue: issueDataChange,
};

const {triggerDataChange} = useDataChanged(customFns[props.formName]);

async function metadataDataChange() {
	// Some metadata fields need extra data from db not in publication object
	await fetchForm();
}

// This handle the case where the issue selection done vai `Schedule For Publication` modal while at issue page
// but not finalise the publication status(publishing or scheduling) at final step but close the modal
// so we need to fetch the form again to update the issue selection field to reflect the changes.
async function issueDataChange() {
	await fetchForm();
}

watch(
	form,
	async (newForm) => {
		if (newForm && props.formName === 'issue' && isOJS()) {
			const {initialize} = useWorkflowPublicationFormIssue(
				newForm,
				props.publication,
			);
			await initialize();
		}
	},
	{immediate: false},
);
</script>
