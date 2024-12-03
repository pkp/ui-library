<template>
	<PkpTable>
		<template #label>
			<h3 class="text-3xl-bold">
				{{ t('invitation.header') }}({{
					store.invitationsPagination.itemCount
				}})
			</h3>
		</template>
		<template #top-controls>
			<div class="flex gap-x-2">
				<PkpButton @click="store.createNewInvitation">
					{{ t('invitation.inviteToRole.btn') }}
				</PkpButton>
			</div>
		</template>
		<TableHeader>
			<TableColumn>{{ t('invitation.tableHeader.name') }}</TableColumn>
			<TableColumn>{{ t('about.contact.email') }}</TableColumn>
			<TableColumn>{{ t('invitation.header') }}</TableColumn>
			<TableColumn>{{ t('common.status') }}</TableColumn>
			<TableColumn>{{ t('user.affiliation') }}</TableColumn>
			<TableColumn>
				<span class="sr-only">{{ t('common.moreActions') }}</span>
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="(invitation, index) in store.invitations" :key="index">
				<TableCell>
					<span class="gap-x-1">
						<span class="align-middle text-lg-normal">
							{{
								invitation.userId
									? invitation.existingUser.fullName
									: invitation.newUser.fullName
							}}
						</span>
						<Icon
							v-if="invitation.existingUser?.orcid || invitation.newUser?.orcid"
							icon="Orcid"
							class="h-4 w-4"
							:inline="true"
						/>
					</span>
				</TableCell>
				<TableCell>
					<span class="text-lg-normal">
						{{
							invitation.userId
								? invitation.existingUser.email
								: invitation.email
						}}
					</span>
				</TableCell>
				<TableCell>
					<span class="text-lg-normal">
						<template
							v-for="(userGroups, i) in invitation.userGroupsToAdd"
							:key="i"
						>
							<div class="flex flex-col">
								{{ userGroups.userGroupName }}
							</div>
						</template>
					</span>
				</TableCell>
				<TableCell>
					<span class="text-lg-normal">
						{{
							t('userInvitation.status.invited', {
								date: formatShortDate(invitation.createdAt),
							})
						}}
					</span>
				</TableCell>
				<TableCell>
					<span class="text-lg-normal">
						{{
							invitation.userId
								? localize(invitation.existingUser.affiliation)
								: localize(invitation.affiliation)
						}}
					</span>
				</TableCell>
				<TableCell>
					<DropdownActions
						:actions="[
							{
								label: t('common.edit'),
								name: 'editInvite',
								icon: 'Edit',
							},
							{
								label: t('invitation.cancelInvite.actionName'),
								icon: 'Cancel',
								name: 'cancelInvite',
								isWarnable: true,
							},
						]"
						:label="t('invitation.management.options')"
						button-variant="ellipsis"
						direction="left"
						@action="
							(actionName) =>
								store.handleInvitationAction(actionName, invitation)
						"
					/>
				</TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>
	<div
		v-if="store.invitationsPagination.itemCount > 0"
		class="flex justify-end"
	>
		<Pagination
			:current-page="store.invitationsPagination.currentPage"
			:last-page="store.invitationsPagination.pageCount"
			:is-loading="store.isInvitationLoading"
			:show-adjacent-pages="3"
			@set-page="store.setCurrentPage"
		/>
	</div>
</template>

<script setup>
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useUserInvitationManagerStore} from './UserInvitationManagerStore.js';
import Pagination from '@/components/Pagination/Pagination.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const store = useUserInvitationManagerStore();
const {t, localize} = useLocalize();
const {formatShortDate} = useDate();
</script>
