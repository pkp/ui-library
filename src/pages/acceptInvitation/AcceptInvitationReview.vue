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
					:value="store.acceptinvitationPayload.username"
				></FormDisplayItemBasic>
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('user.password')"
					:value="store.acceptinvitationPayload.password"
				></FormDisplayItemBasic>
			</div>
		</div>
		<div class="border-t border-solid border-[#ddd] p-8">
			<div class="flex items-center justify-between p-4">
				<h3>{{ t('acceptInvitation.review.userDetails') }}</h3>
				<PkpButton
					v-if="store.userId === null"
					@click="store.openStep('userDetails')"
				>
					{{ t('common.edit') }}
				</PkpButton>
			</div>
			<div class="p-4">
				<FormDisplayItemBasic
					v-if="store.userId === null"
					heading-element="h4"
					:heading="t('user.email')"
					:value="store.email"
				></FormDisplayItemBasic>
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('user.orcid')"
					:value="
						store.acceptinvitationPayload.orcid
							? store.acceptinvitationPayload.orcid
							: t('invitation.orcid.acceptInvitation.message')
					"
				></FormDisplayItemBasic>
				<Icon
					v-if="store.acceptinvitationPayload.orcid"
					icon="orcid"
					:inline="true"
				/>
				<div v-for="step in store.formSteps" :key="step.id">
					<template v-if="step.id === 'userDetails'">
						<div v-for="section in step.sections" :key="section.id">
							<FormDisplay v-bind="section.props.form"></FormDisplay>
						</div>
					</template>
				</div>
			</div>
		</div>
		<div class="border-t border-solid border-[#ddd] p-8">
			<div class="flex items-center p-4">
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
import {useTranslation} from '@/composables/useTranslation';
import AcceptInvitationUserRoles from './AcceptInvitationUserRoles.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
import FormDisplay from '@/components/FormDisplay/FormDisplay.vue';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';

defineProps({});
const store = useAcceptInvitationPageStore();
const {t} = useTranslation();
</script>
