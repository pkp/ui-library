<template>
	<pkp-button
		v-if="
			!commentsStore.getCurrentUser() &&
			commentsStore.isLatestPublication(publication.id)
		"
		class="pkpComments__log-into"
		@click="commentsStore.login"
	>
		{{ t('userComment.login') }}
	</pkp-button>
</template>

<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

defineProps({
	publication: {type: Object, required: true},
});

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>
