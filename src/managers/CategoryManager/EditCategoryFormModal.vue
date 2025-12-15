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
					v-bind="form"
					@set="set"
					@success="(...args) => $emit('categorySaved', ...args)"
				></PkpForm>
			</SideModalLayoutBasic>
		</SideModalBody>
	</div>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useForm} from '@/composables/useForm';

const props = defineProps({
	title: {type: String, required: true},
	formProps: {required: true, type: Object},
});

defineEmits(['categorySaved']);

const {set, form} = useForm(props.formProps);
</script>
