<template>
	<TableCell>
		<pkp-button
			class="submissions__list__item__view"
			:aria-describedby="'submission-title-' + submission.id"
			:is-link="true"
			@click="pageComponent.openSummaryModal(submission)"
		>
			{{ t('editor.submission.viewSummary') }}
		</pkp-button>
	</TableCell>
</template>
<script>
import TableCell from '@/components/TableNext/TableCell.vue';
import {mapStores} from 'pinia';
import {useSubmissionsStore} from '@/pages/submissions/submissionsStore';

export default {
	components: {
		TableCell,
	},
	props: {
		submission: Object,
	},
	computed: {...mapStores(useSubmissionsStore)},
	inject: ['pageComponent'],
};
</script>
