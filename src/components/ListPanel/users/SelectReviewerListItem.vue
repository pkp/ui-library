<template>
	<div
		class="listPanel__item--reviewer"
		:class="currentlyAssigned ? '-isAssigned' : ''"
	>
		<div class="listPanel__itemSummary">
			<div class="listPanel__itemIdentity">
				<div class="listPanel__itemTitle">
					<badge
						v-if="item.reviewsActive && canSelect"
						class="listPanel__item--reviewer__active"
					>
						{{
							activeReviewsCountLabel.replace('{$count}', item.reviewsActive)
						}}
					</badge>
					{{ item.fullName }}
					<span
						v-if="item.reviewerRating !== null && canSelect"
						class="listPanel__item--reviewer__rating"
					>
						<icon
							v-for="(star, index) in stars"
							:key="index"
							icon="star"
							:class="
								star
									? 'listPanel__item--reviewer__star--on'
									: 'listPanel__item--reviewer__star--off'
							"
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
							<icon icon="orcid" :inline="true" />
							{{ item.orcid }}
						</a>
					</div>
				</div>

				<div v-if="currentlyAssigned" class="listPanel__item--reviewer__notice">
					<icon icon="exclamation-triangle" :inline="true" />
					{{ currentlyAssignedLabel }}
				</div>
				<div
					v-else-if="assignedToLastRound"
					class="listPanel__item--reviewer__notice"
				>
					<icon icon="thumb-tack" :inline="true" />
					{{ assignedToLastRoundLabel }}
				</div>
				<div
					v-else-if="warnOnAssignment && !isWarningBypassed"
					class="listPanel__item--reviewer__notice"
				>
					<icon icon="lock" :inline="true" />
					{{ warnOnAssignmentLabel }}
					<button
						@click.prevent="unlockAssignment"
						class="listPanel__item--reviewer__noticeAction"
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
						<icon icon="check-circle-o" :inline="true" />
						{{ item.reviewsCompleted }}
					</span>
					<span class="listPanel__item--reviewer__last">
						<icon icon="history" :inline="true" />
						{{ daysSinceLastAssignmentLabelCompiled }}
					</span>
					<span
						v-if="item.interests.length"
						class="listPanel__item--reviewer__interests"
					>
						<icon icon="book" :inline="true" />
						{{ interestsString }}
					</span>
				</div>
			</div>

			<div class="listPanel__itemActions">
				<pkp-button v-if="canSelect" @click="select">
					<template v-if="assignedToLastRound">
						<span aria-hidden="true">{{ reassignLabel }}</span>
						<span class="-screenReader">
							{{ reassignWithName }}
						</span>
					</template>
					<template v-else>
						<span aria-hidden="true">{{ selectReviewerLabel }}</span>
						<span class="-screenReader">
							{{ __('common.selectWithName', {name: item.fullName}) }}
						</span>
					</template>
				</pkp-button>
				<expander
					:isExpanded="isExpanded"
					:itemName="item.fullName"
					@toggle="isExpanded = !isExpanded"
				/>
			</div>
		</div>
		<div
			v-if="isExpanded"
			class="listPanel__itemExpanded listPanel__itemExpanded--reviewer"
		>
			<list>
				<list-item>
					<template slot="value">
						<icon icon="clock-o" :inline="true" />
						{{ item.reviewsActive }}
					</template>
					{{ activeReviewsLabel }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="check-circle-o" :inline="true" />
						{{ item.reviewsCompleted }}
					</template>
					{{ completedReviewsLabel }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="times-circle-o" :inline="true" />
						{{ item.reviewsDeclined }}
					</template>
					{{ declinedReviewsLabel }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="ban" :inline="true" />
						{{ item.reviewsCancelled }}
					</template>
					{{ cancelledReviewsLabel }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="history" :inline="true" />
						{{ daysSinceLastAssignment }}
					</template>
					{{ daysSinceLastAssignmentDescriptionLabel }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="calendar" :inline="true" />
						{{ item.averageReviewCompletionDays }}
					</template>
					{{ averageCompletionLabel }}
				</list-item>
				<list-item v-if="item.interests.length">
					<div class="listPanel__item--reviewer__detailHeading">
						<icon icon="book" :inline="true" />
						{{ reviewInterestsLabel }}
					</div>
					{{ interestsString }}
				</list-item>
				<list-item v-if="item.gossip">
					<div class="listPanel__item--reviewer__detailHeading">
						{{ gossipLabel }}
					</div>
					<div v-html="item.gossip"></div>
				</list-item>
				<list-item v-if="localize(item.biography)">
					<div class="listPanel__item--reviewer__detailHeading">
						{{ biographyLabel }}
					</div>
					<div v-html="localize(item.biography)"></div>
				</list-item>
			</list>
		</div>
	</div>
</template>

<script>
import Expander from '@/components/Expander/Expander.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';

export default {
	components: {
		Expander,
		List,
		ListItem
	},
	props: {
		activeReviewsCountLabel: {
			type: String,
			required: true
		},
		activeReviewsLabel: {
			type: String,
			required: true
		},
		assignedToLastRound: {
			type: Boolean,
			required: true
		},
		assignedToLastRoundLabel: {
			type: String,
			required: true
		},
		averageCompletionLabel: {
			type: String,
			required: true
		},
		biographyLabel: {
			type: String,
			required: true
		},
		cancelledReviewsLabel: {
			type: String,
			required: true
		},
		completedReviewsLabel: {
			type: String,
			required: true
		},
		currentlyAssigned: {
			type: Boolean,
			required: true
		},
		currentlyAssignedLabel: {
			type: String,
			required: true
		},
		daySinceLastAssignmentLabel: {
			type: String,
			required: true
		},
		daysSinceLastAssignmentLabel: {
			type: String,
			required: true
		},
		daysSinceLastAssignmentDescriptionLabel: {
			type: String,
			required: true
		},
		declinedReviewsLabel: {
			type: String,
			required: true
		},
		gossipLabel: {
			type: String,
			required: true
		},
		item: {
			type: Object,
			required: true
		},
		neverAssignedLabel: {
			type: String,
			required: true
		},
		reassignLabel: {
			type: String,
			required: true
		},
		reassignWithNameLabel: {
			type: String,
			required: true
		},
		reviewerRatingLabel: {
			type: String,
			required: true
		},
		reviewInterestsLabel: {
			type: String,
			required: true
		},
		selectReviewerLabel: {
			type: String,
			required: true
		},
		warnOnAssignment: {
			type: Boolean,
			required: true
		},
		warnOnAssignmentLabel: {
			type: String,
			required: true
		},
		warnOnAssignmentUnlockLabel: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isExpanded: false,
			isWarningBypassed: false
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
		 * @return {Number}
		 */
		daysSinceLastAssignment() {
			if (!this.item.dateLastReviewAssignment) {
				return 0;
			}
			return Math.floor(
				((Date.parse(this.item.dateLastReviewAssignment) - Date.now()) /
					86400000) *
					-1
			);
		},

		/**
		 * How many days has it been since they were last assigned a review
		 *
		 * @return {String} "X days ago"
		 */
		daysSinceLastAssignmentLabelCompiled() {
			if (!this.daysSinceLastAssignment) {
				return this.neverAssignedLabel;
			}
			if (this.daysSinceLastAssignment > 1) {
				return this.daysSinceLastAssignmentLabel.replace(
					'{$days}',
					this.daysSinceLastAssignment
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
				.map(i => {
					return i.interest;
				})
				.join(this.__('common.commaListSeparator'));
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
		}
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
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.listPanel__item--reviewer__active {
	margin-right: 0.25rem;
	font-weight: @normal;
}

.listPanel__item--reviewer__rating {
	margin-left: 0.25rem;
	color: @star-off;
}

.listPanel__item--reviewer__star--on {
	color: @star-on;
}

.listPanel__item--reviewer__orcid {
	margin-left: 0.5rem;
	font-size: @font-tiny;
	text-decoration: none;
}

.listPanel__item--reviewer__brief > * {
	display: inline-block;
	margin-top: 0.5em;
	margin-right: 1em;
	font-size: @font-tiny;
}

.listPanel__item--reviewer__complete {
	min-width: 4em;
}

.listPanel__item--reviewer__last {
	min-width: 9em;
}

.listPanel__item--reviewer__brief .fa,
.listPanel__itemExpanded--reviewer .fa {
	color: @bg-dark;
	font-size: @font-sml;
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
