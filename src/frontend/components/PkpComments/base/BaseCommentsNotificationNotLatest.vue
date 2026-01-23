<template>
	<div
		v-if="!commentsStore.isLatestPublication(publication.id)"
		class="pkpComments__notification-not-latest"
	>
		<PkpIcon icon="Error" />
		{{ t('userComment.discussionClosed') }}
	</div>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

defineProps({
	publication: {type: Object, required: true},
});

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>

<style>
.pkpComments__notification-not-latest {
	display: flex;
	align-items: center;
}
</style>
