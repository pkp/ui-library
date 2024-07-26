<template>
	<div
		v-if="!isInvitationLoading"
		class="flex items-center pb-2 pt-2 text-3xl-normal"
	>
		<h4>{{ t('invitation.header') }}({{ store.invitations?.total }})</h4>
		<div class="ml-auto">
			<PkpButton @click="store.sendInvitation">
				{{ t('invitation.inviteToRole.btn') }}
			</PkpButton>
		</div>
	</div>
	<PkpTable aria-label="Example for basic table">
		<TableHeader>
			<TableColumn>{{ t('invitation.tableHeader.name') }}</TableColumn>
			<TableColumn>{{ t('about.contact.email') }}</TableColumn>
			<TableColumn>{{ t('invitation.header') }}</TableColumn>
			<TableColumn>{{ t('common.status') }}</TableColumn>
			<TableColumn>{{ t('user.affiliation') }}</TableColumn>
			<TableColumn></TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="(row, index) in store.invitations?.data" :key="index">
				<TableCell>
					{{ store.getFullName(row.payload.givenName, row.payload.familyName) }}
					<Icon icon="orcid" :inline="true" />
				</TableCell>
				<TableCell>
					{{ row.email }}
				</TableCell>
				<TableCell>
					<template
						v-for="(userGroups, i) in row.payload.userGroupsToAdd"
						:key="i"
					>
						<span>{{ userGroups.userGroup }}</span>
						<br />
					</template>
				</TableCell>
				<TableCell>
					{{ row.status }}
				</TableCell>
				<TableCell>
					{{
						row.user?.affiliation
							? localize(row.user?.affiliation)
							: localize(row?.payload.affiliation)
					}}
				</TableCell>
				<TableCell>
					<DropdownActions
						:actions="[
							{label: 'View', url: '#', icon: 'View'},
							{
								label: 'Cancel Invite',
								url: '#',
								icon: 'Cancel',
								isWarnable: true,
							},
						]"
						label="Invitation management options"
						:display-as-ellipsis="true"
						direction="left"
					/>
				</TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>
	<div class="flex justify-end">
		<Pagination
			:current-page="store.invitations?.pagination.currentPage"
			:last-page="store.invitations?.pagination.lastPage"
			:is-loading="store.isInvitationLoading"
			@set-page="store.setCurrentPage"
		/>
	</div>
</template>

<script setup>
import PkpTable from '@/components/TableNext/Table.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableRow from '@/components/TableNext/TableRow.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useInvitationManagerStore} from './InvitationManagerStore.js';
import Pagination from '@/components/Pagination/Pagination.vue';
import {useTranslation} from '@/composables/useTranslation';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const store = useInvitationManagerStore();
const {t} = useTranslation();
</script>
