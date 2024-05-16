<template>
	<div v-if="store.user === null">
		<pkp-form
			v-if="section.type === 'form'"
			v-bind="section.form"
			ref="autosaveForms"
			class="userInvitation__stepForm"
			@set="store.updateAutosaveForm"
		></pkp-form>
	</div>
	<div v-if="store.user !== null">
		<div class="userInvitation__reviewPanel__item">
			<h4 class="userInvitation__reviewPanel__item__header">Email Address</h4>
			<div class="userInvitation__reviewPanel__item__value">
				{{ store.user.email }}
			</div>
			<h4 class="userInvitation__reviewPanel__item__header">ORCID ID</h4>
			<div class="userInvitation__reviewPanel__item__value">
				{{
					store.user.orcid ? store.user.orcid : t('invitation.orcid.message')
				}}
				<icon
					v-if="store.user.orcidAccessToken !== null"
					icon="orcid"
					:inline="true"
				/>
			</div>
			<h4 class="userInvitation__reviewPanel__item__header">Given Name</h4>
			<div class="userInvitation__reviewPanel__item__value">
				{{ store.user.fullName }}
			</div>
			<h4 class="userInvitation__reviewPanel__item__header">Family Name</h4>
			<div class="userInvitation__reviewPanel__item__value">
				{{ store.user.fullName }}
			</div>
			<h4 class="userInvitation__reviewPanel__item__header">Affiliation</h4>
			<div class="userInvitation__reviewPanel__item__value">
				{{ store.user.affiliation[store.primaryLocale] }}
			</div>
		</div>
	</div>
	<br />
	<UserInvitationUserGroupsTable />
</template>

<script setup>
import {defineProps} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import {useTranslation} from '@/composables/useTranslation';
import UserInvitationUserGroupsTable from './UserInvitationUserGroupsTable.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';

defineProps({
	section: {type: Object, required: true},
});
const {t} = useTranslation();
const store = useUserInvitationPageStore();
</script>
<style lang="less">
select {
	width: 13rem !important;
}
.userInvitation__reviewPanel__item {
	&:last-child {
		border-bottom: none;
	}
}

.userInvitation__reviewPanel__item__header {
	margin: 0;
	font-size: 0.875rem;
	line-height: 1.5rem;
}

.userInvitation__reviewPanel__item__value {
	margin-bottom: 1rem;
	font-size: 0.875rem;
	line-height: 1.5rem;
}
</style>
