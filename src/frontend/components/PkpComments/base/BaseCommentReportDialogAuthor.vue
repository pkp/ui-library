<template>
	<span :class="cn('author')">
		{{
			comment.userAffiliation
				? t('userComment.reportCommentByUserWithAffiliation', {
						userName: comment.userName,
						affiliation: comment.userAffiliation,
					})
				: t('userComment.reportCommentBy', {
						userName: comment.userName,
					})
		}}
	</span>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

defineProps({
	comment: {type: Object, required: true},
});

const {cn} = usePkpStyles('PkpCommentReportDialog');
const {t} = usePkpLocalize();
</script>
