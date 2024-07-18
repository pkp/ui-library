<template>
	<div
		v-if="!isInvitationLoading"
		class="m-0 flex items-center pb-2 pt-2 text-3xl-normal leading-8"
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
			<TableColumn>Name</TableColumn>
			<TableColumn>Email</TableColumn>
			<TableColumn>Invitation</TableColumn>
			<TableColumn>Status</TableColumn>
			<TableColumn>Affiliation</TableColumn>
			<TableColumn></TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="(row, index) in store.invitations?.data" :key="index">
				<TableCell>
					{{
						row.user?.fullName
							? row.user.fullName
							: localize(row.payload.givenName) +
								' ' +
								localize(row.payload.familyName)
					}}
					<Icon icon="orcid" :inline="true" />
				</TableCell>
				<TableCell>
					{{ row.email }}
				</TableCell>
				<TableCell>
					<template
						v-for="(userGroups, i) in JSON.parse(row.payload.roles)"
						:key="i"
					>
						<span>{{ userGroups.user_group_name }}</span>
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
					<Dropdown label="...">
						<ul>
							<li class="border-b border-solid border-[#ddd]">
								<button class="pkpDropdown__action">
									<Icon class="h-4 w-5" icon="View" />
									{{ t('common.view') }}
								</button>
							</li>
							<li>
								<button class="pkpDropdown__action">
									<Icon class="h-4 w-5" icon="Cancel" />
									{{ t('invitation.cancel') }}
								</button>
							</li>
						</ul>
					</Dropdown>
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
import {useInvitationsPageStore} from './InvitationPageStore.js';
import Pagination from '@/components/Pagination/Pagination.vue';
import {useTranslation} from '@/composables/useTranslation';
import Dropdown from '@/components/Dropdown/Dropdown.vue';

const store = useInvitationsPageStore();
const {t} = useTranslation();
</script>
