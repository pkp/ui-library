<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm
				ref="editRecommendation"
				class="recommendations__recommendationForm"
				v-bind="formProps"
				@success="(...args) => $emit('recommendationSaved', ...args)"
				@set="(...args) => $emit('updateForm', ...args)"
			></PkpForm>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

defineProps({
	title: {type: String, required: true},
	formProps: {type: Object, required: true},
});

defineEmits(['recommendationSaved', 'updateForm']);
</script>
