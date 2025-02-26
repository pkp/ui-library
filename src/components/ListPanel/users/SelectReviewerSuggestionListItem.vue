<template>
	<div class="listPanel__item--reviewer">
		<div class="listPanel__itemSummary">
			<div class="listPanel__itemIdentity">
				<div class="listPanel__itemTitle">
					{{ localize(item.fullName) }}
				</div>

				<div class="listPanel__itemSubtitle">
					<div class="listPanel__item--reviewer__affiliation">
						{{ localize(item.affiliation) }}
					</div>
					<div
						v-strip-unsafe-html="localize(item.suggestionReason)"
						class="reviewer_sugestion_reason_container"
					></div>
				</div>

				<div v-if="currentlyAssigned" class="listPanel__item--reviewer__notice">
					<Icon icon="Error" class="me-1 h-4 w-4" :inline="true" />
					<span class="align-middle">{{ currentlyAssignedLabel }}</span>
				</div>
			</div>

			<div class="listPanel__itemActions">
				<PkpButton v-if="canSelect" @click="select">
					<span aria-hidden="true">{{ selectReviewerLabel }}</span>
					<span class="-screenReader">
						{{ t('common.selectWithName', {name: fullName}) }}
					</span>
				</PkpButton>
			</div>
		</div>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useLocalize} from '@/composables/useLocalize';

export default {
	components: {
		PkpButton,
		Icon,
	},
	mixins: [ajaxError, dialog],
	props: {
		item: {
			type: Object,
			required: true,
		},
		submissionId: {
			type: Number,
			required: true,
		},
		stageId: {
			type: Number,
			required: true,
		},
		reviewRoundId: {
			type: Number,
			required: true,
		},
		selectReviewerLabel: {
			type: String,
			required: true,
		},
		currentlyAssigned: {
			type: Boolean,
			required: true,
		},
		currentlyAssignedLabel: {
			type: String,
			required: true,
		},
	},
	emits: ['update:suggestions'],
	data() {
		return {};
	},
	computed: {
		/**
		 * Can this reviewer be selected
		 *
		 * Checks for current assignment and a locked assignment warning.
		 * Use this instead of the canSelect prop.
		 *
		 * @return {Boolean}
		 */
		canSelect() {
			if (this.currentlyAssigned) {
				return false;
			}

			if (this.approvedAt === null || this.approvedAt === undefined) {
				return true;
			}

			return false;
		},
	},
	methods: {
		/**
		 * Emit an event to select a reviewer
		 *
		 * @param
		 */
		select() {
			if (this.item.existingUserId && this.item.existingReviewerRole) {
				pkp.eventBus.$emit('selected:reviewer', {
					id: this.item.existingUserId,
					fullName: this.localize(this.item.fullName),
				});
				return;
			}

			const {t} = useLocalize();

			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'showReviewerForm',
				params: {
					submissionId: this.submissionId,
					stageId: this.stageId,
					reviewRoundId: this.reviewRoundId,
					selectionType: this.item.existingUserId
						? this.item.existingReviewerRole
							? pkp.const.REVIEWER_SELECT_ADVANCED_SEARCH
							: pkp.const.REVIEWER_SELECT_ENROLL_EXISTING
						: pkp.const.REVIEWER_SELECT_CREATE,
					reviewerSuggestionId: this.item.id,
				},
			});

			openLegacyModal({title: t('editor.submission.addReviewer')}, () =>
				this.$emit('update:suggestions', this.item.id),
			);
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.reviewer_sugestion_reason_container {
	white-space: normal;
	margin-right: 4rem;
	text-align: justify;
}
</style>
