<template>
	<div>
		<SideModalBody>
			<template #title>
				{{ title }}
			</template>
			<SideModalLayoutBasic>
				<PkpForm
					ref="editRole"
					class="contributorRoles__contributorRoleForm"
					v-bind="form"
					@set="set"
					@success="
						(...args) => {
							$emit('contributorRoleSaved', ...args);
							onSuccess();
						}
					"
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
	formProps: {ype: Object, required: true},
	onSuccess: {type: Function, required: true},
});

const {set, form} = useForm(props.formProps);

defineEmits(['contributorRoleSaved']);
</script>
