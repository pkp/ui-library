<template>
	<DialogBody>
		<PkpForm v-bind="form" @cancel="onCloseFn" />
	</DialogBody>
</template>

<script setup>
import {onMounted} from 'vue';
import DialogBody from '@/components/Modal/DialogBody.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';

const store = useWorkflowStore();
const {t} = useLocalize();
const {getLatestPublication} = useSubmission();

const props = defineProps({
	mode: {
		type: String,
		default: 'createNewVersion',
		validator: (value) =>
			['createNewVersion', 'sendToTextEditor'].includes(value),
	},
	onCloseFn: {
		type: Function,
		default: () => () => {},
	},
	onSubmitFn: {
		type: Function,
		default: () => () => {},
	},
});

const {getField, form, clearForm, setValue, setSelectOptions} = useForm(
	store.versionForm,
	{
		customSubmit: props.onSubmitFn,
	},
);

onMounted(() => {
	clearForm();

	const latestPublication = getLatestPublication(store.submission);
	const publications = store.submission?.publications || [];
	const versionSource = getField(store.versionForm, 'versionSource');

	if (versionSource) {
		if (props.mode === 'sendToTextEditor') {
			versionSource.isRequired = true;
			versionSource.label = t(
				'publication.versionSource.sendToTextEditor.label',
			);
			versionSource.description = null; // no description
		} else {
			versionSource.isRequired = false;
			versionSource.label = t('publication.versionSource.create.label');
			versionSource.description = t(
				'publication.versionSource.create.description',
			);
		}

		const options = [
			...(props.mode === 'sendToTextEditor'
				? [{label: t('publication.createVersion'), value: ''}]
				: []),
			...publications.map((publication) => ({
				label: publication.versionString,
				value: publication.id,
			})),
		];

		setSelectOptions(store.versionForm, 'versionSource', options);
	}

	if (props.mode === 'createNewVersion') {
		setValue('versionSource', latestPublication?.id);
	} else {
		setValue('versionSource', null);
	}
});
</script>
