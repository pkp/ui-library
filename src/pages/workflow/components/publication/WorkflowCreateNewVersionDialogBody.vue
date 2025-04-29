<template>
	<DialogBody>
		<PkpForm v-bind="form" @cancel="onCloseFn" />
	</DialogBody>
</template>

<script setup>
import DialogBody from '@/components/Modal/DialogBody.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';

const store = useWorkflowStore();
const {t} = useLocalize();

const props = defineProps({
	onCloseFn: {
		type: Function,
		default: () => () => {},
	},
	onSubmitFn: {
		type: Function,
		default: () => () => {},
	},
});

const {getField, form} = useForm(store.versionForm, {
	customSubmit: props.onSubmitFn,
});

const publications = store.submission?.publications || [];
const publicationField = getField(store.versionForm, 'publication');

if (publicationField) {
	publicationField.options = [
		{label: t('publication.createVersion'), value: ''},
		...publications.map((publication) => ({
			label: publication.versionString,
			value: publication.id,
		})),
	];
}
</script>
