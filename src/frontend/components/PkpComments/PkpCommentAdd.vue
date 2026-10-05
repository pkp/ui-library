<template>
	<form :class="cn('root')">
		<fieldset :class="cn('fields')">
			<legend :class="cn('fields-title')">
				{{ t('userComment.addComment') }}
			</legend>
			<PkpTextarea
				:class="cn('comment')"
				:placeholder="t('userComment.addComment.prompt')"
				:label="t('userComment.addComment.desc')"
				:model-value="commentsStore.commentText"
				@update:model-value="commentsStore.updateCommentText($event)"
			/>
		</fieldset>
		<div :class="cn('buttons')">
			<PkpButton
				:class="cn('submit')"
				:is-disabled="
					!commentsStore.commentText.trim() || commentsStore.isCommentSubmitting
				"
				@click="commentsStore.addComment()"
			>
				{{ t('userComment.addComment.submit') }}
			</PkpButton>
			<div v-if="commentsStore.isCommentSubmitting" :class="cn('submitting')">
				<PkpSpinner :class="cn('spinner')" />
				{{ t('common.sending') }}
			</div>
		</div>
	</form>
</template>

<script setup>
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpTextarea from '../PkpTextarea/PkpTextarea.vue';
import PkpButton from '../PkpButton/PkpButton.vue';
import PkpSpinner from '../PkpSpinner/PkpSpinner.vue';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentAdd', props.styles);

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>
