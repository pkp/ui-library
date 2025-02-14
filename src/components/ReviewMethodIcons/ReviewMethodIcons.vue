<template>
	<span>
		<PkpPopover size-variant="content">
			<template #button>
				<span class="flex gap-x-1">
					<Icon
						v-for="icon in icons"
						:key="icon"
						:class="iconSize"
						:icon="icon"
						aria-hidden="true"
					/>
					<span class="sr-only">{{ label }}</span>
				</span>
			</template>
			<span class="text-base-normal uppercase text-default">{{ label }}</span>
		</PkpPopover>
	</span>
</template>
<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpPopover from '@/components/Popover/Popover.vue';

import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	reviewMethod: {type: Number, required: true},
	sizeVariants: {
		required: false,
		type: String,
		default: () => 'default',
		validator: (prop) => ['default', 'large'].includes(prop),
	},
});

const {t} = useLocalize();

const icons = computed(() => {
	switch (props.reviewMethod) {
		case pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS:
			return ['OpenReview', 'AnonymousReview'];
		case pkp.const.SUBMISSION_REVIEW_METHOD_DOUBLEANONYMOUS:
			return ['AnonymousReview', 'AnonymousReview'];
		case pkp.const.SUBMISSION_REVIEW_METHOD_OPEN:
			return ['OpenReview', 'OpenReview'];
	}

	return ['OpenReview', 'OpenReview'];
});

const label = computed(() => {
	switch (props.reviewMethod) {
		case pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS:
			return t('editor.submissionReview.anonymous');
		case pkp.const.SUBMISSION_REVIEW_METHOD_DOUBLEANONYMOUS:
			return t('editor.submissionReview.doubleAnonymous');
		case pkp.const.SUBMISSION_REVIEW_METHOD_OPEN:
			return t('editor.submissionReview.open');
	}

	return t('editor.submissionReview.open');
});

const iconSize = computed(() => {
	if (props.sizeVariants === 'large') {
		return 'h-6 w-6';
	}

	return 'h-5 w-5';
});
</script>
