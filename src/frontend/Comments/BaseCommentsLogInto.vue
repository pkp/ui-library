<template>
	<PkpButton
		v-if="!versionApi.currentUser && versionApi.isLatestPublication"
		@click="commentsStore.login"
	>
		{{ t('userComment.login') }}
	</PkpButton>
</template>

<script setup>
import {inject} from 'vue';

import PkpButton from '../components/PkpButton/PkpButton.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from './usePkpCommentsStore';
const commentsStore = usePkpCommentsStore();

const {t} = usePkpLocalize();
const versionProps = inject('versionProps');
const versionApi = commentsStore.getApiPerVersion(versionProps.publicationId);
</script>
