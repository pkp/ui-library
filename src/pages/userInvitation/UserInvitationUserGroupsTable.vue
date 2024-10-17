<template>
	<PkpTable>
		<TableHeader>
			<TableColumn>{{ t('userInvitation.roleTable.role') }}</TableColumn>
			<TableColumn>{{ t('userInvitation.roleTable.startDate') }}</TableColumn>
			<TableColumn>{{ t('userInvitation.roleTable.endDate') }}</TableColumn>
			<TableColumn>
				{{ t('userInvitation.roleTable.journalMasthead') }}
			</TableColumn>
			<TableColumn></TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow
				v-for="(currentUserGroup, index) in store.invitationPayload
					.currentUserGroups"
				:key="index"
			>
				<TableCell>
					{{ localize(currentUserGroup.name) }}
				</TableCell>
				<TableCell>
					{{ currentUserGroup.dateStart ? currentUserGroup.dateStart : '---' }}
				</TableCell>
				<TableCell>
					{{ currentUserGroup.dateEnd ? currentUserGroup.dateEnd : '---' }}
				</TableCell>
				<TableCell>
					{{ currentUserGroup.masthead ? currentUserGroup.masthead : '---' }}
				</TableCell>
				<TableCell v-if="!currentUserGroup.dateEnd">
					<PkpButton
						:is-warnable="true"
						@click="removeUserGroup(currentUserGroup, index)"
					>
						{{ t('invitation.role.removeRole.button') }}
					</PkpButton>
				</TableCell>
				<TableCell v-else>
					<div
						class="rounded border-light bg-[#fbe7f1] px-2 py-2 text-center text-lg-semibold leading-5"
					>
						{{ t('invitation.removeRoles') }}
					</div>
				</TableCell>
			</TableRow>
			<TableRow
				v-for="(userGroupToAdd, index) in allUserGroupsToAdd"
				:key="index"
			>
				<TableCell>
					<FieldSelect
						name="userGroupId"
						:label="t('invitation.role.selectRole')"
						:is-required="true"
						:value="userGroupToAdd.userGroupId"
						:options="availableUserGroups"
						:all-errors="{
							userGroupId:
								userGroupErrors['userGroupsToAdd.' + index + '.userGroupId'],
						}"
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
						:value="userGroupToAdd.dateStart"
						:all-errors="{
							dateStart:
								userGroupErrors['userGroupsToAdd.' + index + '.dateStart'],
						}"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								updateUserGroup(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell>---</TableCell>
				<TableCell>
					<FieldSelect
						name="masthead"
						:label="t('invitation.role.masthead')"
						:is-required="true"
						:value="userGroupToAdd.masthead"
						:options="[
							{label: t('invitation.masthead.show'), value: true},
							{label: t('invitation.masthead.hidden'), value: false},
						]"
						:all-errors="{
							masthead:
								userGroupErrors['userGroupsToAdd.' + index + '.masthead'],
						}"
						@change="
							(fieldName, propName, newValue, localeKey) =>
								updateUserGroup(index, fieldName, newValue)
						"
					/>
				</TableCell>
				<TableCell></TableCell>
			</TableRow>
		</TableBody>
		<template #bottom-controls>
			<PkpButton @click="addUserGroup()">
				{{ t('invitation.role.addRole.button') }}
			</PkpButton>
		</template>
	</PkpTable>
</template>

<script setup>
import {computed} from 'vue';
import {useTranslation} from '@/composables/useTranslation';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';
import PkpButton from '@/components/Button/Button.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';
import {useDate} from '@/composables/useDate';

const props = defineProps({
	userGroups: {type: Object, required: true},
});

const store = useUserInvitationPageStore();
const {t} = useTranslation();
const {formatShortDate} = useDate();

const allUserGroupsToAdd = computed(
	() => store.invitationPayload.userGroupsToAdd,
);
updateWithSelectedUserGroups(props.userGroups);

/**
 * update selected user group
 * @param index Number
 * @param fieldName String
 * @param newValue String
 */
function updateUserGroup(index, fieldName, newValue) {
	const userGroupsUpdate = [...store.invitationPayload.userGroupsToAdd];
	userGroupsUpdate[index][fieldName] = newValue;
	store.updatePayload('userGroupsToAdd', userGroupsUpdate, false);
}

const availableUserGroups = computed(() => {
	return props.userGroups.filter((element) => {
		return !store.invitationPayload.currentUserGroups.find(
			(data) => data.id === element.value,
		);
	});
});

/**
 * add user groups to the invitation payload
 */
function addUserGroup() {
	const userGroupsUpdate = [...store.invitationPayload.userGroupsToAdd];
	userGroupsUpdate.push({
		userGroupId: null,
		dateStart: null,
		masthead: null,
	});
	store.updatePayload('userGroupsToAdd', userGroupsUpdate, false);
}

/**
 * remove user groups form user
 * @param userGroup Object
 * @param index Number
 */
function removeUserGroup(userGroup, index) {
	store.invitationPayload.currentUserGroups.find(
		(data, i) => i === index,
	).dateEnd = formatShortDate(new Date());
	let userGroupsToRemove = [];
	if (store.invitationPayload.userGroupsToRemove) {
		userGroupsToRemove = [...store.invitationPayload.userGroupsToRemove];
	}
	userGroupsToRemove.push({userGroupId: userGroup.id});
	store.updatePayload('userGroupsToRemove', userGroupsToRemove, false);
}

const userGroupErrors = computed(() => {
	return store.errors || [];
});

/**
 * disabling selecting user groups that already selected
 */
function updateWithSelectedUserGroups(userGroups) {
	userGroups.filter((element) => {
		if (
			store.invitationPayload.userGroupsToAdd.find(
				(data) => data.userGroupId === element.value,
			)
		) {
			element.disabled = true;
		} else {
			element.disabled = false;
		}
	});
}
</script>
