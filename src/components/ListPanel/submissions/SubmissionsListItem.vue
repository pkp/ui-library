<template>
	<li class="pkpListPanelItem pkpListPanelItem--submission pkpListPanelItem--hasSummary" :class="{'-hasFocus': isFocused}">
		<div class="pkpListPanelItem__summary -pkpClearfix">
			<a :href="item.urlWorkflow" class="pkpListPanelItem--submission__link" @focus="focusItem" @blur="blurItem">
				<div class="pkpListPanelItem--submission__item">
					<div class="pkpListPanelItem--submission__id">
						<span class="-screenReader">{{ i18n.id }}</span>
						{{ item.id }}
					</div>
					<div v-if="item.authorString" class="pkpListPanelItem--submission__author">
						{{ item.authorString }}
					</div>
					<div class="pkpListPanelItem--submission__title">
						{{ localize(item.fullTitle) }}
					</div>
					<div v-if="notice" class="pkpListPanelItem--submission__activity">
						<span class="fa fa-exclamation-triangle pkpIcon--inline" aria-hidden="true"></span>
						{{ notice }}
					</div>
				</div>
			</a>
			<div v-if="currentUserIsReviewer" class="pkpListPanelItem--submission__stage pkpListPanelItem--submission__stage--reviewer">
				<a :href="item.urlWorkflow" tabindex="-1">
					<div v-if="currentUserLatestReviewAssignment.responsePending" class="pkpListPanelItem--submission__dueDate">
						<div :aria-labelledby="responseDueLabelId" class="pkpListPanelItem--submission__dueDateValue">
							{{ currentUserLatestReviewAssignment.responseDue }}
						</div>
						<div :id="responseDueLabelId" class="pkpListPanelItem--submission__dueDateLabel">
							{{ i18n.responseDue }}
						</div>
					</div>
					<div v-if="currentUserLatestReviewAssignment.reviewPending" class="pkpListPanelItem--submission__dueDate">
						<div :aria-labelledby="reviewDueLabelId" class="pkpListPanelItem--submission__dueDateValue">
							{{ currentUserLatestReviewAssignment.due }}
						</div>
						<div :id="reviewDueLabelId" class="pkpListPanelItem--submission__dueDateLabel">
							{{ i18n.reviewDue }}
						</div>
					</div>
				</a>
			</div>
			<div v-else class="pkpListPanelItem--submission__stage">
				<div class="pkpListPanelItem--submission__stageRow">
					<span
						class="pkpBadge pkpBadge--dot pkpBadge--button"
						:class="stageBadgeClass"
						@click="filterByStage(activeStage.id)"
					>
						<template v-if="item.status.id === 3 || item.status.id === 4">
							{{ item.status.label }}
						</template>
						<template v-else-if="item.submissionProgress > 0">
							{{ i18n.incomplete }}
						</template>
						<template v-else>
							{{ activeStage.label }}
						</template>
					</span>
					<!-- use aria-hidden on these details because the information can be
						more easily acquired by screen readers from the details panel. -->
					<div class="pkpListPanelItem--submission__flags" aria-hidden="true">
						<span v-if="isReviewStage"  class="pkpListPanelItem--submission__flags--reviews">
							<span class="fa fa-user-o pkpIcon--inline"></span>
							{{ completedReviewsCount }}/{{ currentReviewAssignments.length }}
						</span>
						<span v-if="activeStage.files.count" class="pkpListPanelItem--submission__flags--files">
							<span class="fa fa-file-text-o pkpIcon--inline"></span>
							{{ activeStage.files.count }}
						</span>
						<span v-if="openQueryCount" class="pkpListPanelItem--submission__flags--discussions">
							<span class="fa fa-comment-o pkpIcon--inline"></span>
							{{ openQueryCount }}
						</span>
					</div>
				</div>
			</div>
			<button
				v-if="!currentUserIsReviewer"
				@click="toggleExpanded"
				class="pkpListPanelItem__expander"
			>
				<span v-if="isExpanded" class="fa fa-angle-up" aria-hidden="true"></span>
				<span v-else class="fa fa-angle-down" aria-hidden="true"></span>
				<span class="-screenReader"></span>
			</button>
		</div>
		<div
			v-if="isExpanded"
			class="pkpListPanelItem__details pkpListPanelItem__details--submission"
		>
			<div v-if="!item.submissionProgress" class="pkpListPanelItem--submission__stageDetails">
				<div v-if="isReviewStage"  class="pkpListPanelItem--submission__stageDetailsItem">
					<span class="pkpListPanelItem--submission__stageDetailsItemCount">
						<span class="fa fa-user-o pkpIcon--inline" aria-hidden="true"></span>
						{{ completedReviewsCount }}/{{ currentReviewAssignments.length }}
					</span>
					{{ i18n.reviewsCompleted }}
				</div>
				<div v-if="!isSubmissionStage" class="pkpListPanelItem--submission__stageDetailsItem">
					<span class="pkpListPanelItem--submission__stageDetailsItemCount">
						<span class="fa fa-file-text-o pkpIcon--inline" aria-hidden="true"></span>
						{{ activeStage.files.count }}
					</span>
					{{ activeStageFilesLabel }}
				</div>
				<div class="pkpListPanelItem--submission__stageDetailsItem">
					<span class="pkpListPanelItem--submission__stageDetailsItemCount">
						<span class="fa fa-comment-o pkpIcon--inline" aria-hidden="true"></span>
						{{ openQueryCount }}
					</span>
					{{ i18n.discussions }}
				</div>
			</div>
			<div class="pkpListPanelItem--submission__actions">
				<a :href="item.urlWorkflow" class="pkpButton" @focus="focusItem" @blur="blurItem">
					{{ i18n.viewSubmission }}
				</a>
				<button v-if="currentUserCanViewInfoCenter" class="pkpButton" @click.prevent="openInfoCenter" @focus="focusItem" @blur="blurItem">
					{{ i18n.infoCenter }}
				</button>
				<button v-if="currentUserCanDelete" class="pkpButton -isWarnable" @click.prevent="deleteSubmissionPrompt" @focus="focusItem" @blur="blurItem">
					{{ i18n.delete }}
				</button>
			</div>
		</div>
		<div class="pkpListPanelItem__mask" :class="classMask">
			<div class="pkpListPanelItem__maskLabel">
				<template v-if="mask === 'confirmingDelete'">
					<span class="pkpListPanelItem__maskLabel_prompt">
						{{ i18n.confirmDelete }}
						<a href="#" @click.prevent="deleteSubmission">Yes</a>
						<a href="#" @click.prevent="cancelDeleteRequest">No</a>
					</span>
				</template>
				<template v-if="mask === 'deleting'">
					<span class="pkpListPanelItem__maskLabel_loading">
						<span class="pkp_spinner"></span>
						{{ i18n.deleting }}
					</span>
				</template>
			</div>
		</div>
	</li>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';

export default {
	extends: ListPanelItem,
	name: 'SubmissionsListItem',
	props: ['item', 'i18n', 'apiPath', 'infoUrl'],
	data: function () {
		return {
			isExpanded: false,
			mask: null,
		};
	},
	computed: {
		/**
		 * Map the submission id to the list item id
		 */
		id: function () {
			return this.item.id;
		},

		/**
		 * Can the current user delete a submission?
		 *
		 * @return bool
		 */
		currentUserCanDelete: function () {
			if (pkp.userHasRole(['manager', 'siteAdmin'])) {
				return true;
			} else if (pkp.userHasRole('author') && this.item.submissionProgress !== 0) {
				return true;
			}
			return false; // @todo
		},

		/**
		 * Can the current user view the info center?
		 *
		 * @return bool
		 */
		currentUserCanViewInfoCenter: function () {
			return pkp.userHasRole(['manager', 'subeditor', 'assistant']);
		},

		/**
		 * Is the current user a reviewer on this submission?
		 *
		 * @return bool
		 */
		currentUserIsReviewer: function () {
			for (var review of this.item.reviewAssignments) {
				if (review.isCurrentUserAssigned) {
					return true;
				}
			}
			return false;
		},

		/**
		 * The current stage
		 *
		 * @return array
		 */
		activeStage: function () {
			return this.item.stages.find(stage => {
				return stage.isActiveStage === true;
			});
		},

		/**
		 * Compile a notice depending on the stage status
		 *
		 * Only stage status' that have pending work for the current user should
		 * result in a notice.
		 *
		 * @todo Set different notice priorities for different users. Current
		 *  set up is for editors.
		 * @return string
		 */
		notice: function () {
			var notice = '';

			// Notices for journal managers
			if (pkp.userHasRole('manager')) {
				if (this.activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
					switch (this.activeStage.statusId) {
						case pkp.const.STAGE_STATUS_SUBMISSION_UNASSIGNED:
							notice = this.activeStage.status;
							break;
					}
				}
			}

			// Notices for journal managers and subeditors
			if (pkp.userHasRole(['manager', 'subeditor'])) {
				if (this.isReviewStage) {
					switch (this.activeStage.statusId) {
						case pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS:
						case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_READY:
						case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED:
						case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE:
						case pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED:
							notice = this.activeStage.status;
							break;
					}
					if (!this.activeStage.currentUserCanRecommendOnly) {
						switch (this.activeStage.statusId) {
							case pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY:
							case pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED:
								notice = this.activeStage.status;
								break;
						}
					}
				}
			}

			// Notices for authors
			if (pkp.userHasRole(['author'])) {
				if (this.isReviewStage) {
					switch (this.activeStage.statusId) {
						case pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED:
							notice = this.activeStage.status;
							break;
					}
				}
			}

			// Notices for reviewers
			if (this.currentUserIsReviewer) {
				switch (this.currentUserLatestReviewAssignment.statusId) {
					case pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE:
					case pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE:
					case pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE:
						notice = this.currentUserLatestReviewAssignment.status;
						break;
				}
			}

			return notice;
		},

		/**
		 * Get the pkpBadge class name to use for this stage
		 *
		 * @return string
		 */
		stageBadgeClass: function () {
			switch (this.activeStage.id) {
				case pkp.const.WORKFLOW_STAGE_ID_SUBMISSION:
					return 'pkpBadge--submission';
				case pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW:
				case pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW:
					return 'pkpBadge--review';
				case pkp.const.WORKFLOW_STAGE_ID_EDITING:
					return 'pkpBadge--copyediting';
				case pkp.const.WORKFLOW_STAGE_ID_PRODUCTION:
					return 'pkpBadge--production';
			}
			return '';
		},

		/**
		 * Compile the count of open discussions
		 *
		 * @return int
		 */
		openQueryCount: function () {
			return this.activeStage.queries.filter(query => {
				return !query.closed;
			}).length;
		},

		/**
		 * Determine the correct label for the count of files based on the active
		 * stage.
		 *
		 * @return string
		 */
		activeStageFilesLabel: function () {
			switch (this.activeStage.id) {
				case pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW:
				case pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW:
					return this.i18n.revisionsSubmitted;
				case pkp.const.WORKFLOW_STAGE_ID_EDITING:
					return this.i18n.copyeditsSubmitted;
				case pkp.const.WORKFLOW_STAGE_ID_PRODUCTION:
					return this.i18n.galleysCreated;
			}
			return '';
		},

		/**
		 * Is this the submission stage?
		 *
		 * @return bool
		 */
		isSubmissionStage: function () {
			return this.activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION;
		},

		/**
		 * Is this the review stage?
		 *
		 * @return bool
		 */
		isReviewStage: function () {
			return this.activeStage.id === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW || this.activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW;
		},

		/**
		 * Retrieve the review assignments for the latest review round
		 *
		 * @return array
		 */
		currentReviewAssignments: function () {
			if (!this.item.reviewRounds.length || !this.item.reviewAssignments.length) {
				return [];
			}
			var currentReviewRoundId = this.item.reviewRounds[this.item.reviewRounds.length - 1].id;
			return this.item.reviewAssignments.filter(assignment => {
				return assignment.roundId === currentReviewRoundId;
			});
		},

		/**
		 * The current user's latest review assignment. This retrieves the
		 * review assignment from the latest round if available, or any other
		 * round if not available.
		 *
		 * @return object|false False if no review assignment exists
		 */
		currentUserLatestReviewAssignment: function () {

			if (!this.currentUserIsReviewer) {
				return false;
			}

			var assignments = this.item.reviewAssignments.filter(assignment => {
				return assignment.isCurrentUserAssigned === true;
			});

			if (!assignments.length) {
				return false;
			}

			var latest = assignments.reduce((prev, current) => {
				return (prev.round > current.round) ? prev : current;
			});

			switch (latest.statusId) {

				case pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE:
				case pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE:
					latest.responsePending = true;
					latest.reviewPending = true;
					break;

				case pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED:
				case pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE:
					latest.reviewPending = true;
					break;

				case pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED:
				case pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE:
				case pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED:
					latest.reviewComplete = true;
					break;
			}

			return latest;
		},

		/**
		 * Compile the count of completed reviews
		 *
		 * @return int
		 */
		completedReviewsCount: function () {
			if (!this.isReviewStage) {
				return 0;
			}
			return this.currentReviewAssignments.filter(review => {
				return review.statusId >= pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED;
			}).length;
		},

		/**
		 * Return a class to toggle the item mask
		 *
		 * @return string
		 */
		classMask: function () {
			if (!this.mask) {
				return '';
			} else if (this.mask === 'finish') {
				return '-finish';
			}
			var classes = ['-active'];
			if (this.mask === 'confirmingDelete' || this.mask === 'deleting') {
				classes.push('-alert');
			}

			return classes.join(' ');
		},

		/**
		 * ID attribute to use in aria-labelledby linking the reponse due date
		 * with it's label
		 *
		 * @return string
		 */
		responseDueLabelId: function () {
			return 'responseDueLabel' + this._uid;
		},

		/**
		 * ID attribute to use in aria-labelledby linking the review due date
		 * with it's label
		 *
		 * @return string
		 */
		reviewDueLabelId: function () {
			return 'reviewDueLabel' + this._uid;
		},
	},
	methods: {

		/**
		 * Filter by a submission stage
		 *
		 * @param stageId int
		 */
		filterByStage: function (stageId) {
			this.$emit('filterList', {'stageIds': [stageId]});
		},

		/**
		 * Load a modal displaying history and notes of a submission
		 */
		openInfoCenter: function () {

			var opts = {
				title: this.item.title,
				url: this.infoUrl.replace('__id__', this.item.id),
				closeCallback: this.resetFocusInfoCenter,
			};

			$('<div id="' + $.pkp.classes.Helper.uuid() + '" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>')
				.pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Reset the focus on the info center link when the modal has been
		 * closed. This is a callback function passed into ModalHandler.js
		 */
		resetFocusInfoCenter: function () {
			this.$el.querySelector('.pkpListPanelItem__openInfoCenter').focus();
		},

		/**
		 * Display a confirmation prompt before deleting a submission
		 */
		deleteSubmissionPrompt: function () {
			this.mask = 'confirmingDelete';
		},

		/**
		 * Send a request to delete the submission and handle the response
		 */
		deleteSubmission: function () {

			this.mask = 'deleting';

			var self = this;
			$.ajax({
				url: this.getApiUrl(this.apiPath + '/' + this.item.id),
				type: 'DELETE',
				error: this.ajaxErrorCallback,
				success: function (r) {
					self.mask = 'finish';
					// Allow time for the finished CSS transition to display
					setTimeout(function () {
						pkp.eventBus.$emit('submissionDeleted', { id: self.item.id });
						self.cancelDeleteRequest();
					}, 300);
				},
				complete: function (r) {
					// Reset the mask in case there is an error
					if (self.mask === 'deleting') {
						self.cancelDeleteRequest();
					}
				},
			});
		},

		/**
		 * Cancel the delete request
		 */
		cancelDeleteRequest: function () {
			this.mask = null;
		},
	},
};
</script>


<style lang="less">
@import '../../../styles/_import';

.pkpListPanelItem--submission {
	position: relative;
	transition: all 0.3s;

	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		right: 100%;
		width: 0.1rem;
		height: 25%;
		background: @primary;
		opacity: 0;
		transition: height 0.3s;
		transform: translateY(-50%);
	}

	&:hover,
	&.-hasFocus {

		&:before {
			height: 100%;
			opacity: 1;
		}
	}
}

.pkpListPanelItem--submission__link {
	display: block;
	color: @text;
	text-decoration: none;

	&:hover,
	&:focus {
		color: @text;
	}
}

.pkpListPanelItem--submission__item,
.pkpListPanelItem--submission__stage {
	float: left;
}

.pkpListPanelItem--submission__item {
	position: relative;
	float: left;
	width: 75%;
	padding-left: 48px;
}

.pkpListPanelItem--submission__id {
	position: absolute;
	top: 0;
	left: 0;
	font-size: @font-tiny;
	line-height: (@font-sml * 1.5); // Match ,pkpListPanelItem--submission__author
	color: @text;
}

.pkpListPanelItem--submission__title,
.pkpListPanelItem--submission__author,
.pkpListPanelItem--submission__activity {
	display: block;
	padding-right: 2em;
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
}

.pkpListPanelItem--submission__author {
	font-weight: @bold;
}

.pkpListPanelItem--submission__activity {
	margin-top: 0.5em;
	font-size: @font-tiny;
	line-height: 1.5em;
	color: @text;

	.fa {
		font-size: @font-sml;
		color: @no;
	}
}

.pkpListPanelItem--submission__stage {
	width: 25%;
}

.pkpListPanelItem--submission__flags {
	font-size: @font-tiny;
	margin-top: 1em;

	> * {
		margin-left: 1em;
	}

	.fa {
		margin-right: 0.25em;
		font-size: @font-sml;
		color: @text-light-rgba;
	}
}

// Details panel
.pkpListPanelItem__details--submission {
	padding: 1em (@base * 3) 1em 62px;
}

.pkpListPanelItem--submission__stageDetails {
	border-top: @grid-border;
	box-shadow: 0 1px 1px rgba(0,0,0,0.2);
	border-radius: @radius;
}

.pkpListPanelItem--submission__stageDetailsItem {
	position: relative;
	padding: 1em;
	padding-left: 6.5em;
	border-bottom: @grid-border;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 5.5em;
		width: 0;
		height: 100%;
		border-right: @grid-border;
	}

	&:last-child {
		border-bottom: none;
	}
}

.pkpListPanelItem--submission__stageDetailsItemCount {
	position: absolute;
	top: 50%;
	left: 1em;
	transform: translateY(-50%);
	width: 6.5em;

	.fa {
		color: @text-light;
		min-width: 1.25em;
	}
}

.pkpListPanelItem--submission__actions {
	text-align: right;

	&:not(:first-child) {
		margin-top: 1em;
	}
}

// Reviewer-specific displays
.pkpListPanelItem--submission__stage--reviewer a {
	display: block;
	color: @text;
	text-decoration: none;

	&:hover,
	&:focus {
		color: @text;
	}
}

.pkpListPanelItem--submission__dueDate + .pkpListPanelItem--submission__dueDate {
	margin-top: 1em;
}

.pkpListPanelItem--submission__dueDateValue {
	font-weight: @bold;
}

.pkpListPanelItem--submission__dueDateLabel {
	font-size: @font-tiny;
	line-height: @line-tiny;
}
</style>
