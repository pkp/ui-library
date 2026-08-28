<template>
	<div>
		<div class="flex items-start justify-between gap-x-4">
			<div class="flex-grow">
				<FormGroupHeader
					:group-id="headerId"
					:label="reviewAssignment.reviewerFullName"
				/>
				<p class="text-lg-normal text-secondary">{{ detailsDescription }}</p>
				<FormDisplayItemBasic
					v-if="competingInterestsText"
					:heading="t('reviewer.submission.competingInterests')"
					:heading-element="'h2'"
					:html-value="competingInterestsText"
					class="mt-2"
				></FormDisplayItemBasic>
			</div>
			<div class="flex-shrink-0">
				<DropdownActions
					:actions="exportOptions"
					:label="t('editor.review.download')"
					@action="(name) => emit('download', name)"
				/>
			</div>
		</div>

		<div
			v-if="!isLoadingReview && (latestActivity || showRecommendation)"
			class="mt-6 flex flex-col gap-y-4"
		>
			<Notification v-if="latestActivity">
				<div class="flex flex-wrap items-baseline gap-x-1 text-lg-normal">
					<h2 class="text-lg-bold">
						{{ t('semicolon', {label: latestActivity.heading}) }}
					</h2>
					<span>{{ latestActivity.value }}</span>
				</div>
			</Notification>
			<Notification v-if="showRecommendation">
				<div class="flex flex-wrap items-baseline gap-x-1 text-lg-normal">
					<h2 class="text-lg-bold">
						{{ t('semicolon', {label: recommendationHeading}) }}
					</h2>
					<span>{{ recommendationLabel }}</span>
				</div>
			</Notification>
		</div>
	</div>
</template>

<script setup>
import {computed, useId} from 'vue';
import {t} from '@/utils/i18n';
import {useDate} from '@/composables/useDate';

import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';
import FormDisplayItemBasic from '@/components/Form/display/FormDisplayItemBasic.vue';
import Notification from '@/components/Notification/Notification.vue';

const props = defineProps({
	reviewAssignment: {
		type: Object,
		required: true,
	},
	recommendationLabel: {
		type: String,
		default: () => null,
	},
	inDisplayMode: {
		type: Boolean,
		default: () => false,
	},
	isLoadingReview: {
		type: Boolean,
		default: () => false,
	},
});

const emit = defineEmits(['download']);

const {formatShortDateTime} = useDate();

const headerId = useId();

const detailsDescription = props.inDisplayMode
	? t('editor.review.readConfirmation')
	: t('editor.review.modifyReview.description');

const recommendationHeading = props.inDisplayMode
	? t('reviewer.article.recommendation')
	: t('editor.review.submittedRecommendation');

const competingInterestsText = computed(() => {
	if (!props.reviewAssignment.competingInterestsDeclared) {
		return null;
	}

	return (
		props.reviewAssignment.competingInterests ||
		t('reviewer.submission.competingInterests.declaredNone')
	);
});

const latestActivity = computed(() => {
	const {reviewAssignment} = props;

	const latest = [
		{
			heading: t('editor.review.reviewSubmitted'),
			date: reviewAssignment.dateCompleted,
		},
		{heading: t('common.confirmed'), date: reviewAssignment.dateConfirmed},
		{heading: t('common.reminded'), date: reviewAssignment.dateReminded},
		{heading: t('common.notified'), date: reviewAssignment.dateNotified},
		{heading: t('common.assigned'), date: reviewAssignment.dateAssigned},
	].find(({date}) => date);

	return (
		latest && {
			heading: latest.heading,
			value: formatShortDateTime(latest.date),
		}
	);
});

const showRecommendation = computed(
	() =>
		!!props.reviewAssignment.dateCompleted &&
		!!props.reviewAssignment.reviewerRecommendationId &&
		!!props.recommendationLabel,
);

const exportOptions = [
	{
		label: `${t('editor.review.authorOnly')} (PDF)`,
		name: 'authorPdf',
	},
	{
		label: `${t('editor.review.authorOnly')} (XML)`,
		name: 'authorXml',
	},
	{
		label: `${t('editor.review.allSections')} (PDF)`,
		name: 'editorPdf',
	},
	{
		label: `${t('editor.review.allSections')} (XML)`,
		name: 'editorXml',
	},
];
</script>
