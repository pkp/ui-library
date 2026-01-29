<template>
	<span :class="cn('author')">
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
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const {cn} = usePkpStyles();

const {t} = usePkpLocalize();

const props = inject('reportDialogProps');
</script>
