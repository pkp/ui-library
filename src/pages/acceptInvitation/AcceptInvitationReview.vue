<template>
	<div>
		<div v-if="store.userId === null" class="acceptInvitation__reviewPanel">
			<div class="acceptInvitation__reviewPanel__header">
				<h3>Account Details</h3>
			</div>
			<div class="acceptInvitation__reviewPanel__item">
				<h4 class="acceptInvitation__reviewPanel__item__header">Username</h4>
				<div class="acceptInvitation__reviewPanel__item__value">
					{{ store.acceptinvitationPayload.username }}
				</div>
				<h4 class="acceptInvitation__reviewPanel__item__header">Password</h4>
				<div class="acceptInvitation__reviewPanel__item__value">
					{{ store.acceptinvitationPayload.password }}
				</div>
			</div>
		</div>
		<div class="acceptInvitation__reviewPanel">
			<div class="acceptInvitation__reviewPanel__header">
				<h3>User Details</h3>
				<pkp-button
					v-if="store.userId === null"
					class="acceptInvitation__reviewPanel__edit"
					@click="store.openStep('userDetails')"
				>
					edit
				</pkp-button>
			</div>
			<div class="acceptInvitation__reviewPanel__item">
				<template v-if="store.userId === null">
					<h4 class="acceptInvitation__reviewPanel__item__header">Email</h4>
					<div class="acceptInvitation__reviewPanel__item__value">
						{{ store.email }}
					</div>
				</template>
				<h4 class="acceptInvitation__reviewPanel__item__header">ORCID ID</h4>
				<div class="acceptInvitation__reviewPanel__item__value">
					{{
						store.acceptinvitationPayload.orcid
							? store.acceptinvitationPayload.orcid
							: t('invitation.orcid.acceptInvitation.message')
					}}
					<icon
						v-if="store.acceptinvitationPayload.orcid"
						icon="orcid"
						:inline="true"
					/>
				</div>
				<template v-if="store.userId === null">
					<h4 class="acceptInvitation__reviewPanel__item__header">
						Given Name
					</h4>
					<div class="acceptInvitation__reviewPanel__item__value">
						{{ store.acceptinvitationPayload.givenName }}
					</div>
					<h4 class="acceptInvitation__reviewPanel__item__header">
						Family Name
					</h4>
					<div class="acceptInvitation__reviewPanel__item__value">
						{{ store.acceptinvitationPayload.familyName }}
					</div>
					<h4 class="acceptInvitation__reviewPanel__item__header">
						Affiliation
					</h4>
					<div class="acceptInvitation__reviewPanel__item__value">
						{{ store.acceptinvitationPayload.affiliation }}
					</div>
					<h4 class="acceptInvitation__reviewPanel__item__header">Country</h4>
					<div class="acceptInvitation__reviewPanel__item__value">
						{{ store.acceptinvitationPayload.country }}
					</div>
				</template>
			</div>
		</div>
		<div class="acceptInvitation__reviewPanel">
			<div class="acceptInvitation__reviewPanel__header">
				<h3>Roles</h3>
			</div>
			<div class="acceptInvitation__reviewPanel__item">
				<AcceptInvitationUserRoles
					:rows="store.acceptinvitationPayload.userGroupsToAdd"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import {defineProps} from 'vue';
import AcceptInvitationUserRoles from './AcceptInvitationUserRoles.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

defineProps({});
const store = useAcceptInvitationPageStore();
</script>
<style>
.acceptInvitation__reviewPanel__item {
	padding: 1rem;

	&:last-child {
		border-bottom: none;
	}

	.pkpNotification {
		margin-bottom: 0.5rem;
	}
}
.acceptInvitation__reviewPanel {
	border: 1px solid #ddd;
}
.acceptInvitation__reviewPanel__header {
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
}
.acceptInvitation__reviewPanel__item__header {
	margin: 0;
	font-size: 0.875rem;
	line-height: 1.5rem;
}
.acceptInvitation__reviewPanel__item__value {
	margin-bottom: 1rem;
	font-size: 0.875rem;
	line-height: 1.5rem;
}
.acceptInvitation__reviewPanel__edit {
	margin-inline-start: auto;
}
</style>
