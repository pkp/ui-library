<template>
	<div>
		<SideModalBody>
			<template #title>
				{{ title }}
			</template>
			<SideModalLayoutBasic>
				<PkpForm
					ref="editCategory"
					class="categories__categoryForm"
					v-bind="currentTemplateForm"
				></PkpForm>
			</SideModalLayoutBasic>
		</SideModalBody>
	</div>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

defineProps({
	title: {type: String, required: true},
	currentTemplateForm: {required: true, type: Object},
});

// const emit = defineEmits(['hax', 'categorySaved']);
</script>
