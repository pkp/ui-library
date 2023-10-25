<template>
	<TableCell>
		<!-- fix openSummary -->
		<pkp-button
			class="submissions__list__item__view"
			:aria-describedby="'submission-title-' + submission.id"
			:is-link="true"
			@click="openSummary(submission)"
		>
			{{ t('editor.submission.viewSummary') }}
		</pkp-button>
	</TableCell>
</template>
<script>
import TableCell from '@/components/TableNext/TableCell.vue';

export default {
	components: {
		TableCell,
	},
	props: {
		submission: Object,
	},
};
</script>
