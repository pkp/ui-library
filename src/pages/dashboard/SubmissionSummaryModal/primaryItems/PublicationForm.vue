<template>
	<div class="-m-5">
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
	formName: {type: String, required: true},
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

const {triggerDataChange} = useDataChanged(() => fetchForm());

const {set, form} = useForm(publicationForm);
</script>
