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
					class="userComments__loginButton"
					@click="login"
				>
					{{ t('userComment.login') }}
				</PkpButton>

				<PkpUserCommentsList
					:publication-id="id"
					:items-per-page="itemsPerPage"
					:is-latest-publication="id === latestPublicationId"
					:total-publication-comments="commentsCountPerPublication[id] || 0"
				/>
			</PkpAccordion>
		</template>
	</div>
</template>

<script setup>
import PkpUserCommentsList from '@/frontend/components/PkpUserComment/PkpUserCommentsList.vue';
import PkpAccordion from '@/frontend/components/PkpAccordion/PkpAccordion.vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();
const props = defineProps({
	latestPublicationId: {
		type: Number,
		required: true,
	},
	publicationIds: {
		type: Array,
		required: false,
		default: () => [],
	},
	userCommentForm: {
		type: Object,
		required: true,
	},
	userCommentReportForm: {
		type: Object,
		required: true,
	},
	itemsPerPage: {},
	loginUrl: {
		type: String,
		required: true,
	},
	commentsCountPerPublication: {
		type: Object,
		required: true,
	},
});
const currentUser = pkp.currentUser;

function getVersionTitle(id) {
	return t('userComment.versionWithCount', {
		version: id,
		versionCommentsCount: props.commentsCountPerPublication[id],
	});
}

function login() {
	window.location = props.loginUrl;
}
</script>

<style>
.userComments__loginButton {
	margin-top: 0.5rem;
	margin-bottom: 1rem;
}
</style>
