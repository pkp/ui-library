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
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('user.password')"
					:value="store.acceptInvitationPayload.password"
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
						store.acceptInvitationPayload.orcid
							? store.acceptInvitationPayload.orcid
							: t('invitation.orcid.acceptInvitation.message')
					"
				></FormDisplayItemBasic>
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
			<div v-for="step in store.formSteps" :key="step.id">
				<template v-if="step.id === 'userDetails'">
					<div
						v-for="section in step.sections"
						:key="section.id"
						class="border-light p-8 even:border-t"
					>
						<div class="p-4 pb-8">
							<FormDisplay
								v-if="store.userId === null"
								:fields="section.props.form.fields"
								:supported-form-locales="
									section.props.form.supportedFormLocales
								"
								heading-element="h4"
							></FormDisplay>
						</div>
					</div>
				</template>
			</div>
		</div>

		<div class="border-t border-light p-8">
			<div class="flex items-center p-4">
				<h3>{{ t('manager.roles') }}</h3>
			</div>
			<div class="p-4">
				<AcceptInvitationUserRoles
					:user-groups-to-add="store.acceptInvitationPayload.userGroupsToAdd"
					:user-groups-to-remove="
						store.acceptInvitationPayload.userGroupsToRemove
					"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import {defineProps} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import AcceptInvitationUserRoles from './AcceptInvitationUserRoles.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';
import PkpButton from '@/components/Button/Button.vue';
import FormDisplay from '@/components/FormDisplay/FormDisplay.vue';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';

defineProps({});
const store = useAcceptInvitationPageStore();
const {t} = useLocalize();
</script>
