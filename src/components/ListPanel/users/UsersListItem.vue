<template>
	<li class="pkpListPanelItem pkpListPanelItem--user pkpListPanelItem--hasSummary">
		<div class="pkpListPanelItem__summary">
			<div class="pkpListPanelItem__item--users__item -pkpClearfix">
				<div class="pkpListPanelItem--user__identity">
					<badge v-if="item.disabled" :isWarnable="true">
						{{ i18n.disabled }}
					</badge>
					<span class="pkpListPanelItem--user__fullName">{{ item.fullName }}</span>
					<a v-if="item.orcid" :href="item.orcid" class="pkpListPanelItem--user__orcid">
						<icon icon="orcid" :inline="true" />
						<span class="-screenReader">{{ i18n.orcid }}</span>
					</a>
					<template v-if="!mergeUserSourceId">
						<a
							v-if="currentUserIsLoggedInAs"
							class="pkpListPanelItem__inlineLink pkpListPanelItem__inlineLink--logout"
							:href="logoutAsUrl"
						>
							<icon icon="sign-out" :inline="true" />
							{{ i18n.logoutAs }}
						</a>
						<a
							v-else-if="currentUserCanLoginAs"
							class="pkpListPanelItem__inlineLink"
							:href="loginAsUrlWithId"
						>
							<icon icon="sign-in" :inline="true" />
							{{ i18n.loginAs }}
						</a>
					</template>
					<div class="pkpListPanelItem--user__email">{{ item.email }}</div>
				</div>
				<div
					v-if="!mergeUserSourceId"
					class="pkpListPanelItem--user__userGroups"
				>
					<badge
						v-for="group in userGroups"
						:key="group.id"
						:isPrimary="isRolePrimary(group.roleId)"
					>
						<span v-if="group.context" class="pkpListPanelItem--user__userGroupContext">
							{{ group.context }}
						</span>
						{{ group.name}}
					</badge>
				</div>
				<span v-else-if="isMergingIntoThisUser" class="pkpSpinner pkpListPanelItem__pkpSpinner" aria-hidden="true"></span>
				<pkp-button
					v-else-if="!isMergingFromThisUser && (!isLoadingMerge || isMergingIntoThisUser)"
					:label="i18n.mergeIntoUser"
					class="pkpListPanelItem--user__mergeButton"
					@click="mergeUser"
				/>
			</div>
			<button
				v-if="!mergeUserSourceId && (item.orcid || item.currentUserCanAdminister)"
				@click="toggleExpanded"
				class="pkpListPanelItem__expander"
			>
				<icon v-if="isExpanded" icon="angle-up" />
				<icon v-else icon="angle-down" />
				<span v-if="isExpanded" class="-screenReader">{{ __('viewLess', {name: item.fullName}) }}</span>
				<span v-else class="-screenReader">{{ __('viewMore', {name: item.fullName}) }}</span>
			</button>
		</div>
		<div
			v-if="isExpanded"
			class="pkpListPanelItem__details pkpListPanelItem__details--user"
		>
			<list v-if="item.orcid || currentUserCanLoginAs">
				<list-item v-if="item.orcid">
					<icon icon="orcid" :inline="true" />
					<a :href="item.orcid">
						{{ item.orcid }}
					</a>
				</list-item>
				<list-item v-if="currentUserCanLoginAs">
					{{ __('loginAsDescription', {userName: item.userName}) }}
					<icon icon="sign-in" :inline="true" />
					<a :href="loginAsUrlWithId">{{ i18n.loginAs }}</a>
				</list-item>
			</list>
			<div
				v-if="item.currentUserCanAdminister"
				class="pkpListPanelItem--user__actions"
			>
				<pkp-button
					:id="getUniqueId('sendEmail')"
					:label="i18n.sendEmail"
					@click="openSendEmail"
				/>
				<pkp-button
					:id="getUniqueId('editUser')"
					:label="i18n.editUser"
					@click="openEditUser"
				/>
				<pkp-button
					v-if="filters.contextIds"
					:id="getUniqueId('assignUser')"
					:label="i18n.assignUser"
					@click="openAssignUser"
				/>
				<pkp-button
					v-if="item.disabled"
					:id="getUniqueId('enableUser')"
					:label="i18n.enableUser"
					@click="openEnableUser"
				/>
				<pkp-button
					v-else
					:id="getUniqueId('disableUser')"
					:label="i18n.disableUser"
					:isWarnable="true"
					@click="openDisableUser"
				/>
				<pkp-button
					:id="getUniqueId('removeUser')"
					:label="i18n.removeUser"
					:isWarnable="true"
					@click="openRemoveUser"
				/>
				<pkp-button
					v-if="item.id !== 1"
					:id="getUniqueId('mergeUser')"
					:label="i18n.mergeUser"
					:isWarnable="true"
					@click="openMergeUser"
				/>
			</div>
		</div>
	</li>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import openOldModal from '@/mixins/openOldModal';

export default {
	extends: ListPanelItem,
	name: 'UsersListItem',
	mixins: [openOldModal],
	components: {
		List,
		ListItem,
		Badge,
		PkpButton,
		Icon,
	},
	props: [
		'userListId',
		'isSiteAdmin',
		'isLoadingMerge',
		'mergeUserSourceId',
		'mergeUserTargetId',
		'filters',
		'activeFilters',
		'item',
		'i18n',
		'loginAsUrl',
		'logoutAsUrl',
		'sendEmailUrl',
		'sendEmailUrl',
		'editUserUrl',
		'assignUserUrl',
		'enableUserUrl',
		'disableUserUrl',
		'removeUserUrl',
		'mergeUserUrl',
	],
	data: function () {
		return {
			isExpanded: false,
		};
	},
	computed: {
		/**
		 * Create user-specific URL for logging in as
		 *
		 * @return string
		 */
		loginAsUrlWithId: function () {
			return this.loginAsUrl.replace('__id__', this.item.id);
		},

		/**
		 * Can the current user login as this user?
		 *
		 * @return string
		 */
		currentUserCanLoginAs: function () {
			return this.item.currentUserCanAdminister && $.pkp.currentUser.id !== this.item.id;
		},

		/**
		 * Is the current user logged in as this user?
		 *
		 * @return string
		 */
		currentUserIsLoggedInAs: function () {
			return $.pkp.currentUser.isLoggedInAs && $.pkp.currentUser.id === this.item.id;
		},

		/**
		 * Is the current user a site admin?
		 *
		 * @return string
		 */
		currentUserIsSiteAdmin: function () {
			return pkp.userHasRole(pkp.const.ROLE_ID_SITE_ADMIN);
		},

		/**
		 * Compile a list of user group names. Identify group context when in site
		 * admin and context filters exist.
		 *
		 * @return array
		 */
		userGroups: function () {
			let groups = {...this.item.groups};

			groups = this.item.groups.map((group) => {
				let contextName = '';
				if (this.isSiteAdmin && this.filters.contextIds) {
					let context = this.filters.contextIds.filters.find((context) => {
						return context.val === group.contextId;
					});
					contextName = context ? context.acronym : '';
				}
				return {
					id: group.id,
					name: this.localize(group.name),
					context: contextName,
					roleId: group.roleId,
				};
			});

			return groups;
		},

		/**
		 * Is true when waiting for a merge request to return from the server, and
		 * the merge request is merging into this user.
		 *
		 * @return boolean
		 */
		isMergingIntoThisUser: function () {
			return this.isLoadingMerge && this.item.id === this.mergeUserTargetId;
		},

		/**
		 * Is true when this user list is for merging users, and this user is the
		 * user that is being merged into another user.
		 *
		 * @return boolean
		 */
		isMergingFromThisUser: function () {
			return this.item.id === this.mergeUserSourceId;
		},
	},
	methods: {
		/**
		 * Create an element ID that's unique to this item
		 *
		 * @param string name A name for the element to assign an ID to
		 * @return string
		 */
		getUniqueId: function (elName) {
			return elName + this.userListId + this.item.id;
		},

		/**
		 * Should a given role ID be identified as a primary role?
		 *
		 * @param int roleId
		 */
		isRolePrimary: function (roleId) {
			return [pkp.const.ROLE_ID_SITE_ADMIN, pkp.const.ROLE_ID_MANAGER].includes(roleId);
		},

		/**
		 * Open a modal to send email to user
		 */
		openSendEmail: function () {
			this.openOldModal({
				title: this.i18n.sendEmail,
				url: this.sendEmailUrl.replace('__id__', this.item.id),
				closeCallback: this.setFocusCallback('#' + this.getUniqueId('sendEmail')),
			});
		},

		/**
		 * Open a modal to edit the user details
		 */
		openEditUser: function () {
			this.openOldModal({
				title: this.i18n.editUser,
				url: this.editUserUrl.replace('__id__', this.item.id),
				closeCallback: this.setFocusCallback('#' + this.getUniqueId('editUser')),
			});
		},

		/**
		 * Open a modal to assign the user groups
		 */
		openAssignUser: function () {
			this.openOldModal({
				title: this.i18n.assignUser,
				url: this.assignUserUrl.replace('__id__', this.item.id),
				closeCallback: this.setFocusCallback('#' + this.getUniqueId('assignUser')),
			});
		},

		/**
		 * Open a modal to enable the user
		 */
		openEnableUser: function () {
			this.openOldModal({
				title: this.i18n.enableUser,
				url: this.enableUserUrl.replace('__id__', this.item.id),
				closeCallback: this.setFocusCallback('#' + this.getUniqueId('enableUser')),
			});
		},

		/**
		 * Open a modal to disable the user
		 */
		openDisableUser: function () {
			this.openOldModal({
				title: this.i18n.disableUser,
				url: this.disableUserUrl.replace('__id__', this.item.id),
				closeCallback: this.setFocusCallback('#' + this.getUniqueId('disableUser')),
			});
		},

		/**
		 * Open a confirmation modal before removing a user's role from a journal
		 */
		openRemoveUser: function () {
			this.openOldModal({
				title: this.i18n.removeUser,
				okButton: this.i18n.confirm,
				cancelButton: this.i18n.cancel,
				dialogText: this.i18n.removeUserConfirmation,
				closeCallback: this.setFocusCallback('#' + this.getUniqueId('removeUser')),
				remoteAction: this.removeUserUrl.replace('__id__', this.item.id),
			}, '$.pkp.controllers.modal.RemoteActionConfirmationModalHandler');
		},

		/**
		 * Open a modal to merge the user with another user
		 */
		openMergeUser: function () {
			this.openOldModal({
				title: this.i18n.mergeUser,
				url: this.mergeUserUrl.replace(new RegExp('__id__', 'g'), this.item.id),
				closeCallback: this.setFocusCallback('#' + this.getUniqueId('mergeUser')),
			});
		},

		/**
		 * Emit an event to trigger user merging
		 */
		mergeUser: function () {
			this.$emit('mergeUser', this.item.id);
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpListPanelItem--user__identity {

	@media (min-width: 768px) {
		float: left;
		max-width: 50%;
	}
}

.pkpListPanelItem--user__fullName {
	display: inline-block;
	font-weight: @bold;
}

.pkpListPanelItem--user__orcid {
	margin-left: 0.25em;
	text-decoration: none;
}

.pkpListPanelItem--user__email {
	font-size: @font-sml;
	line-height: 1.5em;
}

.pkpListPanelItem--user__mergeButton,
.pkpListPanelItem__pkpSpinner {
	position: absolute;
	top: 50%;
	right: 1rem;
	transform: translateY(-50%);
}

.pkpListPanelItem--user__userGroups {
	margin-top: 0.5rem;
	margin-bottom: -0.5rem;

	.pkpBadge {
		margin-bottom: 0.5rem;
		margin-right: 0.25em;
	}

	@media (min-width: 768px) {
		float: right;
		max-width: 50%;
		margin-top: 0;
		margin-right: 1rem;
		text-align: right;

		.pkpBadge {
			margin-left: 0.25em;
			margin-right: 0;
		}
	}
}

.pkpListPanelItem--user__userGroupContext {
	margin-right: 0.25em;
	font-weight: @bold;
}

.pkpListPanelItem__inlineLink {
	display: inline-block;
	margin-left: 0.25em;
	font-size: @font-tiny;
	text-decoration: none;
	opacity: 0;
	transition: opacity 0.2s;
}

.pkpListPanelItem__inlineLink--logout {
	color: @no;
}

.pkpListPanelItem--user:hover .pkpListPanelItem__inlineLink,
.pkpListPanelItem__inlineLink:focus {
	opacity: 1;
}

.pkpListPanelItem__details--user {
	padding-right: @base * 3; // should match expander width
}

.pkpListPanelItem--user__actions {
	margin-top: -0.5rem;
	text-align: right;

	.pkpButton {
		margin-top: 0.5rem;
	}
}

.list + .pkpListPanelItem--user__actions {
	margin-top: 0.5rem;
}
</style>
