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

const store = useWorkflowStore();

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

const {form} = useForm(store.versionForm, {
	customSubmit: props.onSubmitFn,
});
</script>
