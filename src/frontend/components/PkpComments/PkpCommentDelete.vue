<template>
	<div :class="cn('root')">
		<div v-if="!isOpen" :class="cn('prompt')">
			<svg
				:class="cn('prompt-icon')"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7.30775 20.5002C6.80908 20.5002 6.38308 20.3236 6.02975 19.9705C5.67658 19.6171 5.5 19.1911 5.5 18.6925V6.00022H4.5V4.50022H9V3.61572H15V4.50022H19.5V6.00022H18.5V18.6925C18.5 19.1976 18.325 19.6252 17.975 19.9752C17.625 20.3252 17.1974 20.5002 16.6923 20.5002H7.30775ZM17 6.00022H7V18.6925C7 18.7823 7.02883 18.8561 7.0865 18.9137C7.14417 18.9714 7.21792 19.0002 7.30775 19.0002H16.6923C16.7692 19.0002 16.8398 18.9681 16.9038 18.904C16.9679 18.84 17 18.7695 17 18.6925V6.00022ZM9.404 17.0002H10.9037V8.00022H9.404V17.0002ZM13.0962 17.0002H14.596V8.00022H13.0962V17.0002Z"
					fill="currentColor"
				/>
			</svg>
			<PkpButtonInPhrase :class="cn('prompt-text')" :click-handlers="[toggle]">
				<span v-html="t('userComment.deleteButton')" />
			</PkpButtonInPhrase>
		</div>
		<div v-else :class="cn('confirm')">
			<div :class="cn('confirm-text')">
				{{ t('userComment.deleteCommentConfirmation') }}
			</div>
			<div :class="cn('buttons')">
				<PkpButton :class="cn('submit')" @click="deleteComment">
					{{ t('userComment.deleteComment') }}
				</PkpButton>
				<PkpButton :class="cn('cancel')" @click="toggle">
					{{ t('common.cancel') }}
				</PkpButton>
				<div v-if="isSubmitting" :class="cn('submitting')">
					<PkpSpinner :class="cn('spinner')" />
					{{ t('common.deleting') }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpButtonInPhrase from '../PkpButtonInPhrase/PkpButtonInPhrase.vue';
import {ref} from 'vue';
import PkpButton from '../PkpButton/PkpButton.vue';
import PkpSpinner from '../PkpSpinner/PkpSpinner.vue';

const props = defineProps({
	comment: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentDelete', props.styles);

const store = usePkpCommentsStore();

const {t} = usePkpLocalize();

const isOpen = ref(false);
const isSubmitting = ref(false);

const toggle = () => (isOpen.value = !isOpen.value);

const deleteComment = () => {
	isSubmitting.value = true;
	store.deleteComment(props.comment).finally(() => {
		setTimeout(() => {
			isSubmitting.value = false;
		}, 1000);
	});
};
</script>
