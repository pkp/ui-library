<template>
	<div :class="cn('root')">
		<div v-if="hasReported" :class="cn('submitted')">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M9.55032 17.6538L4.21582 12.3193L5.28482 11.2501L9.55032 15.5156L18.7158 6.3501L19.7848 7.41935L9.55032 17.6538Z"
					fill="currentColor"
				/>
			</svg>
			{{ t('userComment.reportSubmitted') }}
		</div>
		<template v-else>
			<div v-if="!isOpen" :class="cn('prompt')">
				<svg
					:class="cn('report-icon')"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M1.86523 20.5L11.9997 3L22.1342 20.5H1.86523ZM4.44973 19H19.5497L11.9997 6L4.44973 19ZM12.5727 17.573C12.7292 17.4167 12.8075 17.2257 12.8075 17C12.8075 16.7743 12.7292 16.5833 12.5727 16.427C12.4164 16.2705 12.2254 16.1923 11.9997 16.1923C11.7741 16.1923 11.5831 16.2705 11.4267 16.427C11.2702 16.5833 11.192 16.7743 11.192 17C11.192 17.2257 11.2702 17.4167 11.4267 17.573C11.5831 17.7295 11.7741 17.8077 11.9997 17.8077C12.2254 17.8077 12.4164 17.7295 12.5727 17.573ZM11.2497 15.1923H12.7497V10.1923H11.2497V15.1923Z"
						fill="currentColor"
					/>
				</svg>
				<PkpButtonInPhrase
					:class="cn('prompt-text')"
					:click-handlers="[toggle]"
				>
					<span v-html="t('userComment.reportButton')" />
				</PkpButtonInPhrase>
			</div>
			<form v-else :class="cn('form')">
				<PkpTextarea
					v-model="reason"
					:class="cn('reason')"
					:placeholder="t('userComment.report.reason')"
					:label="label"
				/>
				<div :class="cn('buttons')">
					<PkpButton :class="cn('submit')" @click.stop.prevent="send">
						{{ t('userComment.reportComment') }}
					</PkpButton>
					<PkpButton :class="cn('cancel')" @click="toggle">
						{{ t('common.cancel') }}
					</PkpButton>
					<div v-if="isSubmitting" :class="cn('submitting')">
						<PkpSpinner :class="cn('spinner')" />
						{{ t('common.sending') }}
					</div>
				</div>
			</form>
		</template>
	</div>
</template>

<script setup>
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpButtonInPhrase from '../PkpButtonInPhrase/PkpButtonInPhrase.vue';
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

const isOpen = ref(false);
const isSubmitting = ref(false);
const hasReported = ref(false);
const reason = defineModel('', {type: String});

const toggle = () => (isOpen.value = !isOpen.value);

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
</script>
