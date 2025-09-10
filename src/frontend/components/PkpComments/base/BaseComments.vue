<template>
	<div class="BaseComments"><slot></slot></div>
</template>

<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const props = defineProps({
	/** The ID of the latest publication associated with the published item(article, book, etc.)*/
	latestPublicationId: {
		type: Number,
		required: true,
	},
	/** An array of published publication IDs associated with the published item(article, book, etc.) */
	publicationIds: {
		type: Array,
		required: false,
		default: () => [],
	},
	/** Number of comments get when fetching comments */
	itemsPerPage: {
		type: Number,
		required: true,
	},
	/**
	 * URL to redirect the user to login page
	 */
	loginUrl: {
		type: String,
		required: true,
	},
	/**
	 * An object where keys are publication IDs and values are the number of approved comments for that publication
	 */
	commentsCountPerPublication: {
		type: Object,
		required: true,
	},
	/**
	 * Total number of approved comments across all publications
	 */
	allCommentsCount: {
		type: Number,
		required: true,
	},
});

const commentsStore = usePkpCommentsStore();
commentsStore.initialize(props);
</script>
