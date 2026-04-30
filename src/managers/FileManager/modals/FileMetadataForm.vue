<template>
	<div ref="rootEl">
		<PkpForm
			v-if="form && form.id"
			ref="pkpFormRef"
			v-bind="form"
			@set="set"
			@success="onSuccess"
			@cancel="onCancel"
		/>
	</div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import {useFileMetadataForm} from './useFileMetadataForm';

const props = defineProps({
	submissionFile: {type: Object, required: true},
	genreCategory: {type: Number, default: 0},
	supportedLocales: {type: Array, required: true},
	primaryLocale: {type: String, required: true},
	stageId: {type: Number, required: true},
	reviewRoundId: {type: Number, default: null},
	showButtons: {type: Boolean, default: false},
	onSaved: {type: Function, default: null},
	onCancelled: {type: Function, default: null},
});

const rootEl = ref(null);
const pkpFormRef = ref(null);

const {form, set} = useFileMetadataForm(props);

function onSuccess(r) {
	// Replay events from the JSON response so the parent grid refreshes when this form is nested in another modal (galley's dependent files)
	if (r && Array.isArray(r.events)) {
		r.events.forEach((e) => $(rootEl.value).trigger(e.name, e.data ?? null));
	}
	props.onSaved?.();
}

function onCancel() {
	props.onCancelled?.();
}

onMounted(() => {
	// Bridge the legacy wizard's Continue button to PkpForm's submit.
	const $container = $(rootEl.value).closest(
		'[data-submission-file-metadata-wrapper]',
	);
	if (!$container.length) return;

	$container.on('wizardAdvanceRequested.submissionFileMetadata', (event) => {
		event.preventDefault();
		pkpFormRef.value?.submit();
	});
	$container.trigger('formValid');
});

onBeforeUnmount(() => {
	const $container = $(rootEl.value).closest(
		'[data-submission-file-metadata-wrapper]',
	);
	if ($container.length) {
		$container.off('.submissionFileMetadata');
	}
});
</script>
