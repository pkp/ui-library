<template>
	<PkpForm
		v-if="form"
		v-bind="form"
		@set="set"
		@success="triggerDataChange"
	></PkpForm>
</template>

<script setup>
import {computed, watch} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import {useFetch} from '@/composables/useFetch';
import {useForm} from '@/composables/useForm';
import {useUrl} from '@/composables/useUrl';
import {useDataChanged} from '@/composables/useDataChanged';

const props = defineProps({
	formName: {type: String, required: true},
	submission: {type: Object, required: true},
});

const relativeUrl = computed(() => {
	// its not publication specific, but its under publications endpoint, therefore selecting publication works correctly
	return `submissions/${props.submission.id}/publications/${props.submission.publications[0].id}/_components/${props.formName}`;
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

const {triggerDataChange} = useDataChanged();

const {set, form} = useForm(publicationForm);
</script>
