<template>
	<pkp-button
		v-if="
			!commentsStore.getCurrentUser() &&
			commentsStore.isLatestPublication(publicationId)
		"
		class="BaseCommentsLogInto"
		@click="commentsStore.login"
	>
		{{ t('userComment.login') }}
	</pkp-button>
</template>

<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const commentsStore = usePkpCommentsStore();
const publicationId = inject('publicationId');
const {t} = usePkpLocalize();
</script>
