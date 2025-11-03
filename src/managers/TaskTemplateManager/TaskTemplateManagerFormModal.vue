<template>
	<SideModalBody>
		<template #title>
			{{
				taskTemplate
					? t('taskTemplates.edit')
					: t('taskTemplates.addInStage', {stage: stage.name})
			}}
		</template>

		<SideModalLayoutBasic>
			<PkpForm v-bind="form" @cancel="closeModal" @set="set" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {inject} from 'vue';
import {t} from '@/utils/i18n';
import {useTaskTemplateManagerForm} from './useTaskTemplateManagerForm';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

const closeModal = inject('closeModal');

const props = defineProps({
	stage: {
		type: String,
		required: true,
	},
	taskTemplate: {
		type: Object,
		default: () => null,
	},
});

const {form, set} = useTaskTemplateManagerForm(props);
</script>
