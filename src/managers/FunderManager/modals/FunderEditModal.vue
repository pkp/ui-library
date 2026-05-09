<template>
	<SideModalBody>
		<template #title>
			<span>{{ title }}</span>
		</template>
		<SideModalLayoutBasic>
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
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {inject, defineEmits} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

defineProps({
	title: {type: String, required: true},
	form: {type: Object, required: true},
});
const emit = defineEmits(['set', 'success']);

const closeModal = inject('closeModal');
</script>
