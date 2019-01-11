<template>
	<li class="pkpListPanelItem pkpListPanelItem--select pkpListPanelItem--selectReviewer" :class="classes">
		<div class="pkpListPanelItem__summary pkpListPanelItem__summary--selectReviewer -pkpClearFix">
			<div v-if="!isCurrentlyAssigned && !shouldWarnOnAssignment" class="pkpListPanelItem__selectItem" @click.self="toggle">
				<input
					v-if="inputType === 'radio'"
					type="radio"
					:id="inputId"
					:name="inputName"
					:value="inputValue"
					v-model="isSelected"
					@change="toggle"
					@focus="focusItem"
					@blur="blurItem"
				>
				<input
					v-else
					type="checkbox"
					:id="inputId"
					:name="inputName"
					:value="inputValue"
					v-model="isSelected"
					@change="toggle"
					@focus="focusItem"
					@blur="blurItem"
				>
			</div>
			<label :for="inputId" class="pkpListPanelItem__item pkpListPanelItem__item--reviewer">
				<div class="pkpListPanelItem--reviewer__header">
					<div class="pkpListPanelItem--reviewer__fullName">
						<badge
							v-if="item.reviewsActive && !isCurrentlyAssigned && !shouldWarnOnAssignment"
							class="pkpListPanelItem--reviewer__active"
						>
							{{ __('activeReviews', {count: item.reviewsActive}) }}
						</badge>
						{{ item.fullName }}
					</div>
					<div v-if="item.reviewerRating !== null && !isCurrentlyAssigned && !shouldWarnOnAssignment" class="pkpListPanelItem--reviewer__rating">
						<icon
							v-for="(star, index) in stars"
							:key="index"
							icon="star"
							:class="star ? 'pkpListPanelItem--reviewer__star--on' : 'pkpListPanelItem--reviewer__star--off'"
						/>
						<span class="-screenReader">{{ __('reviewerRating', {rating: item.reviewerRating}) }}</span>
					</div>
				</div>
				<div class="pkpListPanelItem--reviewer__affiliation">
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
				<div v-if="!isCurrentlyAssigned && !shouldWarnOnAssignment" class="pkpListPanelItem--reviewer__brief" aria-hidden="true">
					<span class="pkpListPanelItem--reviewer__complete">
						<icon icon="check-circle-o" :inline="true" />
						{{ item.reviewsCompleted }}
					</span>
					<span class="pkpListPanelItem--reviewer__last">
						<icon icon="history" :inline="true" />
						{{ daysSinceLastAssignmentString }}
					</span>
					<span v-if="item.interests.length" class="pkpListPanelItem--reviewer__interests">
						<icon icon="book" :inline="true" />
						{{ interestsString }}
					</span>
				</div>
			</label>
			<div v-if="isCurrentlyAssigned" class="pkpListPanelItem--reviewer__notice">
				<icon icon="exclamation-triangle" :inline="true" />
				{{ i18n.currentlyAssigned }}
			</div>
			<div v-else-if="shouldWarnOnAssignment" class="pkpListPanelItem--reviewer__notice">
				<icon icon="lock" :inline="true" />
				{{ i18n.warnOnAssign }}
				<button @click.prevent="unlockAssignment" class="pkpListPanelItem--reviewer__noticeAction">{{ i18n.warnOnAssignUnlock }}</button>
			</div>
			<button
				v-if="!isCurrentlyAssigned && !shouldWarnOnAssignment"
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
			class="pkpListPanelItem__details pkpListPanelItem__details--selectReviewer"
		>
			<list>
				<list-item>
					<template slot="value">
						<icon icon="clock-o" :inline="true" />
						{{ item.reviewsActive }}
					</template>
					{{ i18n.activeReviewsDescription}}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="check-circle-o" :inline="true" />
						{{ item.reviewsCompleted }}
					</template>
					{{ i18n.completedReviews}}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="times-circle-o" :inline="true" />
						{{ item.reviewsDeclined }}
					</template>
					{{ i18n.declinedReviews}}
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
	</li>
</template>

<script>
import SelectListPanelItem from '@/components/SelectListPanel/SelectListPanelItem.vue';
import Badge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';

export default {
	extends: SelectListPanelItem,
	name: 'SelectReviewerListItem',
	components: {
		Badge,
		Icon,
		List,
		ListItem
	},
	props: ['currentlyAssigned', 'warnOnAssignment', 'i18n'],
	data: function() {
		return {
			isExpanded: false,
			isWarningBypassed: false
		};
	},
	computed: {
		/**
		 * Classes to add to outer element
		 *
		 * @return array
		 */
		classes: function() {
			let classes = [];
			if (this.isFocused) {
				classes.push('-hasFocus');
			}
			if (this.isCurrentlyAssigned) {
				classes.push('pkpListPanelItem--selectReviewerAssigned');
			}
			if (this.shouldWarnOnAssignment) {
				classes.push('pkpListPanelItem--selectReviewerWarned');
			}

			return classes;
		},

		/**
		 * Is this reviewer assigned to the submission in question?
		 *
		 * @return boolean
		 */
		isCurrentlyAssigned: function() {
			return this.currentlyAssigned.includes(this.item.id);
		},

		/**
		 * How many days has it been since they were last assigned a review
		 *
		 * @return int
		 */
		daysSinceLastAssignment: function() {
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
		 * @return string "X days ago"
		 */
		daysSinceLastAssignmentString: function() {
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
		 * @return string
		 */
		interestsString: function() {
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
		 * An array of booleans matching the stars for the reviewerRating. True is
		 * a filled-in star. False is an empty star.
		 *
		 * An empty array means no rating has been assigned.
		 *
		 * @return array
		 */
		stars: function() {
			let stars = [];
			if (this.item.reviewerRating) {
				for (let i = 0; i < 5; i++) {
					stars.push(i < this.item.reviewerRating);
				}
			}
			return stars;
		},

		/**
		 * Should this reviewer feature a warning about assigning them as a blind
		 * reviewer?
		 */
		shouldWarnOnAssignment: function() {
			return (
				!this.isWarningBypassed && this.warnOnAssignment.includes(this.item.id)
			);
		}
	},
	methods: {
		/**
		 * Unlock a locked assignment
		 */
		unlockAssignment: function() {
			this.isWarningBypassed = true;
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpListPanelItem--selectReviewer {
	padding: 0;
}

.pkpListPanelItem__summary--selectReviewer {
	padding-top: 0;
	padding-bottom: 0;
}

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
	font-size: @font-tiny;
}

.pkpListPanelItem--reviewer__complete {
	min-width: 5em;
}

.pkpListPanelItem--reviewer__last {
	min-width: 10em;
}

.pkpListPanelItem--reviewer__brief .fa,
.pkpListPanelItem__details--selectReviewer .list .fa {
	color: @bg-dark;
	font-size: @font-sml;
}

.pkpListPanelItem__details--selectReviewer {
	.list {
		margin-left: 3rem;
		margin-right: 2rem;
	}
}

.pkpListPanelItem--reviewer__detailHeading {
	margin-bottom: 0.5em;
	font-weight: @bold;
}

// Reviewers already assigned to this submission
.pkpListPanelItem--reviewer__notice {
	padding: 0.5rem 0.5rem 1rem 4rem;
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

.pkpListPanelItem--selectReviewerAssigned {
	.pkpListPanelItem__item--reviewer {
		padding-bottom: 0;
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
}

.pkpListPanelItem--selectReviewerWarned {
	.pkpListPanelItem__item--reviewer {
		padding-bottom: 0;
	}
}
</style>
