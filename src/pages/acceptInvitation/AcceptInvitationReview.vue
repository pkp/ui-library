<template>
	<div>
		<div v-if="store.userId === null" class="p-8">
			<div class="flex items-center p-4">
				<h3>{{ t('acceptInvitation.review.accountDetails') }}</h3>
			</div>
			<div class="p-4">
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('user.username')"
					:value="store.acceptInvitationPayload.username"
				></FormDisplayItemBasic>
			</div>
		</div>
		<div v-if="store.userId != null" class="border-t border-light p-8">
			<div class="flex items-center justify-between p-4">
				<h3>{{ t('acceptInvitation.review.userDetails') }}</h3>
			</div>
			<div class="p-4">
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('user.orcid')"
					:value="
						userOrcidData.orcid
							? userOrcidData.orcid
							: t('invitation.orcid.acceptInvitation.message')
					"
				>
					<template #valueSuffix>
						<Icon
							v-if="userOrcidData.orcid && userOrcidData.orcidIsVerified"
							icon="Orcid"
							class="ml-1 h-4 w-4"
							:inline="true"
						/>
					</template>
				</FormDisplayItemBasic>
			</div>
		</div>
		<div v-else>
			<div
				class="flex items-center justify-between border-t border-light pl-12 pt-12"
			>
				<h3>{{ t('acceptInvitation.review.userDetails') }}</h3>
				<PkpButton class="border-0" @click="store.openStep('userDetails')">
					{{ t('common.edit') }}
				</PkpButton>
			</div>
			<div class="p-8">
				<div class="p-4 pb-8">
					<FormDisplay
						v-if="store.userId === null"
						:fields="userForm.fields"
						:supported-form-locales="userForm.supportedFormLocales"
						heading-element="h4"
					></FormDisplay>
				</div>
			</div>
		</div>

		<div class="border-t border-light p-8">
			<div class="flex items-center p-4">
				<h3>{{ t('manager.roles') }}</h3>
			</div>
			<div class="p-4">
				<AcceptInvitationUserRoles
					:user-groups-to-add="store.acceptInvitationPayload.userGroupsToAdd"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed, defineProps} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import AcceptInvitationUserRoles from './AcceptInvitationUserRoles.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';
import PkpButton from '@/components/Button/Button.vue';
import FormDisplay from '@/components/FormDisplay/FormDisplay.vue';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
import {useForm} from '@/composables/useForm';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	form: {type: Object, required: true},
});
const store = useAcceptInvitationPageStore();
const {t} = useLocalize();

const {form: userForm, connectWithPayload} = useForm(props.form);
connectWithPayload(store.acceptInvitationPayload);

const userOrcidData = computed(() => {
	let orcid = '';
	let orcidIsVerified = false;

	if (store.acceptInvitationPayload.orcid) {
		orcid = store.acceptInvitationPayload.orcid;
	} else if (store.existingUser.orcid) {
		orcid = store.existingUser.orcid;
	}

	if (store.acceptInvitationPayload.orcidIsVerified) {
		orcidIsVerified = store.acceptInvitationPayload.orcidIsVerified;
	} else if (store.existingUser.orcidIsVerified) {
		orcidIsVerified = store.existingUser.orcidIsVerified;
	}

	return {orcid, orcidIsVerified};
});
</script>
