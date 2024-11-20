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
								:user-full-name="reviewerSuggestion.fullName"
							></UserAvatar>
						</div>
						<div class="ms-2 flex flex-col justify-center">
							<div class="text-base-bold">
								{{ reviewerSuggestion.fullName }}
							</div>
							<div class="text-sm-normal text-secondary">
								{{ reviewerSuggestion.affiliation }}
							</div>
							<!-- TODO: check alternative of v-html as v-strip-unsafe-html not working -->
							<div
								class="text-sm-normal text-secondary"
								v-html="reviewerSuggestion.suggestionReason"
							></div>
						</div>
					</div>
					<div v-if="reviewerSuggestionManagerStore.hasActiveReviewStage">
						<DropdownActions
							:actions="reviewerSuggestionManagerStore.itemActions"
							:label="`${reviewerSuggestion.fullName} ${t('common.moreActions')}`"
							:display-as-ellipsis="true"
							@action="
								(actionName) =>
									reviewerSuggestionManagerStore[actionName]({
										reviewerSuggestion: reviewerSuggestion,
										stageAssignmen,
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
	submission: {type: Object, required: true},
	submissionStageId: {type: String, required: true},
	reviewRoundId: {type: Number, required: false},
});

const reviewerSuggestionManagerStore = useReviewerSuggestionManagerStore(props);

const {t} = useLocalize();
</script>
