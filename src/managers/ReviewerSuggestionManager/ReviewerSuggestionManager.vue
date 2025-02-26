<template>
	<div
		v-if="reviewerSuggestionManagerStore.reviewerSuggestionsList.length > 0"
		class="border border-light"
		data-cy="reviewer-sguuestion-manager"
	>
		<div class="flex items-center justify-between bg-default p-5">
			<h3 class="text-2xl-bold uppercase text-heading">
				{{ t('editor.submission.reviewerSuggestions') }}
			</h3>
		</div>
		<ul class="flex flex-col" role="list">
			<li
				v-for="reviewerSuggestion in reviewerSuggestionManagerStore.reviewerSuggestionsList"
				:key="reviewerSuggestion.id"
				class="border-t border-light p-4 text-base-normal even:bg-tertiary"
			>
				<div class="flex items-center justify-between">
					<div class="flex">
						<div>
							<UserAvatar
								:user-id="reviewerSuggestion.id"
								:initials="reviewerSuggestion.displayInitial"
							></UserAvatar>
						</div>
						<div class="ms-2 flex flex-col justify-center">
							<div class="text-base-bold">
								{{ reviewerSuggestion.fullName }}
							</div>
							<div class="text-sm-normal text-secondary">
								{{ reviewerSuggestion.affiliation }}
							</div>
							<div
								v-strip-unsafe-html="reviewerSuggestion.suggestionReason"
								class="text-sm-normal text-secondary"
							></div>
						</div>
					</div>
					<div v-if="reviewerSuggestionManagerStore.atActiveReviewStage()">
						<DropdownActions
							:actions="reviewerSuggestionManagerStore.itemActions"
							:label="`${reviewerSuggestion.fullName} ${t('common.moreActions')}`"
							button-variant="ellipsis"
							@action="
								(actionName) =>
									reviewerSuggestionManagerStore[actionName]({
										reviewerSuggestion: reviewerSuggestion,
										stageAssignment,
									})
							"
						/>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useReviewerSuggestionManagerStore} from './reviewerSuggestionManagerStore';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const props = defineProps({
	submission: {
		type: Object,
		required: true,
	},
	submissionStageId: {
		type: Number,
		required: true,
	},
	reviewRoundId: {
		type: Number,
		required: false,
		default: null,
	},
});

const reviewerSuggestionManagerStore = useReviewerSuggestionManagerStore(props);

const {t} = useLocalize();
</script>
