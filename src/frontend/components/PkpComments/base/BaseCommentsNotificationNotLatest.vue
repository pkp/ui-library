<template>
	<div
		v-if="!commentsStore.isLatestPublication(publication.id)"
		:class="cn('notificationNotLatest')"
	>
		<PkpIcon icon="Error" />
		{{ t('userComment.discussionClosed') }}
	</div>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

defineProps({
	publication: {type: Object, required: true},
});

const {cn} = usePkpStyles('PkpComments');

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>
