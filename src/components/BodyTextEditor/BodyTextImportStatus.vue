<template>
	<div
		v-if="isImporting || error || warnings.length > 0"
		role="status"
		aria-live="polite"
		class="my-4 flex w-full items-center gap-4 rounded border p-4"
		:class="error ? 'border-negative' : 'border-light'"
	>
		<Spinner v-if="isImporting" size-variant="big" />

		<div class="flex flex-grow flex-col gap-1">
			<p
				class="text-lg-medium"
				:class="error ? 'text-negative' : 'text-heading'"
			>
				{{ title }}
			</p>
			<p class="text-base-normal text-secondary">
				{{ description }}
			</p>
			<ul
				v-if="!isImporting && warnings.length > 0"
				class="list-disc ps-5 text-base-normal text-secondary"
			>
				<li v-for="(warning, index) in warnings" :key="index">
					{{ warning }}
				</li>
			</ul>
		</div>

		<PkpButton v-if="!isImporting" @click="emit('dismiss')">
			{{ t('common.dismiss') }}
		</PkpButton>
	</div>
</template>

<script setup>
/**
 * Status box for the body-text document import: a spinner with the current
 * stage while it runs, "Import failed" with the cause, or "Imported with
 * warnings" with the list of things that need the user's attention.
 * Renders nothing when idle without error or warnings.
 */
import {computed} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	/** 'download' | 'load' | 'convert' | 'upload' while importing, null when idle. */
	stage: {type: String, default: null},
	/** Message of the failure that aborted the import, '' when none. */
	error: {type: String, default: ''},
	/** Human-readable warnings from a finished import. */
	warnings: {type: Array, default: () => []},
});

const emit = defineEmits(['dismiss']);

const {t, tk} = useLocalize();

const STAGE_LABELS = {
	download: tk('publication.bodyText.import.downloading'),
	load: tk('publication.bodyText.import.loadingConverter'),
	convert: tk('publication.bodyText.import.converting'),
	upload: tk('publication.bodyText.import.uploadingImages'),
};

const isImporting = computed(() => props.stage !== null);

const title = computed(() => {
	if (props.error) return t('publication.bodyText.import.failed');
	if (isImporting.value) return t('publication.bodyText.import.importing');
	return t('publication.bodyText.import.importedWithWarnings');
});

const description = computed(() => {
	if (props.error) return props.error;
	if (isImporting.value) {
		const label = STAGE_LABELS[props.stage];
		return label ? t(label) : '';
	}
	return t('publication.bodyText.import.warnings', {
		count: props.warnings.length,
	});
});
</script>
