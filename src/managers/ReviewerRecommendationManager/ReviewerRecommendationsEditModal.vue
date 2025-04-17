<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<template #default="{closeModal}">
			<SideModalLayoutBasic>
				<PkpForm
					ref="editRecommendation"
					class="recommendations__recommendationForm"
					v-bind="formProps"
					@success="closeModal()"
					@set="set"
				></PkpForm>
			</SideModalLayoutBasic>
		</template>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useForm} from '@/composables/useForm';

const props = defineProps({
	title: {type: String, required: true},
	formProps: {type: Object, required: true},
});

const {set} = useForm(props.formProps);
</script>
