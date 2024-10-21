<template>
	<component
		:is="tag"
		:class="classes"
		:scope="tag === 'th' ? 'row' : false"
		:tabindex="tabindex"
	>
		<template v-if="hasSlot">
			**hasSlot**
			<slot :column="column" :row="row" />
		</template>

		<!-- column title-->
		<template v-if="column.name === 'title'">
			<a
				:href="item.urlEditorialWorkflow"
				:target="openSubmissionsInANewTab ? '_blank' : false"
			>
				<div class="listPanel__itemSubtitle">
					{{
						localizeSubmission(
							currentPublication.fullTitle,
							currentPublication.locale
						)
					}}
				</div>
			</a>
			<!-- authors -->
			<div v-if="currentPublication.authorsStringShort">
				{{ currentPublication.authorsStringShort }}
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
				<strong>{{ notice }}</strong>
				<button
					v-if="shouldAssignEditor"
					class="-linkButton"
					@click.stop.prevent="openAssignParticipant"
				>
					{{ __('submission.list.assignEditor') }}
				</button>
			</div>
		</template>

		<!-- column open discussion -->
		<template v-else-if="column.name === 'openDiscussion'">
			<div class="listPanel__item--submission__flags" aria-hidden="true">
				<span v-if="openQueryCount">
					<icon icon="comment-o" :inline="true" />
					{{ openQueryCount }}
				</span>
			</div>
		</template>
		<!-- column workflow stage -->
		<template v-else-if="column.name === 'stage'">
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
				{{ currentStageLabel }}<span v-if="isReviewStage">&nbsp;/{{ currentReviewRound }}</span>
			</badge>

			<!-- column current review round : number of reviewers, name, dateDue, status -->
			<template v-if="isReviewStage">
				<div>
					<div
						style="display: inline-block"
						v-for="reviewAssignment in currentReviewAssignments"
						:key="reviewAssignment.id"
					>
						<v-popover offset="3">
							<!-- This will be the popover target (for the events and position) -->
							<div
								class="tooltip-target b3"
								v-html="getRemainingDaysAndPercent(reviewAssignment)"
							/>

							<!-- This will be the content of the popover -->
							<template slot="popover">
								<p>
									<b>{{ reviewAssignment.fullName }}</b>
								</p>
								<template v-if="reviewAssignment.recommendation">
										<hr />
										{{ __('editor.submission.recommendation.display', {recommendation: reviewAssignment.recommendation }) }}
								</template>
								<template v-else>
									{{ __('submission.list.reviewAssignment') }}: {{ reviewAssignment.ask }}
									<br />
									{{ __('submission.list.responseDue', {date: reviewAssignment.responseDue}) }}
									<br />
									{{ __('submission.list.reviewDue', {date: reviewAssignment.due}) }}
									<br />
								</template>
								<hr />
								<p>{{ reviewAssignment.status }}</p>
								<pkp-button
									element="a"
									:target="openSubmissionsInANewTab ? '_blank' : false"
									:href="item.urlEditorialWorkflow"
								>
									{{ __('common.edit') }}
								</pkp-button>
							</template>
						</v-popover>
					</div>
				</div>
			</template>
		</template>
		<!-- column participants -->
		<template v-else-if="column.name === 'participants'">
			<ul>
				<li v-for="(participant, index) in participants" :key="index">
					{{ participant.user }}{{ participant.userGroups }}
				</li>
			</ul>
		</template>

		<!-- column submissionId - other (dates,  )-->
		<template v-else>
			<span v-html="value" />
		</template>
	</component>
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
	name: 'SubmissionTableCell',
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
		getParticipantsApiUrl: {
			type: String,
			required: true
		},
		participants: {
			type: Array,
			default() {
				return [];
			}
		},
		item: {
			type: Object,
			required: true
		},
		column: Object,
		row: Object,
		openSubmissionsInANewTab: {
			type: Boolean,
			required: true
		},
		tabindex: [Number, Boolean]
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
		 * Determine what kind of tag to use for the root element
		 */
		tag() {
			return this.column.isRowHeader ? 'th' : 'td';
		},

		/**
		 * Compile classes for the root element
		 */
		classes() {
			let classes = ['pkpTable__cell'];

			if (this.column.truncate) {
				classes.push('-truncate');
				classes.push('-truncate-' + this.column.truncate);
			}

			return classes;
		},

		/**
		 * Is there slot content in the default position?
		 */
		hasSlot() {
			return this.$slots.default;
		},

		/**
		 * The value retrieved from the row
		 */
		value() {
			if (typeof this.column.value === 'function') {
				return this.column.value(this.row);
			} else if (typeof this.row[this.column.value] !== 'undefined') {
				return this.row[this.column.value];
			}
			return '';
		},
		/**
		 * The current publication of the submission
		 *
		 * @return {Object}
		 */
		currentPublication() {
			return this.row.publications.find(
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
		 * Only stage status that have pending work for the current user should
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
					case pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND:
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
			return this.activeStage.openQueryCount;
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
		currentReviewRound() {
			if (!this.item.reviewRounds.length) {
				return 0;
			}
			return this.item.reviewRounds.length;
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
				case pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND:
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
		},

		/**
		 * Helper function to prepare a list of editors
		 * ( pkp.const.ROLE_ID_MANAGER, pkp.const.ROLE_ID_SUB_EDITOR)role with user group name
		 *
		 * @param array users: list of users from API submission getParticipants
		 * @return array [{fullName: abbrev}, ...]
		 */
		prepareEditors(users) {
			var usersList = [];
			users.forEach(user => {
				let uG = [];
				var userGroups = user['assignedAs'];
				let isEditor = false;
				userGroups.forEach(userGroup => {
					if (
						[pkp.const.ROLE_ID_MANAGER, pkp.const.ROLE_ID_SUB_EDITOR].includes(
							userGroup.roleId
						)
					) {
						isEditor = true;
						uG.push(
							this.localizeSubmission(
								userGroup.abbrev,
								this.currentPublication.locale
							)
						);
					}
				});
				if (isEditor) {
					usersList.push({user: user['fullName'], userGroups: uG});
				}
			});
			return usersList;
		},

		/**
		 * Get participants from API submission getParticipants
		 * @return array [{fullName: abbrev}, ...]
		 */
		getParticipants() {
			var url = this.getParticipantsApiUrl
				.replace('__id__', this.item.id)
				.replace('__stageId__', this.activeStage.id);
			let self = this;

			$.ajax({
				url: url,
				type: 'GET',
				_uuid: this.latestItemsGetRequest,
				error(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.participants = self.prepareEditors(r);
				},
				complete(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
				}
			});
		},
		/**
		 * Get remaining day from dateDue or dateResponseDue
		 * status REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND : not treated (TODO)
		 * @return Array("remainingDays": int, "percent": int, "color": color rgb )
		 */
		getRemainingDaysAndPercent(reviewAssignment) {
			if (
				[
					pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
					pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
					pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
					pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
				].includes(reviewAssignment.statusId)
			) {
				// waiting for a review
				var dateDue;
				if (
					[
						pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
						pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
					].includes(reviewAssignment.statusId)
				) {
					dateDue = reviewAssignment.responseDue;
				} else if (
					[
						pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
						pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
					].includes(reviewAssignment.statusId)
				) {
					dateDue = reviewAssignment.due;
				}
				// compute remaining days

				var now = Date.now();
				dateDue = Date.parse(dateDue);
				var ms = dateDue - now;
				var days = Math.round(ms / (1000 * 60 * 60 * 24));
				var dateAsked = Date.parse(reviewAssignment.ask);
				var delay = Math.round((dateDue - dateAsked) / (1000 * 60 * 60 * 24)); // days between ask and dateDue

				var percent = (100 * days) / delay;
				// try to have 0% 25% 50% 75% 100%
				percent = Math.round(percent / 25) * 25;
				switch (true) {
					case days < -3:
						return (
							'<div class="radialProgressBar red100"><div class="overlayRed">' +
							days +
							'</div></div>'
						);
					case days <= 0:
						return (
							'<div class="radialProgressBar red25"><div class="overlay">' +
							days +
							'</div></div>'
						);
					case days <= 3:
						return (
							'<div class="radialProgressBar orange25"><div class="overlay">' +
							days +
							'</div></div>'
						);
					case days > 3:
						return (
							'<div class="radialProgressBar green' +
							percent +
							'"><div class="overlay">' +
							days +
							'</div></div>'
						);
				}
			} // end waiting for a review
			else if (
				reviewAssignment.statusId == pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED
			) {
				// review has been submitted
				return '<div class="radialProgressBar green25"><div class="overlayGreen"> </div></div>';
			} else if (
				reviewAssignment.statusId == pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE
			) {
				// review has been confirmed by an editor
				return '<div class="radialProgressBar green50"><div class="overlayGreen"> </div></div>';
			} else if (
				reviewAssignment.statusId == pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED
			) {
				// reviewer has been thanked
				return '<div class="radialProgressBar green100"><div class="overlayGreen"> </div></div>';
			}
			// pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED
		}
	},
	watch: {
		/**
		 * When item change Get from API, participants to the active stage and filter on Editors
		 *
		 * @return Array
		 */
		item: function(newItem) {
			if (this.column.name == 'participants') {
				this.getParticipants();
			}
		}
	},
	mounted() {
		if (this.column.name == 'participants') {
			this.getParticipants();
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpTable__cell.-truncate {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
	max-width: 20em;
}

.pkpTable__cell.-truncate-small {
	max-width: 10em;
}

.pkpTable__cell.-truncate-large {
	max-width: 40em;
}

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

.orange25 {
	background-image: -webkit-linear-gradient(0deg, #ddd 50%, transparent 50%),
		-webkit-linear-gradient(left, orange 50%, #ddd 50%) !important;
	background-image: linear-gradient(0deg, #ddd 50%, transparent 50%),
		linear-gradient(90deg, orange 50%, #ddd 50%) !important;
}

.red25 {
	background-image: -webkit-linear-gradient(left, red 50%, transparent 50%),
		-webkit-linear-gradient(right, red 50%, #ddd 50%) !important;
	background-image: linear-gradient(90deg, red 50%, transparent 50%),
		linear-gradient(-90deg, red 50%, #ddd 50%) !important;
}

.red100 {
	background-image: -webkit-linear-gradient(0deg, #ddd 50%, transparent 50%),
		-webkit-linear-gradient(left, red 50%, #ddd 50%) !important;
	background-image: linear-gradient(0deg, #ddd 50%, transparent 50%),
		linear-gradient(90deg, red 50%, #ddd 50%) !important;
}

.green25 {
	background-image: -webkit-linear-gradient(0deg, #ddd 50%, transparent 50%),
		-webkit-linear-gradient(left, green 50%, #ddd 50%) !important;
	background-image: linear-gradient(0deg, #ddd 50%, transparent 50%),
		linear-gradient(90deg, green 50%, #ddd 50%) !important;
}

.green50 {
	background-image: -webkit-linear-gradient(right, #ddd 50%, transparent 50%),
		-webkit-linear-gradient(left, green 50%, #ddd 50%) !important;
	background-image: linear-gradient(-90deg, #ddd 50%, transparent 50%),
		linear-gradient(90deg, green 50%, #ddd 50%) !important;
}

.green75 {
	background-image: -webkit-linear-gradient(left, green 50%, transparent 50%),
		-webkit-linear-gradient(75deg, green 50%, #ddd 50%) !important;
	background-image: linear-gradient(90deg, green 50%, transparent 50%),
		linear-gradient(0deg, green 50%, #ddd 50%) !important;
}

.green100 {
	background-image: -webkit-linear-gradient(left, green 50%, transparent 50%),
		-webkit-linear-gradient(right, green 50%, #ddd 50%) !important;
	background-image: linear-gradient(90deg, green 50%, transparent 50%),
		linear-gradient(-90deg, green 50%, #ddd 50%) !important;
}

.radialProgressBar {
	border-radius: 50%;
	-webkit-transform: translate(50%, 50%);
	transform: translate(50%, 50%);
	width: 32px;
	height: 32px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	background: #ddd;
	margin: 2px;
	float: left;
}

.radialProgressBar .overlay {
	border-radius: 50%;
	width: 26px;
	height: 26px;
	margin: auto;
	background: #fff;
	text-align: center;
	padding-top: 30%;
	line-height: 6px;
}

.radialProgressBar .overlayGreen {
	border-radius: 50%;
	width: 26px;
	height: 26px;
	margin: auto;
	background: green;
	text-align: center;
	padding-top: 30%;
	line-height: 6px;
}

.radialProgressBar .overlayRed {
	border-radius: 50%;
	width: 26px;
	height: 26px;
	margin: auto;
	background: red;
	text-align: center;
	padding-top: 30%;
	line-height: 6px;
	color: white;
}

.tooltip-inner {
	background: white !important;
	color: black !important;
	box-shadow: 2px 2px 4px #222222;
}

.tooltip-inner a {
	color: #006798 !important;
}

.submissionsListPanel {
	overflow-x: auto;
}
</style>
