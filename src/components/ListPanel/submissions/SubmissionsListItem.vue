<template>
	<li class="pkpListPanelItem pkpListPanelItem--submission" :class="{'--hasFocus': isFocused}">
		<a :href="submission.urlWorkflow" class="pkpListPanelItem--submission__link" @focus="focusItem" @blur="blurItem">
			<div class="pkpListPanelItem--submission__item">
				<div class="pkpListPanelItem--submission__title">
					{{ submission.title }}
				</div>
				<div v-if="submission.author" class="pkpListPanelItem--submission__author">
					{{ submission.author.authorString }}
				</div>
				<div v-if="notice" class="pkpListPanelItem--submission__activity">
					<span class="fa fa-exclamation-triangle"></span>
					{{ notice }}
				</div>
			</div>
		</a>
		<div v-if="currentUserIsReviewer" class="pkpListPanelItem--submission__stage pkpListPanelItem--submission__stage--reviewer">
			<a :href="submission.urlWorkflow" tabindex="-1">
				<div v-if="currentUserLatestReviewAssignment.responsePending" class="pkpListPanelItem--submission__dueDate">
					<div class="pkpListPanelItem--submission__dueDateValue">
						{{ currentUserLatestReviewAssignment.responseDue }}
					</div>
					<div class="pkpListPanelItem--submission__dueDateLabel">
						{{ i18n.responseDue }}
					</div>
				</div>
				<div v-if="currentUserLatestReviewAssignment.reviewPending" class="pkpListPanelItem--submission__dueDate">
					<div class="pkpListPanelItem--submission__dueDateValue">
						{{ currentUserLatestReviewAssignment.due }}
					</div>
					<div class="pkpListPanelItem--submission__dueDateLabel">
						{{ i18n.reviewDue }}
					</div>
				</div>
			</a>
		</div>
		<div v-else class="pkpListPanelItem--submission__stage">
			<div class="pkpListPanelItem--submission__stageRow">
				<div class="pkpListPanelItem--submission__stageLabel">
					<template v-if="submission.status.id === 3 || submission.status.id === 4">
						{{ submission.status.label }}
					</template>
					<template v-else-if="submission.submissionProgress > 0">
						{{ i18n.incomplete }}
					</template>
					<template v-else>
						{{ activeStage.label }}
					</template>
				</div>
				<div class="pkpListPanelItem--submission__flags">
					<span v-if="isReviewStage"  class="pkpListPanelItem--submission__flags--reviews" :class="classHighlightReviews">
						<span v-if="classHighlightReviews === ''" class="fa fa-user-o"></span>
						<span v-else class="fa fa-user"></span>
						<span class="count">{{ completedReviewsCount }} / {{ currentReviewAssignments.length }}</span>
					</span>
					<span v-if="activeStage.files.count" class="pkpListPanelItem--submission__flags--files" :class="classHighlightFiles">
						<span v-if="classHighlightFiles === ''" class="fa fa-file-text-o"></span>
						<span v-else class="fa fa-file-text"></span>
						<span class="count">{{ activeStage.files.count }}</span>
					</span>
					<span v-if="openQueryCount" class="pkpListPanelItem--submission__flags--discussions">
						<span class="fa fa-comment-o"></span>
						<span class="count">{{ openQueryCount }}</span>
					</span>
				</div>
			</div>
			<div v-if="hasActions" class="pkpListPanelItem__actions">
				<a v-if="currentUserCanDelete" href="#" class="delete" @click.prevent="deleteSubmissionPrompt" @focus="focusItem" @blur="blurItem">
					{{ i18n.delete }}
				</a>
				<a v-if="currentUserCanViewInfoCenter" href="#" @click.prevent="openInfoCenter" @focus="focusItem" @blur="blurItem">
					{{ i18n.infoCenter }}
				</a>
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
import ListPanelItem from '../ListPanelItem.vue';

export default {
	extends: ListPanelItem,
	name: 'SubmissionsListItem',
	props: ['submission', 'i18n', 'apiPath', 'infoUrl'],
	data: function () {
		return {
			mask: null,
		};
	},
	computed: {
		/**
		 * Map the submission id to the list item id
		 */
		id: function () {
			return this.submission.id;
		},

		/**
		 * Can the current user delete a submission?
		 *
		 * @return bool
		 */
		currentUserCanDelete: function () {
			if (pkp.userHasRole(['manager', 'siteAdmin'])) {
				return true;
			} else if (pkp.userHasRole('author') && this.submission.submissionProgress !== 0) {
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
			var isReviewer = false;
			_.each(this.submission.reviewAssignments, function (review) {
				if (review.isCurrentUserAssigned) {
					isReviewer = true;
					return;
				}
			});

			return isReviewer;
		},

		/**
		 * Are there any actions available for this submission?
		 *
		 * @return bool
		 */
		hasActions: function () {
			return this.currentUserCanDelete || this.currentUserCanViewInfoCenter;
		},

		/**
		 * The current stage
		 *
		 * @return array
		 */
		activeStage: function () {
			return _.findWhere(this.submission.stages, {isActiveStage: true});
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
				if (this.activeStage.id === 1) {
					switch (this.activeStage.statusId) {
						case 1: // @todo this should be a global
							notice = this.activeStage.status;
							break;
					}
				}
			}

			// Notices for journal managers and subeditors
			if (pkp.userHasRole(['manager', 'subeditor'])) {
				if (this.isReviewStage) {
					switch (this.activeStage.statusId) {
						case 6: // REVIEW_ROUND_STATUS_PENDING_REVIEWERS
						case 8: // REVIEW_ROUND_STATUS_REVIEWS_READY
						case 9: // REVIEW_ROUND_STATUS_REVIEWS_COMPLETED
						case 10: // REVIEW_ROUND_STATUS_REVIEWS_OVERDUE
						case 11: // REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED
							notice = this.activeStage.status;
							break;
					}
				}
			}

			// Notices for authors
			if (pkp.userHasRole(['author'])) {
				if (this.isReviewStage) {
					switch (this.activeStage.statusId) {
						case 1: // REVIEW_ROUND_STATUS_REVISIONS_REQUESTED
							notice = this.activeStage.status;
							break;
					}
				}
			}

			// Notices for reviewers
			if (this.currentUserIsReviewer) {
				switch (this.currentUserLatestReviewAssignment.statusId) {
					case 0: // REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE
					case 4: // REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
					case 6: // REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
						notice = this.currentUserLatestReviewAssignment.status;
						break;
				}
			}

			return notice;
		},

		/**
		 * Compile the count of open discussions
		 *
		 * @return int
		 */
		openQueryCount: function () {
			return _.where(this.activeStage.queries, {closed: false}).length;
		},

		/**
		 * Is this the review stage?
		 *
		 * @return bool
		 */
		isReviewStage: function () {
			return this.activeStage.id === 3;
		},

		/**
		 * Retrieve the review assignments for the latest review round
		 *
		 * @return array
		 */
		currentReviewAssignments: function () {
			if (!this.submission.reviewRounds.length || !this.submission.reviewAssignments.length) {
				return [];
			}
			var currentReviewRoundId = this.submission.reviewRounds[this.submission.reviewRounds.length - 1].id;
			return _.filter(this.submission.reviewAssignments, function (assignment) {
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

			var assignments = _.where(this.submission.reviewAssignments, {isCurrentUserAssigned: true});

			if (!assignments.length) {
				return false;
			}

			var latest = _.max(assignments, function (assignment) {
				return assignment.round;
			});

			switch (latest.statusId) {

				case 0: // REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE
				case 4: // REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
					latest.responsePending = true;
					latest.reviewPending = true;
					break;

				case 5: // REVIEW_ASSIGNMENT_STATUS_ACCEPTED
				case 6: // REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
					latest.reviewPending = true;
					break;

				case 7: // REVIEW_ASSIGNMENT_STATUS_RECEIVED
				case 8: // REVIEW_ASSIGNMENT_STATUS_COMPLETE
				case 9: // REVIEW_ASSIGNMENT_STATUS_THANKED
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
			return _.filter(this.currentReviewAssignments, function (review) {
				return review.statusId >= 7; // REVIEW_ASSIGNMENT_STATUS_RECEIVED and above
			}).length;
		},

		/**
		 * Return a class to highlight the reviews icon
		 *
		 * @return string
		 */
		classHighlightReviews: function () {
			if (!this.isReviewStage) {
				return '';
			}

			// REVIEW_ROUND_STATUS_REVIEWS_OVERDUE
			if (this.activeStage.statusId == 10) {
				return '--warning';
			}

			// No reviews have been assigned
			if (!this.currentReviewAssignments.length) {
				return '--warning';
			}

			// REVIEW_ROUND_STATUS_REVIEWS_READY
			if (this.activeStage.statusId == 8) {
				return '--notice';
			}

			return '';
		},

		/**
		 * Return a class to highlight the files icon when revisions have been
		 * submitted.
		 *
		 * @return string
		 */
		classHighlightFiles: function () {
			if (this.activeStage.files.count) {
				return '--notice';
			}

			return '';
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
				return '--finish';
			}
			var classes = ['--active'];
			if (this.mask === 'confirmingDelete' || this.mask === 'deleting') {
				classes.push('--alert');
			}

			return classes.join(' ');
		},
	},
	methods: {

		/**
		 * Load a modal displaying history and notes of a submission
		 */
		openInfoCenter: function () {

			var opts = {
				title: this.submission.title,
				url: this.infoUrl.replace('__id__', this.submission.id),
			};

			$('<div id="' + $.pkp.classes.Helper.uuid() + '" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>')
				.pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
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
				url: $.pkp.app.apiBaseUrl + '/' + this.apiPath + '/' + this.submission.id,
				type: 'DELETE',
				error: this.ajaxErrorCallback,
				success: function (r) {
					self.mask = 'finish';
					// Allow time for the finished CSS transition to display
					setTimeout(function () {
						pkp.eventBus.$emit('submissionDeleted', { id: self.submission.id });
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
@import '../../../styles/_config';

.pkpListPanelItem--submission {
	.pkp_helpers_clear();
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
	&.--hasFocus {

		&:before {
			height: 100%;
			opacity: 1;
		}
	}
}

.pkpListPanelItem--submission__link {
	display: block;
}

.pkpListPanelItem--submission__item,
.pkpListPanelItem--submission__stage {
	float: left;
}

.pkpListPanelItem--submission__item {
	float: left;
	width: 65%;
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

.pkpListPanelItem--submission__title {
	font-weight: @bold;
	color: @text;
	text-decoration: none;

	&:hover,
	&:focus {
		color: @text;
	}
}

.pkpListPanelItem--submission__author {
	color: @text;
	text-decoration: none;

	&:hover,
	&:focus {
		color: @text;
	}
}

.pkpListPanelItem--submission__activity {
	margin-top: 0.5em;
	font-size: @font-tiny;
	line-height: 1.5em;
	color: @text;

	.fa {
		margin-right: 0.25em;
		font-size: @font-sml;
		color: @no;
	}
}

.pkpListPanelItem--submission__stage {
	width: 35%;
}

.pkpListPanelItem--submission__stageLabel,
.pkpListPanelItem--submission__flags {
	display: inline-block;
}

.pkpListPanelItem--submission__stageLabel {
	font-weight: @bold;
}

.pkpListPanelItem--submission__flags {
	float: right;

	> * {
		margin-left: 1em;
		color: @text-light-rgba;
	}

	.fa {
		margin-right: 0.5em;
	}

	&.--notice .fa {
		color: @primary;
	}

	&.--warning .fa {
		color: @no;
	}
}

// Reviewer-specific displays
.pkpListPanelItem--submission__stage--reviewer a {
	display: block;
	color: @text;
	text-decoration: none;
}

.pkpListPanelItem--submission__dueDate {
	float: left;
	width: 50%;
	padding-right: 1em;

	&:last-child:not(:first-child) {
		padding-left: 1em;
		padding-right: 0;
	}
}

.pkpListPanelItem--submission__dueDate:first-child:last-child {
	float: none;
	width: 100%;
	padding-right: 0;
}

.pkpListPanelItem--submission__dueDateValue {
	font-weight: @bold;
}

.pkpListPanelItem--submission__dueDateLabel {
	font-size: @font-tiny;
	line-height: @line-tiny;
}
</style>
