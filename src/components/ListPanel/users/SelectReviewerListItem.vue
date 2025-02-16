<template>
	<div
		class="listPanel__item--reviewer"
		:class="currentlyAssigned ? '-isAssigned' : ''"
	>
		<div class="listPanel__itemSummary">
			<div class="listPanel__itemIdentity">
				<div class="listPanel__itemTitle">
					<Badge
						v-if="item.reviewsActive && canSelect"
						class="listPanel__item--reviewer__active"
					>
						{{
							activeReviewsCountLabel.replace('{$count}', item.reviewsActive)
						}}
					</Badge>
					{{ item.fullName }}
					<span
						v-if="item.reviewerRating !== null && canSelect"
						class="listPanel__item--reviewer__rating"
					>
						<Icon
							v-for="(star, index) in stars"
							:key="index"
							:icon="star ? 'StarTicked' : 'Star'"
							class="h-4 w-4 text-stage-in-review"
						/>
						<span class="-screenReader">
							{{
								reviewerRatingLabel.replace('{$rating}', item.reviewerRating)
							}}
						</span>
					</span>
				</div>

				<div class="listPanel__itemSubtitle">
					<div
						v-if="item.affiliation || item.orcid"
						class="listPanel__item--reviewer__affiliation"
					>
						{{ localize(item.affiliation) }}
						<a
							v-if="item.orcid"
							:href="item.orcid"
							class="listPanel__item--reviewer__orcid"
							target="_blank"
						>
							<Icon
								:icon="item.orcidIsVerified ? 'Orcid' : 'OrcidUnauthenticated'"
								:inline="true"
								class="me-1 w-6"
							/>
							{{ item.orcidDisplayValue }}
						</a>
					</div>
				</div>

				<div v-if="currentlyAssigned" class="listPanel__item--reviewer__notice">
					<Icon icon="Error" class="me-1 h-4 w-4" :inline="true" />
					<span class="align-middle">{{ currentlyAssignedLabel }}</span>
				</div>
				<div
					v-else-if="assignedToLastRound"
					class="listPanel__item--reviewer__notice"
				>
					<Icon icon="Pin" class="me-1 h-3 w-3" :inline="true" />
					<span class="align-middle">{{ assignedToLastRoundLabel }}</span>
				</div>
				<div
					v-else-if="warnOnAssignment && !isWarningBypassed"
					class="listPanel__item--reviewer__notice space-x-1"
				>
					<Icon icon="Lock" class="me-1 h-3 w-3" :inline="true" />
					<span class="align-middle">{{ warnOnAssignmentLabel }}</span>
					<button
						class="listPanel__item--reviewer__noticeAction"
						@click.prevent="unlockAssignment"
					>
						{{ warnOnAssignmentUnlockLabel }}
					</button>
				</div>

				<!-- use aria-hidden on these details because the information can be
					more easily acquired by screen readers from the details panel. -->
				<div
					v-else-if="canSelect"
					class="listPanel__item--reviewer__brief"
					aria-hidden="true"
				>
					<span class="listPanel__item--reviewer__complete">
						<Icon icon="Complete" class="h-4 w-4 text-default" :inline="true" />
						<span class="align-middle">{{ item.reviewsCompleted }}</span>
					</span>
					<span class="listPanel__item--reviewer__last">
						<Icon icon="History" class="h-4 w-4 text-default" :inline="true" />
						<span class="align-middle">
							{{ daysSinceLastAssignmentLabelCompiled }}
						</span>
					</span>
					<span
						v-if="item.interests.length"
						class="listPanel__item--reviewer__interests"
					>
						<Icon icon="Book" class="h-4 w-4 text-default" :inline="true" />
						<span class="align-middle">{{ interestsString }}</span>
					</span>
					<span
						v-if="affiliationMatch(item.affiliation)"
						class="pkpBadge pkp_helpers_text_warn"
					>
						{{ reviewerSameInstitutionLabel }}
					</span>
				</div>
			</div>

			<div class="listPanel__itemActions">
				<PkpButton v-if="canSelect" @click="select">
					<template v-if="assignedToLastRound">
						<span aria-hidden="true">{{ reassignLabel }}</span>
						<span class="-screenReader">
							{{ reassignWithName }}
						</span>
					</template>
					<template v-else>
						<span aria-hidden="true">{{ selectReviewerLabel }}</span>
						<span class="-screenReader">
							{{ t('common.selectWithName', {name: item.fullName}) }}
						</span>
					</template>
				</PkpButton>
				<Expander
					:is-expanded="isExpanded"
					:item-name="item.fullName"
					@toggle="isExpanded = !isExpanded"
				/>
			</div>
		</div>
		<div
			v-if="isExpanded"
			class="listPanel__itemExpanded listPanel__itemExpanded--reviewer"
		>
			<List>
				<ListItem>
					<template #value>
						<Icon
							icon="Clock"
							class="me-1 h-4 w-4 text-default"
							:inline="true"
						/>
						{{ item.reviewsActive }}
					</template>
					{{ activeReviewsLabel }}
				</ListItem>
				<ListItem>
					<template #value>
						<Icon
							icon="Complete"
							class="me-1 h-4 w-4 text-default"
							:inline="true"
						/>
						{{ item.reviewsCompleted }}
					</template>
					{{ completedReviewsLabel }}
				</ListItem>
				<ListItem>
					<template #value>
						<Icon
							icon="Cancel"
							class="me-1 h-4 w-4 text-default"
							:inline="true"
						/>
						{{ item.reviewsDeclined }}
					</template>
					{{ declinedReviewsLabel }}
				</ListItem>
				<ListItem>
					<template #value>
						<Icon
							icon="Declined"
							class="me-1 h-4 w-4 text-default"
							:inline="true"
						/>
						{{ item.reviewsCancelled }}
					</template>
					{{ cancelledReviewsLabel }}
				</ListItem>
				<ListItem>
					<template #value>
						<Icon
							icon="History"
							class="me-1 h-4 w-4 text-default"
							:inline="true"
						/>
						{{ daysSinceLastAssignment }}
					</template>
					{{ daysSinceLastAssignmentDescriptionLabel }}
				</ListItem>
				<ListItem>
					<template #value>
						<Icon
							icon="Calendar"
							class="me-1 h-4 w-4 text-default"
							:inline="true"
						/>
						{{ item.averageReviewCompletionDays }}
					</template>
					{{ averageCompletionLabel }}
				</ListItem>
				<ListItem v-if="item.interests.length">
					<div class="listPanel__item--reviewer__detailHeading">
						<Icon
							icon="Book"
							class="me-1 h-4 w-4 text-default"
							:inline="true"
						/>
						{{ reviewInterestsLabel }}
					</div>
					{{ interestsString }}
				</ListItem>
				<ListItem v-if="item.gossip">
					<div class="listPanel__item--reviewer__detailHeading">
						{{ gossipLabel }}
					</div>
					<div v-strip-unsafe-html="item.gossip"></div>
				</ListItem>
				<ListItem v-if="localize(item.biography)">
					<div class="listPanel__item--reviewer__detailHeading">
						{{ biographyLabel }}
					</div>
					<div v-strip-unsafe-html="localize(item.biography)"></div>
				</ListItem>
			</List>
		</div>
	</div>
</template>

<script>
import Expander from '@/components/Expander/Expander.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {
		Expander,
		List,
		ListItem,
		Badge,
		PkpButton,
		Icon,
	},
	props: {
		activeReviewsCountLabel: {
			type: String,
			required: true,
		},
		activeReviewsLabel: {
			type: String,
			required: true,
		},
		assignedToLastRound: {
			type: Boolean,
			required: true,
		},
		assignedToLastRoundLabel: {
			type: String,
			required: true,
		},
		authorAffiliations: {
			type: Array,
			default() {
				return [];
			},
		},
		averageCompletionLabel: {
			type: String,
			required: true,
		},
		biographyLabel: {
			type: String,
			required: true,
		},
		cancelledReviewsLabel: {
			type: String,
			required: true,
		},
		completedReviewsLabel: {
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
		daySinceLastAssignmentLabel: {
			type: String,
			required: true,
		},
		daysSinceLastAssignmentLabel: {
			type: String,
			required: true,
		},
		daysSinceLastAssignmentDescriptionLabel: {
			type: String,
			required: true,
		},
		declinedReviewsLabel: {
			type: String,
			required: true,
		},
		gossipLabel: {
			type: String,
			required: true,
		},
		item: {
			type: Object,
			required: true,
		},
		neverAssignedLabel: {
			type: String,
			required: true,
		},
		reassignLabel: {
			type: String,
			required: true,
		},
		reassignWithNameLabel: {
			type: String,
			required: true,
		},
		reviewerSameInstitutionLabel: {
			type: String,
			required: true,
		},
		reviewerRatingLabel: {
			type: String,
			required: true,
		},
		reviewInterestsLabel: {
			type: String,
			required: true,
		},
		selectReviewerLabel: {
			type: String,
			required: true,
		},
		warnOnAssignment: {
			type: Boolean,
			required: true,
		},
		warnOnAssignmentLabel: {
			type: String,
			required: true,
		},
		warnOnAssignmentUnlockLabel: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			isExpanded: false,
			isWarningBypassed: false,
		};
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
			if (this.warnOnAssignment) {
				return this.isWarningBypassed;
			}
			return true;
		},

		/**
		 * How many days has it been since they were last assigned a review
		 *
		 * @return {?Number}
		 */
		daysSinceLastAssignment() {
			if (!this.item.dateLastReviewAssignment) {
				return null;
			}

			// Needed for Safari as it will return NaN for date strings with '-' separators.
			const fixDateForAllBrowsers = (dateString) =>
				dateString.replace(/-/g, '/');

			return Math.floor(
				((Date.parse(
					fixDateForAllBrowsers(this.item.dateLastReviewAssignment),
				) -
					Date.now()) /
					86400000) *
					-1,
			);
		},

		/**
		 * How many days has it been since they were last assigned a review
		 *
		 * @return {String} "X days ago"
		 */
		daysSinceLastAssignmentLabelCompiled() {
			if (this.daysSinceLastAssignment === null) {
				return this.neverAssignedLabel;
			}
			if (this.daysSinceLastAssignment > 1) {
				return this.daysSinceLastAssignmentLabel.replace(
					'{$days}',
					this.daysSinceLastAssignment,
				);
			} else {
				return this.daySinceLastAssignmentLabel;
			}
		},

		/**
		 * A list of interests with the localised separator (usually a comma)
		 *
		 * @return {String}
		 */
		interestsString() {
			if (!this.item.interests || !this.item.interests.length) {
				return '';
			}
			return this.item.interests
				.map((i) => {
					return i.interest;
				})
				.join(this.t('common.commaListSeparator'));
		},

		/**
		 * An accessible label for the button to reassign a user
		 */
		reassignWithName() {
			return this.reassignWithNameLabel.replace('{$name}', this.item.fullName);
		},

		/**
		 * An array of booleans matching the stars for the reviewerRating. True is
		 * a filled-in star. False is an empty star.
		 *
		 * An empty array means no rating has been assigned.
		 *
		 * @return {Array}
		 */
		stars() {
			let stars = [];
			if (this.item.reviewerRating) {
				for (let i = 0; i < 5; i++) {
					stars.push(i < this.item.reviewerRating);
				}
			}
			return stars;
		},
	},
	methods: {
		/**
		 * Emit an event to select a reviewer
		 *
		 * @param
		 */
		select() {
			this.$emit('select', this.item);
			pkp.eventBus.$emit('selected:reviewer', this.item);
		},

		/**
		 * Unlock a locked assignment
		 */
		unlockAssignment() {
			this.isWarningBypassed = true;
		},

		/**
		 *
		 * @param affiliation
		 * @returns {boolean}
		 */
		affiliationMatch(affiliation) {
			return this.authorAffiliations.some(
				(a) =>
					a && a.toLowerCase() === this.localize(affiliation).toLowerCase(),
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

.listPanel__item--reviewer__rating {
	margin-inline-start: 0.25rem;
	color: @star-off;
}

.listPanel__item--reviewer__star--on {
	color: @star-on;
}

.listPanel__item--reviewer__orcid {
	margin-inline-start: 0.5rem;
	font-size: @font-tiny;
	text-decoration: none;
}

.listPanel__item--reviewer__brief > * {
	display: inline-block;
	margin-top: 0.5em;
	margin-inline-end: 1em;
	font-size: @font-tiny;
}

.listPanel__item--reviewer__complete {
	min-width: 4em;
}

.listPanel__item--reviewer__last {
	min-width: 9em;
}

.listPanel__item--reviewer__detailHeading {
	margin-bottom: 0.5em;
	font-weight: @bold;
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
