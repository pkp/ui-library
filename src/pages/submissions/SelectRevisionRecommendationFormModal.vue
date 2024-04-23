<template>
	<SideModalBody>
		<template #title>
			{{ t('editor.submission.decision.requestRevisions') }}
		</template>
		<div class="p-4">
			<div class="bg-secondary p-4">
				<PkpForm
					v-bind="formProps"
					@set="(...args) => emit('set', ...args)"
					@success="
						(...args) => {
							closeModal();
							emit('success', ...args);
						}
					"
				/>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
const props = defineProps({formProps: {type: Object, required: true}});
console.log('SELECT props:', JSON.stringify(props, null, 2));
const emit = defineEmits(['set', 'success']);
const {t} = useLocalize();
const closeModal = inject('closeModal');
</script>
