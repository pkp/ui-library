<template>
	<PkpModalBody>
		<template #title>
			{{ title }}
		</template>
		<PkpModalLayoutBasic>
			<span class="pkpUserCommentReportModal____commentAuthor">
				{{
					`
					${
						comment.userAffiliation
							? t('userComment.reportCommentByUserWithAffiliation', {
									userName: comment.userName,
									affiliation: comment.userAffiliation,
								})
							: t('userComment.reportCommentBy', {
									userName: comment.userName,
								})
					}`
				}}
			</span>

			<p
				v-strip-unsafe-html="comment.commentText.trim()"
				class="pkpUserCommentReportModal____commentText"
			></p>

			<strong class="pkpUserCommentReportModal____reportReason">
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
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
const {t} = usePkpLocalize();

const reportText = ref('');
defineProps({
	/** The title of the modal */
	title: {
		type: String,
		required: true,
	},
	/** The comment to be reported */
	comment: {
		type: Object,
		required: true,
	},
	/** Function to be called when the report reason is submitted */
	onSubmit: {
		type: Function,
		required: true,
	},
	/** Function to be called when the modal is cancelled */
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

.pkpUserCommentReportModal____commentAuthor {
	font-size: var(--pkp-text-base-light);
	color: var(--pkp-text-color-secondary);
}

.pkpUserCommentReportModal____commentText {
	font-weight: var(--pkp-text-base-light--font-weight);
	font-size: var(--pkp-text-lg-normal);
	color: var(--pkp-text-color-default);
}

.pkpUserCommentReportModal____reportReason {
	color: var(--pkp-text-color-heading);
}
</style>
