<template>
	<SideModalBody>
		<template #title>
			<span>{{ title }}</span>
		</template>
		<div class="citation-edit-modal-container">
			<div class="ml-8 mr-8 h-full bg-secondary">
				<PkpForm
					v-bind="form"
					@set="(...args) => emit('set', ...args)"
					@success="
						(...args) => {
							closeModal();
							emit('success', ...args);
						}
					"
				></PkpForm>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {defineProps, inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpForm from '@/components/Form/Form.vue';

const {t} = useLocalize();

const props = defineProps({
	title: {type: String, required: true},
	form: {type: Object, required: true},
	citation: {type: Number, required: true},
});

const emit = defineEmits(['set', 'success']);

const closeModal = inject('closeModal');
</script>

<style>
.citation-edit-modal-container #citation_raw-rawCitation-control,
.citation-edit-modal-container #citation_structured-rawCitation-control {
	height: 5rem;
}
.citation-edit-modal-container fieldset {
	padding-top: 0;
	margin-top: 1.5rem;
}
</style>
