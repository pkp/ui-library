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
import {computed, watch, onMounted} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import {useFetch} from '@/composables/useFetch';
import {useForm} from '@/composables/useForm';
import {useUrl} from '@/composables/useUrl';
import {useWorkflowPublicationFormIssue} from '../../composables/useWorkflowPublicationFormIssue';
import {useDataChanged} from '@/composables/useDataChanged';

const props = defineProps({
	formName: {type: String, required: true},
	canEdit: {type: Boolean, required: true},
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
});

const relativeUrl = computed(() => {
	return `submissions/${props.submission.id}/publications/${props.publication.id}/_components/issue`;
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

const {set, form} = useForm(publicationForm);

const customFns = {
	issue: issueDataChange,
};

const {triggerDataChange} = useDataChanged(customFns[props.formName]);

async function issueDataChange() {
	await fetchForm();
}

onMounted(async () => {
	await useWorkflowPublicationFormIssue(form);
});
</script>
