<template>
	<div class="pkpListPanelItem--reviewer -hasSummary" :class="classes">
		<div class="pkpListPanelItem__summary">
			<component
				:is="localCanSelect ? 'label' : 'div'"
				class="pkpListPanelItem__selectorLabel"
			>
				<div v-if="localCanSelect" class="pkpListPanelItem__selector">
					<input
						:name="selectorName"
						:type="selectorType"
						:value="id"
						v-model="localSelected"
					/>
				</div>
				<div class="pkpListPanelItem--reviewer__entry">
					<div class="pkpListPanelItem--reviewer__header">
						<div class="pkpListPanelItem--reviewer__fullName">
							<badge
								v-if="item.reviewsActive && localCanSelect"
								class="pkpListPanelItem--reviewer__active"
							>
								{{ __('activeReviews', {count: item.reviewsActive}) }}
							</badge>
							{{ item.fullName }}
						</div>
						<div
							v-if="item.reviewerRating !== null && localCanSelect"
							class="pkpListPanelItem--reviewer__rating"
						>
							<icon
								v-for="(star, index) in stars"
								:key="index"
								icon="star"
								:class="
									star
										? 'pkpListPanelItem--reviewer__star--on'
										: 'pkpListPanelItem--reviewer__star--off'
								"
							/>
							<span class="-screenReader">
								{{ __('reviewerRating', {rating: item.reviewerRating}) }}
							</span>
						</div>
					</div>
					<div
						v-if="Object.keys(item.affiliation).length || item.orcid"
						class="pkpListPanelItem--reviewer__affiliation"
					>
						{{ localize(item.affiliation) }}
						<a
							v-if="item.orcid"
							:href="item.orcid"
							class="pkpListPanelItem--reviewer__orcid"
							target="_blank"
						>
							<icon icon="orcid" :inline="true" />
							{{ item.orcid }}
						</a>
					</div>
					<!-- use aria-hidden on these details because the information can be
						more easily acquired by screen readers from the details panel. -->
					<div
						v-if="localCanSelect"
						class="pkpListPanelItem--reviewer__brief"
						aria-hidden="true"
					>
						<span class="pkpListPanelItem--reviewer__complete">
							<icon icon="check-circle-o" :inline="true" />
							{{ item.reviewsCompleted }}
						</span>
						<span class="pkpListPanelItem--reviewer__last">
							<icon icon="history" :inline="true" />
							{{ daysSinceLastAssignmentString }}
						</span>
						<span
							v-if="item.interests.length"
							class="pkpListPanelItem--reviewer__interests"
						>
							<icon icon="book" :inline="true" />
							{{ interestsString }}
						</span>
					</div>
				</div>
			</component>
			<div v-if="currentlyAssigned" class="pkpListPanelItem--reviewer__notice">
				<icon icon="exclamation-triangle" :inline="true" />
				{{ i18n.currentlyAssigned }}
			</div>
			<div
				v-else-if="warnOnAssignment && !isWarningBypassed"
				class="pkpListPanelItem--reviewer__notice"
			>
				<icon icon="lock" :inline="true" />
				{{ i18n.warnOnAssign }}
				<button
					@click.prevent="unlockAssignment"
					class="pkpListPanelItem--reviewer__noticeAction"
				>
					{{ i18n.warnOnAssignUnlock }}
				</button>
			</div>
			<button
				v-if="localCanSelect"
				@click="toggleExpanded"
				class="pkpListPanelItem__expander"
			>
				<template v-if="isExpanded">
					<icon icon="angle-up" />
					<span class="-screenReader">
						{{ __('viewLess', {name: item.fullName}) }}
					</span>
				</template>
				<template v-else>
					<icon icon="angle-down" />
					<span class="-screenReader">
						{{ __('viewMore', {name: item.fullName}) }}
					</span>
				</template>
			</button>
		</div>
		<div
			v-if="isExpanded"
			class="pkpListPanelItem__details pkpListPanelItem__details--reviewer"
		>
			<list>
				<list-item>
					<template slot="value">
						<icon icon="clock-o" :inline="true" />
						{{ item.reviewsActive }}
					</template>
					{{ i18n.activeReviewsDescription }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="check-circle-o" :inline="true" />
						{{ item.reviewsCompleted }}
					</template>
					{{ i18n.completedReviews }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="times-circle-o" :inline="true" />
						{{ item.reviewsDeclined }}
					</template>
					{{ i18n.declinedReviews }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="ban" :inline="true" />
						{{ item.reviewsCancelled }}
					</template>
					{{ i18n.cancelledReviews }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="history" :inline="true" />
						{{ daysSinceLastAssignment }}
					</template>
					{{ i18n.daysSinceLastAssignmentDescription }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="calendar" :inline="true" />
						{{ item.averageReviewCompletionDays }}
					</template>
					{{ i18n.averageCompletion }}
				</list-item>
				<list-item v-if="item.interests.length">
					<div class="pkpListPanelItem--reviewer__detailHeading">
						<icon icon="book" :inline="true" />
						{{ i18n.reviewInterests }}
					</div>
					{{ interestsString }}
				</list-item>
				<list-item v-if="item.gossip">
					<div class="pkpListPanelItem--reviewer__detailHeading">
						{{ i18n.gossip }}
					</div>
					<div v-html="item.gossip"></div>
				</list-item>
				<list-item v-if="localize(item.biography)">
					<div class="pkpListPanelItem--reviewer__detailHeading">
						{{ i18n.biography }}
					</div>
					<div v-html="localize(item.biography)"></div>
				</list-item>
			</list>
		</div>
	</div>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';
import Badge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';

export default {
	extends: ListPanelItem,
	components: {
		Badge,
		Icon,
		List,
		ListItem
	},
	props: {
		currentlyAssigned: {
			type: Boolean,
			required: true
		},
		warnOnAssignment: {
			type: Boolean,
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
		 * Classes to apply to the root element
		 *
		 * @return {Array}
		 */
		classes() {
			let classes = ListPanelItem.computed.classes.apply(this);
			classes.push('-hasSelector');
			if (this.currentlyAssigned) {
				classes.push('-isAssigned');
			}
			return classes;
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
		daysSinceLastAssignmentString() {
			if (!this.daysSinceLastAssignment) {
				return this.i18n.neverAssigned;
			}
			if (this.daysSinceLastAssignment > 1) {
				return this.__('daysSinceLastAssignment', {
					days: this.daysSinceLastAssignment
				});
			} else {
				return this.__('daySinceLastAssignment');
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
				.join(this.i18n.listSeparator);
		},

		/**
		 * Can this reviewer be selected
		 *
		 * Checks for current assignment and a locked assignment warning.
		 * Use this instead of the canSelect prop.
		 *
		 * @return {Boolean}
		 */
		localCanSelect() {
			if (this.currentlyAssigned) {
				return false;
			}
			if (this.warnOnAssignment) {
				return this.isWarningBypassed;
			}
			return true;
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

.pkpListPanelItem--reviewer__header {
	position: relative;
	padding-right: 8em;
}

.pkpListPanelItem--reviewer__fullName {
	font-weight: @bold;
}

.pkpListPanelItem--reviewer__active {
	font-weight: @normal;
	margin-right: 0.25rem;
}

.pkpListPanelItem--reviewer__rating {
	position: absolute;
	top: 50%;
	right: 1em;
	transform: translateY(-50%);
	color: @star-off;
}

.pkpListPanelItem--reviewer__star--on {
	color: @star-on;
}

.pkpListPanelItem--reviewer__orcid {
	margin-left: 1rem;
	font-size: @font-tiny;
	text-decoration: none;
}

.pkpListPanelItem--reviewer__brief > * {
	display: inline-block;
	margin-top: 0.5em;
	margin-right: 1em;
	font-size: @font-tiny;
}

.pkpListPanelItem--reviewer__complete {
	min-width: 4em;
}

.pkpListPanelItem--reviewer__last {
	min-width: 9em;
}

.pkpListPanelItem--reviewer__brief .fa,
.pkpListPanelItem__details--reviewer .list .fa {
	color: @bg-dark;
	font-size: @font-sml;
}

.pkpListPanelItem__details--reviewer {
	.list {
		margin-left: 2rem;
		margin-right: 2rem;
	}
}

.pkpListPanelItem--reviewer__detailHeading {
	margin-bottom: 0.5em;
	font-weight: @bold;
}

// Reviewers already assigned to this submission
.pkpListPanelItem--reviewer__notice {
	margin-top: -0.5rem;
	padding: 0 0.5rem 1rem 1rem;
	font-size: @font-tiny;
}

// Make the button look like a link
.pkpListPanelItem--reviewer__noticeAction {
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

.pkpListPanelItem--reviewer.-isAssigned .pkpListPanelItem--reviewer__entry {
	opacity: 0.5;

	&:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		cursor: not-allowed;
	}
}

/** Override styles when placed in a legacy form */
.pkp_form .pkpListPanel--reviewer {
	label {
		font-weight: @normal;
	}

	.pkpListPanelItem--reviewer__fullName,
	.pkpListPanelItem--reviewer__affiliation {
		font-size: @font-sml;
	}

	.pkpListPanelItem--reviewer__fullName {
		font-weight: @bold;
	}
}
</style>
