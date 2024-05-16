<template>
	<div class="invitation__header">
		<h4>Invitations({{ store.invitations?.total }})</h4>
		<div class="invitation__btn">
			<pkp-button @click="store.sendInvitation">invite to a role</pkp-button>
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
							: row.payload.givenName + ' ' + row.payload.familyName
					}}
					<icon icon="orcid" :inline="true" />
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
					{{ row?.affiliation }}
				</TableCell>
				<TableCell>
					{{ row.user?.affiliation ? row.user?.affiliation : row?.affiliation }}
				</TableCell>
				<TableCell>...</TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>
	<div class="invitation__pagination">
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
import PkpButton from '@/components/Button/Button.vue';
import {useInvitationsPageStore} from './InvitationsPageStore';
import Pagination from '@/components/Pagination/Pagination.vue';

const store = useInvitationsPageStore();
</script>
<style>
.invitation__header {
	display: flex;
	align-items: center; /* Vertical align the elements to the center */
	font-size: 1rem;
	margin: 0;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
	line-height: 2rem;
}
.invitation__btn {
	margin-left: auto; /* Push this element to the right */
}
.invitation__pagination {
	display: flex;
	justify-content: flex-end;
}
</style>
