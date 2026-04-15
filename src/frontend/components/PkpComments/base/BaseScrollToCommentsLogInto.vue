<template>
	<PkpButton
		v-if="!commentsStore.getCurrentUser()"
		:class="cn('logInto')"
		@click="commentsStore.login"
	>
		{{ t('userComment.login') }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const {cn} = usePkpStyles('PkpScrollToComments');

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>
