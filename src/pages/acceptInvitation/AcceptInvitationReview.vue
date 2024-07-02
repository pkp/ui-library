<template>
	<div>
		<div v-if="store.userId === null" class="border border-solid border-[#ddd]">
			<div class="flex items-center px-2 py-4">
				<h3>Account Details</h3>
			</div>
			<div class="p-4">
				<h4 class="text-sm m-0 leading-6">Username</h4>
				<div class="text-sm mb-4 leading-6">
					{{ store.acceptinvitationPayload.username }}
				</div>
				<h4 class="text-sm m-0 leading-6">Password</h4>
				<div class="text-sm mb-4 leading-6">
					{{ store.acceptinvitationPayload.password }}
				</div>
			</div>
		</div>
		<div class="border-b border-l border-r border-solid border-[#ddd]">
			<div class="flex items-center px-2 py-4">
				<h3>User Details</h3>
				<pkp-button
					v-if="store.userId === null"
					class="ms-auto"
					@click="store.openStep('userDetails')"
				>
					edit
				</pkp-button>
			</div>
			<div class="p-4">
				<template v-if="store.userId === null">
					<h4 class="text-sm m-0 leading-6">Email</h4>
					<div class="text-sm mb-4 leading-6">
						{{ store.email }}
					</div>
				</template>
				<h4 class="text-sm m-0 leading-6">ORCID ID</h4>
				<div class="text-sm mb-4 leading-6">
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
					<h4 class="text-sm m-0 leading-6">Given Name</h4>
					<div class="text-sm mb-4 leading-6">
						{{ store.acceptinvitationPayload.givenName }}
					</div>
					<h4 class="text-sm m-0 leading-6">Family Name</h4>
					<div class="text-sm mb-4 leading-6">
						{{ store.acceptinvitationPayload.familyName }}
					</div>
					<h4 class="text-sm m-0 leading-6">Affiliation</h4>
					<div class="text-sm mb-4 leading-6">
						{{ store.acceptinvitationPayload.affiliation }}
					</div>
					<h4 class="text-sm m-0 leading-6">Country</h4>
					<div class="text-sm mb-4 leading-6">
						{{ store.acceptinvitationPayload.country }}
					</div>
				</template>
			</div>
		</div>
		<div class="border-b border-l border-r border-solid border-[#ddd]">
			<div class="flex items-center px-2 py-4">
				<h3>Roles</h3>
			</div>
			<div class="p-4">
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
