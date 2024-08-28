<template>
	<div class="-m-5"><PkpForm v-bind="form" @set="set"></PkpForm></div>
</template>

<script setup>
import PkpForm from '@/components/Form/Form.vue';
import {useForm} from '@/composables/useForm';
import {useUrl} from '@/composables/useUrl';

const props = defineProps({
	form: {type: Object, required: true},
	sections: {type: Array, required: true},
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
});

const {set, form, setValues} = useForm(props.form);

// TODO mock locales object
form.value.supportedFormLocales = [
	{key: 'en', label: 'English'},
	{key: 'fr_CA', label: 'French (Canada)'},
];

const {apiUrl: publicationApiUrl} = useUrl(
	`submissions/${props.submission.id}/publications/${props.publication.id}`,
);

form.value.action = publicationApiUrl.value;

setValues(props.publication);
</script>
