<template>
	<div class="listPanel__item--reviewer">
		<div class="listPanel__itemSummary">
			<div class="listPanel__itemIdentity">
				<div class="listPanel__itemTitle">
					<!-- TODO: check why localize(fullName) causing error -->
					{{ fullName }}
					<Badge class="listPanel__item--reviewer__active">
						{{ affiliation }}
					</Badge>
				</div>

				<div class="listPanel__itemSubtitle">
					<div class="listPanel__item--reviewer__affiliation">
						<!-- TODO: how to show without v-html -->
						{{ suggestionReason }}
					</div>
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
import Badge from '@/components/Badge/Badge.vue';
import PkpButton from '@/components/Button/Button.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useLocalize} from '@/composables/useLocalize';

export default {
	components: {
		Badge,
		PkpButton,
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
	},
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
			if (this.approvedAt === null || this.approvedAt === undefined) {
				return true;
			}

			return false;
		},

		fullName() {
			return this.localize(this.item.fullName);
		},

		affiliation() {
			return this.localize(this.item.affiliation);
		},

		suggestionReason() {
			return this.localize(this.item.suggestionReason);
		},
	},
	methods: {
		/**
		 * Emit an event to select a reviewer
		 *
		 * @param
		 */
		select() {
			const {t} = useLocalize();

			// this.$emit('select', this.item);
			// pkp.eventBus.$emit('selected:reviewerSuggestion', this.item);

			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'showReviewerForm',
				params: {
					submissionId: this.submissionId,
					stageId: this.stageId,
					reviewRoundId: this.reviewRoundId,
					selectionType: pkp.const.REVIEWER_SELECT_CREATE,
					reviewerSuggestionId: this.item.id,
				},
			});

			openLegacyModal(
				{title: t('editor.submission.addReviewer')},
				function () {},
			);
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.listPanel__item--reviewer__active {
	margin-inline-end: 0.25rem;
	font-weight: @normal;
}

// Reviewer locked or already assigned
.listPanel__item--reviewer__notice {
	font-size: @font-tiny;
}

// Make the button look like a link
.listPanel__item--reviewer__noticeAction {
	border: none;
	padding: 0;
	background: transparent;
	color: @primary;
	text-decoration: underline;
	cursor: pointer;

	&:hover,
	&:focus {
		color: @primary-lift;
	}
}
</style>
