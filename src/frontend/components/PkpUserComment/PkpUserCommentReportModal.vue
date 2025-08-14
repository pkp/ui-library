<template>
	<PkpModalBody>
		<template #title>
			{{ title }}
		</template>
		<PkpModalLayoutBasic>
			<span style="font-size: 0.875rem; color: #5a5a5a">
				{{ t('userComment.reportComment') }} {{ comment.userName }}
			</span>

			<p
				style="
					margin-top: 0.5rem;
					font-size: 1rem;
					color: #000;
					line-height: 1.5;
				"
			>
				{{ comment.commentText }}
			</p>

			<strong style="display: block; margin-top: 1.5rem; color: #004165">
				{{ t('userComment.report.reason') }}
			</strong>

			<PkpTextarea
				:model-value="reportText"
				@update:model-value="updateReportText"
			></PkpTextarea>

			<div class="pkpUserCommentReportModal____actions">
				<PkpButton :is-secondary="true" @click="onCancel">
					{{ t('common.cancel') }}
				</PkpButton>
				<PkpButton @click="onSubmit(comment, reportText)">
					{{ t('userComment.report') }}
				</PkpButton>
			</div>
		</PkpModalLayoutBasic>
	</PkpModalBody>
</template>
<script setup>
import PkpModalBody from '@/frontend/components/PkpModal/PkpModalBody.vue';
import PkpModalLayoutBasic from '@/frontend/components/PkpModal/PkpModalLayoutBasic.vue';
import PkpTextarea from '@/frontend/components/PkpTextarea/PkpTextarea.vue';
import {defineProps, ref} from 'vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import {useLocalize} from '@/composables/useLocalize';
const {t} = useLocalize();

const reportText = ref('');
defineProps({
	title: {
		type: String,
		required: true,
	},
	comment: {
		type: Object,
		required: true,
	},
	onSubmit: {
		type: Function,
		required: true,
	},
	onCancel: {
		type: Function,
		required: true,
	},
});

function updateReportText(value) {
	reportText.value = value;
}
</script>

<style>
.pkpUserCommentReportModal____actions {
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	margin-top: 1rem;
}
</style>
