<template>
	<PkpTable>
		<template #label>
			<h3 class="text-3xl-bold">
				{{ t('grid.user.currentUsers') }}({{
					store.invitationsPagination.itemCount
				}})
			</h3>
		</template>
		<template #top-controls>
			<div class="flex space-x-0">
				<Icon
					icon="search"
					class="border-x-2 border-y-2 p-3"
					:inline="true"
				></Icon>
				<FieldText
					:value="fields.search"
					name="search"
					size="large"
					@change="store.search"
				/>
			</div>
		</template>
		<TableHeader>
			<TableColumn>{{ t('invitation.tableHeader.name') }}</TableColumn>
			<TableColumn>{{ t('about.contact.email') }}</TableColumn>
			<TableColumn>{{ t('user.roles') }}</TableColumn>
			<TableColumn>{{ t('user.startDate') }}</TableColumn>
			<TableColumn>{{ t('user.affiliation') }}</TableColumn>
			<TableColumn>
				<span class="sr-only">{{ t('common.moreActions') }}</span>
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="(invitation, index) in store.invitations" :key="index">
				<TableCell>
					{{ invitation.fullName }}
					<Icon v-if="invitation.orcidIsVerified" icon="orcid" :inline="true" />
				</TableCell>
				<TableCell>
					{{ invitation.email }}
				</TableCell>
				<TableCell>
					<template v-for="(userGroups, i) in invitation.groups" :key="i">
						<div class="flex flex-col">
							{{ localize(userGroups.name) }}
						</div>
					</template>
				</TableCell>
				<TableCell>
					<template v-for="(userGroups, i) in invitation.groups" :key="i">
						<div class="flex flex-col">
							{{ formatShortDate(userGroups?.startDate) }}
						</div>
					</template>
				</TableCell>
				<TableCell>
					{{ localize(invitation.affiliation) }}
				</TableCell>
				<TableCell>
					<DropdownActions
						:actions="[
							{
								label: t('common.edit'),
								name: 'editUser',
								icon: 'Edit',
							},
							{
								label: t('email.email'),
								icon: 'Email',
								name: 'sendEmail',
							},
							{
								label: t('grid.action.logInAs'),
								icon: 'LoginAs',
								name: 'sendEmail',
							},
							{
								label: t('common.cancel'),
								icon: 'Cancel',
								name: 'RemoveUser',
								isWarnable: true,
							},
							{
								label: t('grid.action.disable'),
								icon: 'DisableUser',
								name: 'DisableUser',
								isWarnable: true,
							},
							{
								label: t('grid.action.mergeUser'),
								icon: 'MergeUser',
								name: 'mergeUser',
							},
						]"
						:label="t('invitation.management.options')"
						:display-as-ellipsis="true"
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
	<div class="flex justify-end">
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
import {useUserAccessManagerStore} from './UserAccessManagerStore.js';
import Pagination from '@/components/Pagination/Pagination.vue';
import {useTranslation} from '@/composables/useTranslation';
import {useDate} from '@/composables/useDate';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {ref} from 'vue';
const store = useUserAccessManagerStore();
const {t} = useTranslation();
const {formatShortDate} = useDate();
const fields = ref({search: ''});
</script>
