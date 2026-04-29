<template>
	<SideModalBody>
		<template #title>{{ t('common.insertContent') }}</template>
		<template #default="{closeModal}">
			<SideModalLayoutBasic>
				<div v-if="isLoading" class="text-base-normal text-secondary">
					{{ t('common.loading') }}
				</div>
				<div v-else-if="!items.length" class="text-base-normal text-secondary">
					{{ t('publication.insertContent.empty') }}
				</div>
				<InsertContent
					v-else
					:items="items"
					:insert-label="t('common.insert')"
					:items-label="t('common.insertContent')"
					:search-label="t('common.insertContentSearch')"
					@insert="(value) => insert(value, closeModal)"
				/>
			</SideModalLayoutBasic>
		</template>
	</SideModalBody>
</template>

<script setup>
import {computed, onMounted} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import InsertContent from '@/components/InsertContent/InsertContent.vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import {useApp} from '@/composables/useApp';
import {ExtendedStagesLabels} from '@/composables/useSubmission';

const props = defineProps({
	submissionId: {type: Number, required: true},
	reviewRounds: {type: Array, default: () => []},
	currentLocale: {type: String, required: true},
	onInsert: {type: Function, required: true},
});

const {t, localize} = useLocalize();
const {formatShortDate} = useDate();
const {isOMP} = useApp();

function htmlToPlainText(html) {
	const div = document.createElement('div');
	div.innerHTML = html || '';
	return (div.textContent || '').trim();
}

const fileStages = [pkp.const.SUBMISSION_FILE_REVIEW_REVISION];
if (isOMP()) {
	fileStages.push(pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_REVISION);
}
const {apiUrl} = useUrl(`submissions/${props.submissionId}/files`, {
	fileStages: fileStages.join(','),
});
const {data, fetch, isLoading} = useFetch(apiUrl);

onMounted(() => fetch());

const reviewRoundsById = computed(() =>
	Object.fromEntries(props.reviewRounds.map((r) => [r.id, r])),
);

function reviewRoundLabel(round) {
	const labelKey =
		round.stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
			? ExtendedStagesLabels.internalReview
			: ExtendedStagesLabels.externalReview;
	return t(labelKey, {round: round.round});
}

const items = computed(() => {
	const files = data.value?.items ?? [];
	return files
		.map((file) => {
			// Keep the full multilingual object so inserts can fan out to every locale.
			const summaryByLocale = file.summaryOfChanges ?? {};
			const currentValue = summaryByLocale[props.currentLocale] || '';
			// Review revision files have assocId === reviewRoundId.
			const round = reviewRoundsById.value[file.assocId];
			const parts = [
				round ? reviewRoundLabel(round) : '',
				formatShortDate(file.createdAt),
				localize(file.name),
			];
			return {
				key: file.id,
				value: htmlToPlainText(currentValue),
				description: parts.filter(Boolean).join(' \u2022 '),
				summaryByLocale,
			};
		})
		.filter((e) => !!e.value);
});

function insert(plainValue, closeModal) {
	// InsertContent emits the displayed plain-text value; map it back to the
	// item to recover the full multilingual object (which preserves HTML).
	const item = items.value.find((i) => i.value === plainValue);
	props.onInsert(item?.summaryByLocale ?? {});
	closeModal();
}
</script>
