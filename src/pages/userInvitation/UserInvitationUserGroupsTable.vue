<template>
	<PkpTable aria-label="Example for basic table">
		<TableHeader>
			<TableColumn>Title</TableColumn>
			<TableColumn>Start Date</TableColumn>
			<TableColumn>End Date</TableColumn>
			<TableColumn>Journal Masthead</TableColumn>
			<TableColumn></TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="(row, index) in store.currentUserGroups" :key="index">
				<TableCell>
					{{ row.name[store.primaryLocale] }}
				</TableCell>
				<TableCell>
					{{ row.name.date_start ? row.name.date_start : '---' }}
				</TableCell>
				<TableCell>
					{{ row.name.date_end ? row.name.date_end : '---' }}
				</TableCell>
				<TableCell>
					{{ row.masthead ? row.masthead : '---' }}
				</TableCell>
				<TableCell>
					<pkp-button
						:is-warnable="true"
						@click="store.removeUserGroup(row, index)"
					>
						{{ t('invitation.role.removeRole.button') }}
					</pkp-button>
				</TableCell>
			</TableRow>
			<TableRow v-for="(row, index) in store.selectedUserGroups" :key="index">
				<TableCell>
					<field-select
						:key="index"
						v-bind="store.userGroupsField"
						:value="row.value"
						:options="store.availableUserGroups.value"
						class="userInvitation__roleSelect"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								store.updateUserGroups(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>
					<field-text
						:key="index"
						v-bind="store.dateStartField"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								store.updateUserGroups(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>
					<field-text
						:key="index"
						v-bind="store.dateEndField"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								store.updateUserGroups(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>
					<field-select
						:key="index"
						v-bind="store.mastheadField"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								store.updateUserGroups(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell></TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					<pkp-button @click="store.addAnotherUserGroup(row)">
						{{ t('invitation.role.addRole.button') }}
					</pkp-button>
				</TableCell>
				<TableCell></TableCell>
				<TableCell></TableCell>
				<TableCell></TableCell>
				<TableCell></TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>
</template>

<script setup>
import PkpTable from '@/components/TableNext/Table.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableRow from '@/components/TableNext/TableRow.vue';
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';
import PkpButton from '@/components/Button/Button.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';

const store = useUserInvitationPageStore();
</script>
<style>
select {
	width: 13rem !important;
}
</style>
