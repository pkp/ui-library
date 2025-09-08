<template>
	<PkpButton
		v-if="
			!commentsVersionStore.currentUser &&
			commentsVersionStore.isLatestPublication
		"
		@click="commentsVersionStore.login"
	>
		{{ t('userComment.login') }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '../components/PkpButton/PkpButton.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsVersionStore} from './usePkpCommentsVersionStore';

const commentsVersionStore = usePkpCommentsVersionStore();

const {t} = usePkpLocalize();
</script>
../usePkpCommentsVersionStore
