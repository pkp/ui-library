<template>
	<pkp-button
		v-if="!commentsStore.getCurrentUser()"
		:class="cn('logInto')"
		@click="commentsStore.login"
	>
		{{ t('userComment.login') }}
	</pkp-button>
</template>

<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const {cn} = usePkpStyles('PkpScrollToComments');

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>
