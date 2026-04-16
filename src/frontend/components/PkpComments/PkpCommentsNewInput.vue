<template>
	<PkpTextarea
		:class="cn('root')"
		:placeholder="t('userComment.addYourComment')"
		:label="t('userComment.addYourComment')"
		:is-label-sr-only="true"
		:model-value="commentsStore.commentText"
		@update:model-value="commentsStore.updateCommentText($event)"
	/>
</template>
<script setup>
import PkpTextarea from '@/frontend/components/PkpTextarea/PkpTextarea.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentsNewInput', props.styles);

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>
