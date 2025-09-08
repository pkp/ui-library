<template>
	<span class="pkpUserCommentReportModal____commentAuthor">
		{{
			`
					${
						props.comment.userAffiliation
							? t('userComment.reportCommentByUserWithAffiliation', {
									userName: props.comment.userName,
									affiliation: props.comment.userAffiliation,
								})
							: t('userComment.reportCommentBy', {
									userName: props.comment.userName,
								})
					}`
		}}
	</span>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
const {t} = usePkpLocalize();

const props = inject('reportDialogProps');
console.log('BaseCommentReportDialogAuthor props', props);
</script>
