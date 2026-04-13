<template>
	<PkpButton is-link @click="openGuidelinesDialog">
		{{ t('reviewer.submission.guidelines') }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';

const {t} = useLocalize();
const {openDialog} = useModal();

const props = defineProps({
	guidelines: {
		type: String,
		required: true,
	},
});

function openGuidelinesDialog() {
	openDialog({
		title: t('reviewer.submission.guidelines'),
		message: props.guidelines,
		actions: [
			{
				label: t('common.ok'),
				callback: (close) => close(),
			},
		],
	});
}
</script>
