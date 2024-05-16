<template>
	<div>
		<div class="submissionWizard__reviewPanel__item">
			<h4 class="submissionWizard__reviewPanel__item__header">Email Address</h4>
			<div class="submissionWizard__reviewPanel__item__value">
				{{ section.invitation.email }}
			</div>
			<h4 class="submissionWizard__reviewPanel__item__header">ORCID ID</h4>
			<div class="submissionWizard__reviewPanel__item__value">
				{{ section.invitation.orcid }}
			</div>
			<h4 class="submissionWizard__reviewPanel__item__header">Given Name</h4>
			<div class="submissionWizard__reviewPanel__item__value">
				{{ section.invitation.givenName }}
			</div>
			<h4 class="submissionWizard__reviewPanel__item__header">Family Name</h4>
			<div class="submissionWizard__reviewPanel__item__value">
				{{ section.invitation.familyName }}
			</div>
			<h4 class="submissionWizard__reviewPanel__item__header">Affiliation</h4>
			<div class="submissionWizard__reviewPanel__item__value">
				{{ section.invitation.familyName }}
			</div>
		</div>
	</div>
	<br />
	<UserInvitationUserGroupsTable />
</template>

<script setup>
import UserInvitationUserGroupsTable from '../userInvitation/UserInvitationUserGroupsTable.vue';
import {defineProps} from 'vue';

const props = defineProps({
	section: {type: Object, required: true},
});
console.log(props);
</script>
