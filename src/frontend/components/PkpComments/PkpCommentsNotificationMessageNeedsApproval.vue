<template>
	<div
		v-if="
			commentsStore.getCurrentUser() &&
			message.userId === commentsStore.getCurrentUser().id &&
			!message.isApproved
		"
		:class="cn('root')"
	>
		<PkpIcon icon="Help" />
		{{ t('userComment.awaitingApprovalNotice') }}
	</div>
</template>
<script setup>
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	message: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles(
	'PkpCommentsNotificationMessageNeedsApproval',
	props.styles,
);

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>
