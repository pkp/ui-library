<template>
	<div class="listPanel__item--submission">
		<div class="listPanel__itemSummary">
			<div class="listPanel__itemIdentity listPanel__itemIdentity--submission">
				<div class="listPanel__item--submission__id">
					{{ item.id }}
				</div>
				<div class="listPanel__itemTitle">
					<span v-if="currentUserIsReviewer">
						{{ __('submission.list.reviewAssignment') }}
					</span>
					<span v-else-if="currentPublication.authorsStringShort">
						{{ currentPublication.authorsStringShort }}
					</span>
				</div>
				<div class="listPanel__itemSubtitle">
					{{
						localizeSubmission(
							currentPublication.fullTitle,
							currentPublication.locale
						)
					}}
				</div>

				<!-- Review assignment information -->
				<div
					v-if="currentUserIsReviewer"
					class="listPanel__item--submission__reviewDetails"
				>
					<span
						v-if="currentUserLatestReviewAssignment.responsePending"
						class="listPanel__item--submission__dueDate"
					>
						{{
							__('submission.list.responseDue', {
								date: currentUserLatestReviewAssignment.responseDue
							})
						}}
					</span>
					<span
						v-if="currentUserLatestReviewAssignment.reviewPending"
						class="listPanel__item--submission__dueDate"
					>
						{{
							__('submission.list.reviewDue', {
								date: currentUserLatestReviewAssignment.due
							})
						}}
					</span>
				</div>

				<!-- Warnings and notices -->
				<div
					v-if="reviewerWorkflowLink"
					class="listPanel__item--submission__notice"
				>
					<span v-html="reviewerWorkflowLink" />
				</div>
				<div v-else-if="notice" class="listPanel__item--submission__notice">
					<icon icon="exclamation-triangle" :inline="true" />
					{{ notice }}
					<button
						v-if="shouldAssignEditor"
						class="-linkButton"
						@click.stop.prevent="openAssignParticipant"
					>
						{{ __('submission.list.assignEditor') }}
					</button>
				</div>
			</div>

			<div class="listPanel__itemActions">
				<!-- Workflow stage information -->
				<div
					v-if="!currentUserIsReviewer"
					class="listPanel__item--submission__itemSummaryDetails"
				>
					<div class="listPanel__item--submission__itemSummaryDetailsRow">
						<!-- use aria-hidden on these details because the information can be
							more easily acquired by screen readers from the details panel. -->
						<div class="listPanel__item--submission__flags" aria-hidden="true">
							<span v-if="isReviewStage">
								<icon icon="user-o" :inline="true" />
								{{ completedReviewsCount }}/{{
									currentReviewAssignments.length
								}}
							</span>
							<span v-if="activeStage.files.count">
								<icon icon="file-text-o" :inline="true" />
								{{ activeStage.files.count }}
							</span>
							<span v-if="openQueryCount">
								<icon icon="comment-o" :inline="true" />
								{{ openQueryCount }}
							</span>
						</div>
						<badge
							class="listPanel__item--submission__stage"
							:isButton="!isArchived"
							:label="currentStageDescription"
							:stage="isArchived ? '' : currentStage"
							:isPrimary="isScheduled"
							:isSuccess="isPublished"
							:isWarnable="isDeclined"
							@click="filterByStage(activeStage.id)"
						>
							{{ currentStageLabel }}
						</badge>
					</div>
				</div>

				<!-- Review status -->
				<template v-else>
					<div
						v-if="currentUserLatestReviewAssignment.reviewCancelled"
						class="listPanel__item--submission__reviewCancelled"
					>
						<icon icon="exclamation-triangle" :inline="true" />
						{{ __('submission.list.reviewCancelled') }}
					</div>
					<div
						v-if="currentUserLatestReviewAssignment.reviewComplete"
						class="listPanel__item--submission__reviewComplete"
					>
						<icon icon="check" :inline="true" />
						{{ __('submission.list.reviewComplete') }}
					</div>
				</template>

				<!-- Actions -->
				<pkp-button element="a" :href="item.urlWorkflow">
					<span aria-hidden="true">{{ __('common.view') }}</span>
					<span v-if="currentUserIsReviewer" class="-screenReader">
						{{
							__('common.viewWithName', {
								name: localizeSubmission(
									currentPublication.fullTitle,
									currentPublication.locale
								)
							})
						}}
					</span>
					<span v-else class="-screenReader">
						{{
							__('common.viewWithName', {
								name: currentPublication.authorsStringShort
							})
						}}
					</span>
				</pkp-button>
				<expander
					v-if="!currentUserIsReviewer"
					:isExpanded="isExpanded"
					:itemName="currentPublication.authorsStringShort"
					@toggle="isExpanded = !isExpanded"
				/>
			</div>
		</div>

		<!-- Expanded panel -->
		<div
			v-if="isExpanded"
			class="listPanel__itemExpanded listPanel__itemExpanded--submission"
		>
			<list>
				<list-item v-if="isReviewStage">
					<template slot="value">
						<icon icon="user-o" :inline="true" />
						{{ completedReviewsCount }}/{{ currentReviewAssignments.length }}
					</template>
					{{ __('submission.list.reviewsCompleted') }}
				</list-item>
				<list-item v-if="!isSubmissionStage">
					<template slot="value">
						<icon icon="file-text-o" :inline="true" />
						{{ activeStage.files.count }}
					</template>
					{{ activeStageFilesLabel }}
				</list-item>
				<list-item v-if="!item.submissionProgress">
					<template slot="value">
						<icon icon="comment-o" :inline="true" />
						{{ openQueryCount }}
					</template>
					{{ __('submission.list.discussions') }}
				</list-item>
				<list-item v-if="dualWorkflowLinks">
					<span v-html="dualWorkflowLinks" />
				</list-item>
				<list-item>
					<span>
						{{
							__('common.lastActivity', {
								date: localizeDate(item.dateLastActivity)
							})
						}}
					</span>
				</list-item>
			</list>
			<div class="listPanel__itemExpandedActions">
				<pkp-button v-if="currentUserCanViewInfoCenter" @click="openInfoCenter">
					{{ __('submission.list.infoCenter') }}
				</pkp-button>
				<pkp-button
					v-if="currentUserCanDelete"
					:isWarnable="true"
					@click="deleteSubmissionPrompt"
				>
					{{ __('common.delete') }}
				</pkp-button>
			</div>
		</div>
	</div>
</template>

<script>
import Expander from '@/components/Expander/Expander.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import ajaxError from '@/mixins/ajaxError';
import fetch from '@/mixins/fetch';
import localizeSubmission from '@/mixins/localizeSubmission';
import dialog from '@/mixins/dialog';

export default {
	name: 'SubmissionsListItem',
	mixins: [ajaxError, fetch, localizeSubmission, dialog],
	components: {
		Expander,
		List,
		ListItem
	},
	props: {
		apiUrl: {
			type: String,
			required: true
		},
		assignParticipantUrl: {
			type: String,
			required: true
		},
		infoUrl: {
			type: String,
			required: true
		},
		item: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			isExpanded: false,
			mask: null,
			noticeActions: [],
			noticeActionLabels: []
		};
	},
	computed: {
		/**
		 * The current publication of the submission
		 *
		 * @return {Object}
		 */
		currentPublication() {
			return this.item.publications.find(
				publication => publication.id === this.item.currentPublicationId
			);
		},

		/**
		 * Can the current user delete this submission?
		 *
		 * @return {Boolean}
		 */
		currentUserCanDelete() {
			if (
				!this.userAssignedRole(pkp.const.ROLE_ID_AUTHOR) &&
				this.userAssignedRole([
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN
				]) &&
				this.item.status === pkp.const.STATUS_DECLINED
			) {
				return true;
			} else if (
				this.userAssignedRole(pkp.const.ROLE_ID_AUTHOR) &&
				this.item.submissionProgress !== 0
			) {
				return true;
			}
			return false; // @todo
		},

		/**
		 * Can the current user view the info center?
		 *
		 * @return {Boolean}
		 */
		currentUserCanViewInfoCenter() {
			return this.userAssignedRole([
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR
			]);
		},

		/**
		 * Is the current user a reviewer on this submission?
		 *
		 * @return {Boolean}
		 */
		currentUserIsReviewer() {
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
		 * @return {Array}
		 */
		activeStage() {
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
		 * @return {String}
		 */
		notice() {
			var notice = '';

			// Incomplete submissions should not show notices
			if (this.item.submissionProgress > 0) {
				return notice;
			}

			// Notices for journal managers
			if (this.shouldAssignEditor) {
				notice = this.activeStage.status;
			}

			// Notices for journal managers and subeditors
			if (
				this.userAssignedRole([
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SUB_EDITOR
				])
			) {
				if (this.isReviewStage) {
					switch (this.activeStage.statusId) {
						case pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS:
						case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_READY:
						case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED:
						case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE:
						case pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED:
						case pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED:
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
			if (this.userAssignedRole(pkp.const.ROLE_ID_AUTHOR)) {
				if (this.isReviewStage) {
					switch (this.activeStage.statusId) {
						case pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED:
						case pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW:
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
		 * Does this submission need an editor assigned and can the current user
		 * assign one?
		 *
		 * @return {Boolean}
		 */
		shouldAssignEditor() {
			return (
				this.userAssignedRole(pkp.const.ROLE_ID_MANAGER) &&
				this.activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION &&
				this.activeStage.statusId ===
					pkp.const.STAGE_STATUS_SUBMISSION_UNASSIGNED
			);
		},

		/**
		 * Get the current stage to pass to pkpBadge
		 *
		 * @return {String}
		 */
		currentStage() {
			switch (this.activeStage.id) {
				case pkp.const.WORKFLOW_STAGE_ID_SUBMISSION:
					return 'submission';
				case pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW:
				case pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW:
					return 'review';
				case pkp.const.WORKFLOW_STAGE_ID_EDITING:
					return 'copyediting';
				case pkp.const.WORKFLOW_STAGE_ID_PRODUCTION:
					return 'production';
			}
			return '';
		},

		/**
		 * Get the label for the current stage
		 *
		 * @return {String}
		 */
		currentStageLabel() {
			if (this.isArchived) {
				return this.item.statusLabel;
			} else if (this.item.submissionProgress > 0) {
				return this.__('submissions.incomplete');
			}
			return this.activeStage.label;
		},

		/**
		 * Get an a11y description for the current stage badge
		 *
		 * @return {String}
		 */
		currentStageDescription() {
			return this.__('submission.list.currentStage', {
				stage: this.currentStageLabel
			});
		},

		/**
		 * Has this submission been archived?
		 *
		 * @return {Boolean}
		 */
		isArchived() {
			return (
				this.item.status === pkp.const.STATUS_SCHEDULED ||
				this.item.status === pkp.const.STATUS_PUBLISHED ||
				this.item.status === pkp.const.STATUS_DECLINED
			);
		},

		/**
		 * Has this submission been declined?
		 *
		 * @return {Boolean}
		 */
		isDeclined() {
			return this.item.status === pkp.const.STATUS_DECLINED;
		},

		/**
		 * Has this submission been scheduled for publication
		 *
		 * @return {Boolean}
		 */
		isScheduled() {
			return this.item.status === pkp.const.STATUS_SCHEDULED;
		},

		/**
		 * Has this submission been published
		 *
		 * @return {Boolean}
		 */
		isPublished() {
			return this.item.status === pkp.const.STATUS_PUBLISHED;
		},

		/**
		 * Compile the count of open discussions
		 *
		 * @return {Number}
		 */
		openQueryCount() {
			return this.activeStage.queries.filter(query => {
				return !query.closed;
			}).length;
		},

		/**
		 * Determine the correct label for the count of files based on the active
		 * stage.
		 *
		 * @return {String}
		 */
		activeStageFilesLabel() {
			switch (this.activeStage.id) {
				case pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW:
				case pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW:
					return this.__('submission.list.revisionsSubmitted');
				case pkp.const.WORKFLOW_STAGE_ID_EDITING:
					return this.__('submission.list.copyeditsSubmitted');
				case pkp.const.WORKFLOW_STAGE_ID_PRODUCTION:
					return this.__('submission.list.galleysCreated');
			}
			return '';
		},

		/**
		 * Is this the submission stage?
		 *
		 * @return {Boolean}
		 */
		isSubmissionStage() {
			return this.activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION;
		},

		/**
		 * Is this the review stage?
		 *
		 * @return {Boolean}
		 */
		isReviewStage() {
			return (
				this.activeStage.id === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW ||
				this.activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
			);
		},

		/**
		 * Retrieve all role assignments for any stage
		 *
		 * @return {Array}
		 */
		currentRoleAssignments() {
			let roles = [];
			this.item.stages.forEach(stage => {
				stage.currentUserAssignedRoles.forEach(role => {
					if (roles.indexOf(role) === -1) {
						roles.push(role);
					}
				});
			});
			return roles;
		},

		/**
		 * If the user is assigned to more than one role, and has access to both the
		 * editorial and author dashboards, provide a description and links to both.
		 *
		 * @return {String}
		 */
		dualWorkflowLinks() {
			if (
				!this.userAssignedRole(pkp.const.ROLE_ID_AUTHOR) ||
				!this.userAssignedRole([
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_ASSISTANT
				])
			) {
				return '';
			}
			return this.__('submission.list.dualWorkflowLinks', {
				urlAuthorWorkflow: this.item.urlAuthorWorkflow,
				urlEditorialWorkflow: this.item.urlEditorialWorkflow
			});
		},

		/**
		 * If the user is assigned as a reviewer, but also to an editorial role,
		 * provide a description and link to the editorial workflow.
		 *
		 * @return {String}
		 */
		reviewerWorkflowLink() {
			if (
				!this.currentUserIsReviewer ||
				!this.userAssignedRole([
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_ASSISTANT
				])
			) {
				return '';
			}
			return this.__('submission.list.reviewerWorkflowLink', {
				urlEditorialWorkflow: this.item.urlEditorialWorkflow
			});
		},

		/**
		 * Retrieve the review assignments for the latest review round
		 *
		 * @return {Array}
		 */
		currentReviewAssignments() {
			if (
				!this.item.reviewRounds.length ||
				!this.item.reviewAssignments.length
			) {
				return [];
			}
			var currentReviewRoundId = this.item.reviewRounds[
				this.item.reviewRounds.length - 1
			].id;
			return this.item.reviewAssignments.filter(assignment => {
				return assignment.roundId === currentReviewRoundId;
			});
		},

		/**
		 * The current user's latest review assignment. This retrieves the
		 * review assignment from the latest round if available, or any other
		 * round if not available.
		 *
		 * @return {Object|Boolean} False if no review assignment exists
		 */
		currentUserLatestReviewAssignment() {
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
				return prev.round > current.round ? prev : current;
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
		 * @return {Number}
		 */
		completedReviewsCount() {
			if (!this.isReviewStage) {
				return 0;
			}
			return this.currentReviewAssignments.filter(review => {
				return review.statusId >= pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED;
			}).length;
		}
	},
	methods: {
		/**
		 * Check if a user is assigned a given role on this submission. If no
		 * assignments exist, match global roles for site admin and manager
		 *
		 * @param {Number|Array} roles
		 */
		userAssignedRole: function(roles) {
			if (!Array.isArray(roles)) {
				roles = [roles];
			}
			if (this.currentRoleAssignments.length) {
				return roles.some(role => {
					return this.currentRoleAssignments.includes(role);
				});
			} else {
				var managerRoles = roles.filter(role => {
					return (
						role === pkp.const.ROLE_ID_SITE_ADMIN ||
						role === pkp.const.ROLE_ID_MANAGER
					);
				});
				if (managerRoles.length) {
					return this.userHasRole(managerRoles);
				}
			}
			return false;
		},

		/**
		 * Filter by a submission stage
		 *
		 * @param {Number} stageId
		 */
		filterByStage: function(stageId) {
			this.$emit('addFilter', 'stageIds', stageId);
		},

		/**
		 * Load a modal displaying history and notes of a submission
		 */
		openInfoCenter() {
			var opts = {
				title: this.localizeSubmission(
					this.currentPublication.fullTitle,
					this.currentPublication.locale
				),
				url: this.infoUrl.replace('__id__', this.item.id),
				closeCallback: this.resetFocusInfoCenter
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Reset the focus on the info center link when the modal has been
		 * closed. This is a callback function passed into ModalHandler.js
		 */
		resetFocusInfoCenter() {
			this.$el.querySelector('.listPanel__item__openInfoCenter').focus();
		},

		/**
		 * Load a modal displaying the assign participant options
		 */
		openAssignParticipant() {
			var opts = {
				title: this.__('submission.list.assignEditor'),
				url: this.assignParticipantUrl
					.replace('__id__', this.item.id)
					.replace('__stageId__', this.activeStage.id),
				closeCallback: this.resetFocusAssignParticipant
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>'
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Reset the focus on the assign participant button when the modal has been
		 * closed. This is a callback function passed into ModalHandler.js
		 */
		resetFocusAssignParticipant() {
			this.$el
				.querySelector('.listPanel__item--submission__notice button')
				.focus();
		},

		/**
		 * Display a confirmation prompt before deleting a submission
		 */
		deleteSubmissionPrompt() {
			this.openDialog({
				name: 'deleteSubmission',
				title: this.__('common.delete'),
				message: this.__('editor.submissionArchive.confirmDelete'),
				actions: [
					{
						label: this.__('common.yes'),
						isPrimary: true,
						callback: this.deleteSubmission
					},
					{
						label: this.__('common.no'),
						isWarnable: true,
						callback: () => this.$modal.hide('deleteSubmission')
					}
				]
			});
		},

		/**
		 * Send a request to delete the submission and handle the response
		 */
		deleteSubmission() {
			var self = this;
			$.ajax({
				url: this.apiUrl + '/' + this.item.id,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE'
				},
				error: this.ajaxErrorCallback,
				success() {
					pkp.eventBus.$emit('deleted:submission', {id: self.item.id});
				},
				complete() {
					self.$modal.hide('deleteSubmission');
				}
			});
		},

		/**
		 * Helper function to determine if the current user has a role
		 *
		 * @param int|array roles The role ID to look for (pkp.const.ROLE_ID...)
		 * @return bool
		 */
		userHasRole(roles) {
			if (!Array.isArray(roles)) {
				roles = [roles];
			}

			var hasRole = false;
			roles.forEach(role => {
				if (pkp.currentUser.roles.indexOf(role) > -1) {
					hasRole = true;
				}
			});

			return hasRole;
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.listPanel__itemIdentity--submission,
.listPanel__itemExpanded--submission {
	padding-left: 2.5rem;
}

.listPanel__item--submission__id {
	position: absolute;
	top: 0;
	left: 0;
	font-size: @font-tiny;
	line-height: 22px; // Match baseline of title
	color: @text;
}

.listPanel__item--submission__title,
.listPanel__item--submission__author,
.listPanel__item--submission__notice {
	display: block;
	padding-right: 2em;
}

.listPanel__item--submission__author {
	font-weight: @bold;
}

.listPanel__item--submission__notice,
.listPanel__item--submission__reviewerWorkflowLink {
	margin-top: 0.5em;
	font-size: @font-tiny;
	line-height: 1.5em;
	color: @text;

	.fa {
		font-size: @font-sml;
		color: @no;
	}
}

.listPanel__item--submission__notice {
	.-linkButton:not(:last-child) {
		margin-right: 0.5em;
	}
}

.listPanel__item--submission__flags {
	display: inline-block;
	font-size: @font-tiny;
	line-height: 1.5em;

	> * {
		margin-right: 1em;
	}

	.fa {
		margin-right: 0.25em;
		font-size: @font-sml;
		color: @text-light-rgba;
	}
}

.listPanel__item--submission__stage {
	margin-left: 0.5rem;
	margin-right: 0.25rem;
}

.listPanel__itemExpanded--submission {
	margin-top: 1rem;
}

.listPanel__item--submission__reviewDetails {
	margin-top: 0.25em;
	font-size: @font-tiny;
	line-height: 1.5em;
}

.listPanel__item--submission__dueDate {
	margin-right: 1rem;
}

.listPanel__item--submission__reviewComplete .fa {
	color: @yes;
}

[dir='rtl'] {
	.listPanel__itemIdentity--submission {
		padding-left: 0rem;
		padding-right: 2.5rem;
	}

	.listPanel__item--submission__id {
		position: absolute;
		left: auto;
		right: 0;
		text-align: left;
	}
}
</style>
