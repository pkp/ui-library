<template>
	<SideModalBody>
		<template #title>
			{{ t('submission.reviewRound.submitYourResponse') }}
		</template>
		<template #description>
			<span class="text-lg-medium">
				{{ t('submission.reviewRound.authorResponse.note') }}
			</span>
		</template>

		<SideModalLayoutBasic>
			<PkpForm
				v-bind="form"
				@set="set"
				@cancel="closeModal"
				@success="onSuccessFn"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import {inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useAuthorResponseForm} from '@/managers/ReviewRoundResponseManager/useAuthorResponseForm';

const closeModal = inject('closeModal');
const {t} = useLocalize();

const props = defineProps({
	reviewRound: {
		required: true,
		type: Object,
	},
	submission: {required: true, type: Object},
	stageId: {required: true, type: Number},
	authorOptions: {type: Array, required: true},
	onCloseFn: {
		type: Function,
		default: () => () => {},
	},
	onSuccessFn: {
		type: Function,
		required: true,
	},
});

const {form, set} = useAuthorResponseForm({
	submission: props.submission,
	stageId: props.stageId,
	reviewRound: props.reviewRound,
	authorOptions: props.authorOptions,
});
</script>
<style scoped lang="less"></style>
