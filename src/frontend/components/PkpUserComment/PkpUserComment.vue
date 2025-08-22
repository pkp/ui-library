<template>
	<div id="pkpUserCommentsContainer">
		<h3>{{ t('userComment.commentOnThisPublication') }}</h3>

		<template v-for="id in publicationIds" :key="id">
			<PkpAccordion
				:title="getVersionTitle(id)"
				:default-open="id === latestPublicationId"
			>
				<PkpButton
					v-if="!currentUser && id === latestPublicationId"
					class="pkpUserComments__loginButton"
					@click="login"
				>
					{{ t('userComment.login') }}
				</PkpButton>

				<PkpUserCommentsList
					:publication-id="id"
					:items-per-page="itemsPerPage"
					:is-latest-publication="id === latestPublicationId"
					:total-publication-comments="commentsCountPerPublication[id]"
				/>
			</PkpAccordion>
		</template>
	</div>
</template>

<script setup>
import PkpUserCommentsList from '@/frontend/components/PkpUserComment/PkpUserCommentsList.vue';
import PkpAccordion from '@/frontend/components/PkpAccordion/PkpAccordion.vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const {t} = usePkpLocalize();
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
});
const currentUser = pkp.currentUser;

/**
 * Returns the title for the accordion based on the publication ID and the number of comments.
 * @param {number} id - The publication ID.
 * @returns {string} The title for the accordion.
 */
function getVersionTitle(id) {
	return t('userComment.versionWithCount', {
		version: id,
		versionCommentsCount: props.commentsCountPerPublication[id] || 0,
	});
}

/**
 * Redirects the user to the login page.
 */
function login() {
	window.location = props.loginUrl;
}
</script>

<style>
.pkpUserComments__loginButton {
	margin-top: 0.5rem;
	margin-bottom: 1rem;
}
</style>
