<template>
	<pkp-button
		v-if="
			!commentsVersionStore.currentUser &&
			commentsVersionStore.isLatestPublication
		"
		@click="commentsVersionStore.login"
	>
		{{ t('userComment.login') }}
	</pkp-button>
</template>

<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsVersionStore} from '../usePkpCommentsVersionStore';

const commentsVersionStore = usePkpCommentsVersionStore();

const {t} = usePkpLocalize();
</script>
../usePkpCommentsVersionStore
