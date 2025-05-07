<template>
	<DialogBody>
		<PkpForm v-bind="form" @cancel="onCloseFn" @set="updateForm" />
	</DialogBody>
</template>

<script setup>
import DialogBody from '@/components/Modal/DialogBody.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useWorkflowVersionForm} from '../../composables/useWorkflowVersionForm';

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

const {form, updateForm} = useWorkflowVersionForm(props.mode, props.onSubmitFn);
</script>
