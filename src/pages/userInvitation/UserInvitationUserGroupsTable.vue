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
			<TableRow v-for="(row, index) in userGroups" :key="index">
				<TableCell>
					<field-select
						name="userGroup"
						:label="t('invitation.role.selectRole')"
						:is-required="true"
						:value="row.userGroup"
						:options="availableUserGroups"
						class="userInvitation__roleSelect"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								updateUserGroup(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>
					<field-text
						name="dateStart"
						:label="t('invitation.role.dateStart')"
						input-type="date"
						:is-required="true"
						:value="row.dateStart"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								updateUserGroup(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>
					<field-text
						name="dateEnd"
						:label="t('invitation.role.dateEnd')"
						input-type="date"
						:value="row.dateEnd"
						:is-required="true"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								updateUserGroup(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>
					<field-select
						name="masthead"
						:label="t('invitation.role.masthead')"
						:is-required="true"
						:value="row.masthead"
						:options="[
							{label: 'Appear on the masthead', value: true},
							{label: 'Dose not appear on the masthead', value: false},
						]"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								updateUserGroup(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell></TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					<pkp-button @click="addUserGroup()">
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
import {computed} from 'vue';
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

const userGroups = computed(() => store.invitationPayload.userGroups);

const props = defineProps({
	section: {type: Object, required: true},
});

function updateUserGroup(index, fieldName, newValue) {
	const userGroupsUpdate = [...store.invitationPayload.userGroups];

	userGroupsUpdate[index][fieldName] = newValue;

	store.updatePayload('userGroups', userGroupsUpdate);
}

const availableUserGroups = computed(() => {
	return props.section.userGroups.filter((element) => {
		return !store.invitationPayload.currentUserGroups.find(
			(data) => data.id === element.value,
		);
	});
});

function addUserGroup() {
	const userGroupsUpdate = [...store.invitationPayload.userGroups];
	userGroupsUpdate.push({
		role_name: null,
		dateStart: null,
		dateEnd: null,
		masthead: null,
		value: null,
	});

	store.updatePayload('userGroups', userGroupsUpdate);
}
</script>
<style>
select {
	width: 13rem !important;
}
</style>
