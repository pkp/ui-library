<template>
	<div
		v-if="!commentsStore.isLatestPublication(publication.id)"
		:class="cn('root')"
	>
		<PkpIcon icon="Error" />
		{{ t('userComment.discussionClosed') }}
	</div>
</template>
<script setup>
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publication: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentsNotificationNotLatest', props.styles);

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>
