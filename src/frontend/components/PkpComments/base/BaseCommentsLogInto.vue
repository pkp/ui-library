<template>
	<pkp-button
		v-if="
			!commentsStore.getCurrentUser() &&
			commentsStore.isLatestPublication(publication.id)
		"
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

defineProps({
	publication: {type: Object, required: true},
});

const {cn} = usePkpStyles('PkpComments');

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>
