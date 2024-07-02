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
			<TableRow
				v-for="(row, index) in store.invitationPayload.currentUserGroups"
				:key="index"
			>
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
					<PkpButton :is-warnable="true" @click="removeUserGroup(row, index)">
						{{ t('invitation.role.removeRole.button') }}
					</PkpButton>
				</TableCell>
			</TableRow>
			<TableRow v-for="(row, index) in allUserGroups" :key="index">
				<TableCell>
					<FieldSelect
						name="userGroup"
						:label="t('invitation.role.selectRole')"
						:is-required="true"
						:value="row.userGroup"
						:options="availableUserGroups"
						:all-errors="userGroupErrors[index]"
						class="userInvitation__roleSelect"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								updateUserGroup(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>
					<FieldText
						name="dateStart"
						:label="t('invitation.role.dateStart')"
						input-type="date"
						:is-required="true"
						:value="row.dateStart"
						:all-errors="userGroupErrors[index]"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								updateUserGroup(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>
					<FieldText
						name="dateEnd"
						:label="t('invitation.role.dateEnd')"
						input-type="date"
						:value="row.dateEnd"
						:is-required="true"
						:all-errors="userGroupErrors[index]"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								updateUserGroup(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>
					<FieldSelect
						name="masthead"
						:label="t('invitation.role.masthead')"
						:is-required="true"
						:value="row.masthead"
						:options="[
							{label: 'Appear on the masthead', value: true},
							{label: 'Dose not appear on the masthead', value: false},
						]"
						:all-errors="userGroupErrors[index]"
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
					<PkpButton @click="addUserGroup()">
						{{ t('invitation.role.addRole.button') }}
					</PkpButton>
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
import {useTranslation} from '@/composables/useTranslation';
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
const {t} = useTranslation();

const allUserGroups = computed(() => store.invitationPayload.userGroupsToAdd);

const props = defineProps({
	userGroups: {type: Object, required: true},
});

function updateUserGroup(index, fieldName, newValue) {
	const userGroupsUpdate = [...store.invitationPayload.userGroupsToAdd];

	userGroupsUpdate[index][fieldName] = newValue;

	store.updatePayload('userGroupsToAdd', userGroupsUpdate);
}

const availableUserGroups = computed(() => {
	return props.userGroups.filter((element) => {
		return !store.invitationPayload.currentUserGroups.find(
			(data) => data.id === element.value,
		);
	});
});

function addUserGroup() {
	const userGroupsUpdate = [...store.invitationPayload.userGroupsToAdd];
	userGroupsUpdate.push({
		userGroup: null,
		dateStart: null,
		dateEnd: null,
		masthead: null,
	});
	store.updatePayload('userGroupsToAdd', userGroupsUpdate);
}

function removeUserGroup(userGroup, index) {
	store.invitationPayload.currentUserGroups.splice(index, 1);
	const userGroupsToRemove = [...store.invitationPayload.userGroupsToRemove];
	userGroupsToRemove.push(userGroup.id);
	store.updatePayload('userGroupsToRemove', userGroupsToRemove);
}

const userGroupErrors = computed(() => {
	return store.errors.userGroupsToAdd || [];
});
</script>
<style>
select {
	width: 13rem !important;
}
</style>
