<template>
	<SideModalBody>
		<template #title>
			{{ t('publication.scheduledForPublication.versionStage.label') }}
		</template>
		<template #description>
			<span class="text-lg-medium">
				{{ t('publication.scheduledForPublication.versionStage.description') }}
			</span>
		</template>
		<SideModalLayoutBasic>
			<PkpForm v-bind="form" @cancel="onCloseFn" @set="set" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useWorkflowVersionForm} from '../../composables/useWorkflowVersionForm';

const props = defineProps({
	onCloseFn: {
		type: Function,
		default: () => () => {},
	},
	onSubmitFn: {
		type: Function,
		default: () => () => {},
	},
});

const {form, set} = useWorkflowVersionForm(
	'publish',
	props.onCloseFn,
	props.onSubmitFn,
);
</script>
