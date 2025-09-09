<template>
	<div>
		<a
			id="scrollToComments"
			style="cursor: pointer"
			@click.prevent="scrollToComments"
		>
			{{ t('userComment.allComments', {commentCount: allCommentsCount}) }}
		</a>
		<div style="margin-top: 1.5rem">
			<a
				v-if="!currentUser"
				class="pkpScrollToComments__login"
				:href="loginUrl"
			>
				{{ t('userComment.login') }}
			</a>
		</div>
	</div>
</template>

<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const {t} = usePkpLocalize();
const currentUser = pkp.currentUser;

defineProps({
	/** The total number of approved comments across all publication versions */
	allCommentsCount: {
		type: Number,
		required: true,
	},
	/** The URL to the login page */
	loginUrl: {
		type: String,
		required: true,
	},
});

const scrollToComments = () => {
	// Element with ID 'pkpUserCommentsContainer' is defined in the pkpUserComment component.
	const commentsContainer = document.getElementById('pkpUserCommentsContainer');
	if (commentsContainer) {
		commentsContainer.scrollIntoView({behavior: 'smooth'});
	}
};
</script>

<style>
.pkpScrollToComments__login {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: var(--pkp-spacing-2) var(--pkp-spacing-4);
	font: var(--pkp-font-base-bold);
	border-radius: var(--pkp-radius);
	cursor: pointer;
	border: 1px solid var(--pkp-color-transparent);
	gap: var(--pkp-spacing-2);
	background-color: var(--pkp-color-primary);
	color: var(--pkp-text-color-on-dark);
	text-decoration: none;
}

.pkpScrollToComments__login:hover {
	background-color: var(--pkp-color-hover);
	color: var(--pkp-text-color-on-dark);
}
</style>
