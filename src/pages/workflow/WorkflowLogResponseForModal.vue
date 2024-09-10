<template>
	<SideModalBody>
		<template #pre-title>
			{{ submissionId }}
		</template>
		<template #title>
			<span>{{ t('editor.review.logResponse.for') }}</span>
		</template>
		<template #description>
			<span>{{ description }}</span>
		</template>
		<div class="ml-8 mr-8 h-full bg-secondary">
			<PkpForm
				class="h-full"
				v-bind="store.form"
				@success="store.formSuccess"
				@set="store.updateForm"
			></PkpForm>
		</div>
	</SideModalBody>
</template>

<script setup>
import {useWorkflowLogResponseForModalStore} from './workflowLogResponseForModalStore';
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpForm from '@/components/Form/Form.vue';

const props = defineProps({
	description: {type: String, required: true},
	submissionId: {type: Number, required: true},
	legacyOptions: {type: Object, required: true},
	logResponseForm: {type: Object, required: true},
});

const store = useWorkflowLogResponseForModalStore(props);
</script>
