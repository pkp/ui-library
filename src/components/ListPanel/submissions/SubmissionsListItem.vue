<template>
	<div class="pkpListPanelItem--submission -hasSummary" :class="classes">
		<div class="pkpListPanelItem__summary -pkpClearfix">
			<a :href="item.urlWorkflow" class="pkpListPanelItem--submission__link">
				<div class="pkpListPanelItem--submission__item">
					<div class="pkpListPanelItem--submission__id">
						<span class="-screenReader">{{ i18n.id }}</span>
						{{ item.id }}
					</div>
					<div
						v-if="item.authorString"
						class="pkpListPanelItem--submission__author"
					>
						{{ item.authorString }}
					</div>
					<div class="pkpListPanelItem--submission__title">
						{{ localizeSubmission(item.fullTitle, item.locale) }}
					</div>
					<div
						v-if="reviewerWorkflowLink"
						class="pkpListPanelItem--submission__reviewerWorkflowLink"
					>
						<span v-html="reviewerWorkflowLink" />
					</div>
					<div
						v-else-if="notice"
						class="pkpListPanelItem--submission__activity"
					>
						<icon icon="exclamation-triangle" :inline="true" />
						{{ notice }}
						<button
							v-for="(noticeAction, index) in noticeActions"
							:key="index"
							class="-linkButton"
							@click.stop.prevent="noticeAction"
						>
							{{ noticeActionLabels[index] }}
						</button>
					</div>
				</div>
			</a>
			<div
				v-if="currentUserIsReviewer"
				class="pkpListPanelItem--submission__stage pkpListPanelItem--submission__stage--reviewer"
			>
				<a :href="item.urlWorkflow" tabindex="-1">
					<div
						v-if="currentUserLatestReviewAssignment.responsePending"
						class="pkpListPanelItem--submission__dueDate"
					>
						<div
							:aria-labelledby="responseDueLabelId"
							class="pkpListPanelItem--submission__dueDateValue"
						>
							{{ currentUserLatestReviewAssignment.responseDue }}
						</div>
						<div
							:id="responseDueLabelId"
							class="pkpListPanelItem--submission__dueDateLabel"
						>
							{{ i18n.responseDue }}
						</div>
					</div>
					<div
						v-if="currentUserLatestReviewAssignment.reviewPending"
						class="pkpListPanelItem--submission__dueDate"
					>
						<div
							:aria-labelledby="reviewDueLabelId"
							class="pkpListPanelItem--submission__dueDateValue"
						>
							{{ currentUserLatestReviewAssignment.due }}
						</div>
						<div
							:id="reviewDueLabelId"
							class="pkpListPanelItem--submission__dueDateLabel"
						>
							{{ i18n.reviewDue }}
						</div>
					</div>
					<div
						v-if="currentUserLatestReviewAssignment.reviewCancelled"
						class="pkpListPanelItem--submission__reviewCancelled"
					>
						<icon icon="exclamation-triangle" :inline="true" />
						{{ i18n.reviewCancelled }}
					</div>
					<div
						v-if="currentUserLatestReviewAssignment.reviewComplete"
						class="pkpListPanelItem--submission__reviewComplete"
					>
						<icon icon="check" :inline="true" />
						{{ i18n.reviewComplete }}
					</div>
				</a>
			</div>
			<div v-else class="pkpListPanelItem--submission__stage">
				<div class="pkpListPanelItem--submission__stageRow">
					<badge
						isButton="true"
						:label="currentStageDescription"
						:stage="currentStage"
						@click="filterByStage(activeStage.id)"
					>
						{{ currentStageLabel }}
					</badge>
					<!-- use aria-hidden on these details because the information can be
						more easily acquired by screen readers from the details panel. -->
					<div class="pkpListPanelItem--submission__flags" aria-hidden="true">
						<span
							v-if="isReviewStage"
							class="pkpListPanelItem--submission__flags--reviews"
						>
							<icon icon="user-o" :inline="true" />
							{{ completedReviewsCount }}/{{ currentReviewAssignments.length }}
						</span>
						<span
							v-if="activeStage.files.count"
							class="pkpListPanelItem--submission__flags--files"
						>
							<icon icon="file-text-o" :inline="true" />
							{{ activeStage.files.count }}
						</span>
						<span
							v-if="openQueryCount"
							class="pkpListPanelItem--submission__flags--discussions"
						>
							<icon icon="comment-o" :inline="true" />
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
				<icon v-if="isExpanded" icon="angle-up" />
				<icon v-else icon="angle-down" />
				<span v-if="isExpanded" class="-screenReader">
					{{ __('viewLess', {name: item.authorString}) }}
				</span>
				<span v-else class="-screenReader">
					{{ __('viewMore', {name: item.authorString}) }}
				</span>
			</button>
		</div>
		<div
			v-if="isExpanded"
			class="pkpListPanelItem__details pkpListPanelItem__details--submission"
		>
			<list v-if="!item.submissionProgress">
				<list-item v-if="isReviewStage">
					<template slot="value">
						<icon icon="user-o" :inline="true" />
						{{ completedReviewsCount }}/{{ currentReviewAssignments.length }}
					</template>
					{{ i18n.reviewsCompleted }}
				</list-item>
				<list-item v-if="!isSubmissionStage">
					<template slot="value">
						<icon icon="file-text-o" :inline="true" />
						{{ activeStage.files.count }}
					</template>
					{{ activeStageFilesLabel }}
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="comment-o" :inline="true" />
						{{ openQueryCount }}
					</template>
					{{ i18n.discussions }}
				</list-item>
				<list-item v-if="dualWorkflowLinks">
					<span v-html="dualWorkflowLinks" />
				</list-item>
			</list>
			<div class="pkpListPanelItem__actions">
				<pkp-button
					element="a"
					:href="item.urlWorkflow"
					:label="i18n.viewSubmission"
				/>
				<pkp-button
					v-if="currentUserCanViewInfoCenter"
					:label="i18n.infoCenter"
					@click="openInfoCenter"
				/>
				<pkp-button
					v-if="currentUserCanDelete"
					:label="i18n.delete"
					:isWarnable="true"
					@click="deleteSubmissionPrompt"
				/>
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
	</div>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import LocalizeSubmission from '@/mixins/localizeSubmission.js';

export default {
	extends: ListPanelItem,
	name: 'SubmissionsListItem',
	mixins: [LocalizeSubmission],
	components: {
		List,
		ListItem,
		Badge,
		PkpButton,
		Icon
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
		csrfToken: {
			type: String,
			required: true
		},
		infoUrl: {
			type: String,
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
		 * Map the submission id to the list item id
		 */
		id() {
			return this.item.id;
		},

		/**
		 * Can the current user delete a submission?
		 *
		 * @return {Boolean}
		 */
		currentUserCanDelete() {
			if (
				!this.userAssignedRole(pkp.const.ROLE_ID_AUTHOR) &&
				this.userAssignedRole([
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN
				])
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
			if (this.item.status === 3 || this.item.status === 4) {
				return this.item.statusLabel;
			} else if (this.item.submissionProgress > 0) {
				return this.i18n.incomplete;
			}
			return this.activeStage.label;
		},

		/**
		 * Get an a11y description for the current stage badge
		 *
		 * @return {String}
		 */
		currentStageDescription() {
			return this.__('currentStage', {stage: this.currentStageLabel});
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
			return this.__('dualWorkflowLinks', {
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
			return this.__('reviewerWorkflowLink', {
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
		},

		/**
		 * Return a class to toggle the item mask
		 *
		 * @return {String}
		 */
		classMask() {
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
		 * @return {String}
		 */
		responseDueLabelId() {
			return 'responseDueLabel' + this._uid;
		},

		/**
		 * ID attribute to use in aria-labelledby linking the review due date
		 * with it's label
		 *
		 * @return {String}
		 */
		reviewDueLabelId() {
			return 'reviewDueLabel' + this._uid;
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
					return pkp.userHasRole(managerRoles);
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
				title: this.item.title,
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
			this.$el.querySelector('.pkpListPanelItem__openInfoCenter').focus();
		},

		/**
		 * Load a modal displaying the assign participant options
		 */
		openAssignParticipant() {
			var opts = {
				title: this.i18n.assignEditor,
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
				.querySelector('.pkpListPanelItem--submission__activity button')
				.focus();
		},

		/**
		 * Display a confirmation prompt before deleting a submission
		 */
		deleteSubmissionPrompt() {
			this.mask = 'confirmingDelete';
		},

		/**
		 * Send a request to delete the submission and handle the response
		 */
		deleteSubmission() {
			this.mask = 'deleting';

			var self = this;
			$.ajax({
				url: this.apiUrl + '/' + this.item.id,
				type: 'DELETE',
				headers: {
					'X-Csrf-Token': this.csrfToken
				},
				error: this.ajaxErrorCallback,
				success() {
					self.mask = 'finish';
					// Allow time for the finished CSS transition to display
					setTimeout(function() {
						pkp.eventBus.$emit('submissionDeleted', {id: self.item.id});
						self.cancelDeleteRequest();
					}, 300);
				},
				complete() {
					// Reset the mask in case there is an error
					if (self.mask === 'deleting') {
						self.cancelDeleteRequest();
					}
				}
			});
		},

		/**
		 * Cancel the delete request
		 */
		cancelDeleteRequest() {
			this.mask = null;
		}
	},
	watch: {
		/**
		 * When the notice changes, update the actions that are available
		 */
		notice: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.noticeActions = [];
			this.noticeActionLabels = [];
			if (this.shouldAssignEditor) {
				this.noticeActions.push(this.openAssignParticipant);
				this.noticeActionLabels.push(this.i18n.assignEditor);
			}
		}
	}
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
		left: 0;
		width: 0.1rem;
		height: 25%;
		background: @primary;
		opacity: 0;
		transition: height 0.3s;
		transform: translateY(-50%);
	}

	&:hover {
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

	&:focus {
		outline: 0;

		&:before {
			height: 100%;
			opacity: 1;
		}
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
	padding-left: 4rem;
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
}

.pkpListPanelItem--submission__author {
	font-weight: @bold;
}

.pkpListPanelItem--submission__activity,
.pkpListPanelItem--submission__reviewerWorkflowLink {
	margin-top: 0.5em;
	font-size: @font-tiny;
	line-height: 1.5em;
	color: @text;

	.fa {
		font-size: @font-sml;
		color: @no;
	}
}

.pkpListPanelItem--submission__activity {
	.-linkButton:not(:last-child) {
		margin-right: 0.5em;
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

.pkpListPanelItem--submission__dueDate
	+ .pkpListPanelItem--submission__dueDate {
	margin-top: 1em;
}

.pkpListPanelItem--submission__dueDateValue {
	font-weight: @bold;
}

.pkpListPanelItem--submission__dueDateLabel {
	font-size: @font-tiny;
	line-height: @line-tiny;
}

.pkpListPanelItem--submission__reviewComplete .fa {
	color: @yes;
}
</style>
