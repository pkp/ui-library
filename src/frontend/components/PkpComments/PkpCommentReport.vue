<template>
	<div :class="cn('root')">
		<div v-if="hasReported" :class="cn('submitted')">
			<div :class="cn('submitted-message')">
				{{ t('userComment.reportSubmitted') }}
			</div>
			<div :class="cn('buttons')">
				<PkpButton :class="cn('cancel')" @click="closeDialog">
					{{ t('common.close') }}
				</PkpButton>
			</div>
		</div>
		<form v-else :class="cn('form')">
			<PkpTextarea
				v-model="reason"
				:class="cn('reason')"
				:placeholder="t('userComment.report.reason')"
				:label="label"
			/>
			<div :class="cn('buttons')">
				<div v-if="isSubmitting" :class="cn('submitting')">
					{{ t('common.sending') }}
					<PkpSpinner :class="cn('spinner')" />
				</div>
				<PkpButton
					:class="cn('submit')"
					:is-disabled="isDisabled"
					@click.stop.prevent="send"
				>
					{{ t('userComment.sendReport') }}
				</PkpButton>
				<PkpButton
					:class="cn('cancel')"
					:is-disabled="isSubmitting"
					@click.stop.prevent="closeDialog"
				>
					{{ t('common.cancel') }}
				</PkpButton>
			</div>
		</form>
	</div>
</template>

<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {computed, ref} from 'vue';
import PkpButton from '../PkpButton/PkpButton.vue';
import PkpTextarea from '../PkpTextarea/PkpTextarea.vue';
import PkpSpinner from '../PkpSpinner/PkpSpinner.vue';

const props = defineProps({
	comment: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentReport', props.styles);

const store = usePkpCommentsStore();

const {t} = usePkpLocalize();

const isSubmitting = ref(false);
const hasReported = ref(false);
const reason = defineModel('', {type: String});

const closeDialog = inject('closeDialog');

const send = () => {
	isSubmitting.value = true;
	store
		.reportComment(props.comment, reason.value)
		.then((isSuccess) => {
			if (isSuccess) {
				reason.value = '';
				hasReported.value = true;
			}
		})
		.finally(() => {
			isSubmitting.value = false;
		});
};

const label = computed(() => {
	return props.comment.userAffiliation
		? t('userComment.reportCommentByUserWithAffiliation', {
				name: props.comment.userName,
				affiliation: props.comment.userAffiliation,
			})
		: t('userComment.reportCommentBy', {
				name: props.comment.userName,
			});
});

const isDisabled = computed(() => {
	return isSubmitting.value || !reason?.value?.trim()?.length;
});
</script>
