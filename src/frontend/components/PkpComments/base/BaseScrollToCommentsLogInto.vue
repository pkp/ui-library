<template>
	<pkp-button
		v-if="!commentsStore.getCurrentUser()"
		class="pkpScrollToComments__log-into"
		@click="commentsStore.login"
	>
		{{ t('userComment.login') }}
	</pkp-button>
</template>

<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>
