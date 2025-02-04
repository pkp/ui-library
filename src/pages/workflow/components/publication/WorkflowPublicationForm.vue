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

const props = defineProps({
	canEdit: {type: Boolean, required: true},
	formName: {type: String, required: true},
	noFieldsMessage: {type: String, required: false, default: null},
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
});

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

const customFns = {
	metadata: metadataDataChange,
};

const {triggerDataChange} = useDataChanged(customFns[props.formName]);

const {set, form} = useForm(publicationForm);

async function metadataDataChange() {
	// Some metadata fields need extra data from db not in publication object
	await fetchForm();
}
</script>
