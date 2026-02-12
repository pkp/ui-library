<template>
	<SideModalBody>
		<template #title>
			<span>{{ title }}</span>
		</template>
		<div class="data-citation-edit-modal-container">
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
import {inject, defineEmits} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpForm from '@/components/Form/Form.vue';

defineProps({
	title: {type: String, required: true},
	form: {type: Object, required: true},
});

const emit = defineEmits(['set', 'success']);

const closeModal = inject('closeModal');
</script>
