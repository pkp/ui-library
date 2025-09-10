<template>
	<div>
		<a
			id="scrollToComments"
			style="cursor: pointer"
			@click.prevent="scrollToComments"
		>
			{{
				t('userComment.allComments', {
					commentCount: commentsStore.allCommentsCount,
				})
			}}
		</a>
		<div style="margin-top: 1.5rem">
			<a
				v-if="!commentsStore.getCurrentUser()"
				class="pkpScrollToComments__login"
				:href="commentsStore.loginUrl"
			>
				{{ t('userComment.login') }}
			</a>
		</div>
	</div>
</template>

<script setup>
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();

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
