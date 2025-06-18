<template>
	<SideModalBody>
		<template #pre-title>
			{{ submissionId }}
		</template>
		<template #title>
			<span>{{ t('editor.review.logResponse.for') }}</span>
		</template>
		<template #description>
			<span>{{ title }}</span>
		</template>
		<div class="ml-8 mr-8 h-full bg-secondary">
			<PkpForm
				v-bind="store.form"
				@success="store.formSuccess"
				@set="store.updateForm"
			></PkpForm>
		</div>
	</SideModalBody>
</template>

<script setup>
import {useCitationRawEditModalStore} from './useCitationRawEditModalStore';
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpForm from '@/components/Form/Form.vue';

const props = defineProps({
	title: {type: String, required: true},
	submissionId: {type: Number, required: true},
	citationRawEditForm: {type: Object, required: true},
});

const store = useCitationRawEditModalStore(props);
</script>
