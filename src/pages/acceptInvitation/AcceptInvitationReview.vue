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
		<div v-if="store.userId != null" class="border-t border-light p-8">
			<div class="flex items-center justify-between p-4">
				<h3>{{ t('acceptInvitation.review.userDetails') }}</h3>
			</div>
			<div class="p-4">
				<FormDisplayItemBasic
					heading-element="h4"
					:heading="t('user.orcid')"
					:value="
						store.acceptinvitationPayload.orcid
							? store.acceptinvitationPayload.orcid
							: t('invitation.orcid.acceptInvitation.message')
					"
				></FormDisplayItemBasic>
			</div>
		</div>
		<div v-else>
			<div v-for="step in store.formSteps" :key="step.id">
				<template v-if="step.id === 'userDetails'">
					<div v-for="section in step.sections" :key="section.id">
						<div
							v-for="(locale, index) in section.props.form.supportedFormLocales"
							:key="locale.key"
							class="border-t border-light p-8"
						>
							<div
								v-if="index === 0"
								class="flex items-center justify-between p-4"
							>
								<h3>{{ t('acceptInvitation.review.userDetails') }}</h3>
								<PkpButton @click="store.openStep('userDetails')">
									{{ t('common.edit') }}
								</PkpButton>
							</div>
							<div class="p-4">
								<div>
									<h4>{{ locale.label }}</h4>
								</div>

								<FormDisplayItemBasic
									v-if="store.userId === null"
									heading-element="h4"
									:heading="t('about.contact.email')"
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

								<template
									v-for="field in section.props.form.fields"
									:key="field.name"
								>
									<FormDisplayItemBasic
										v-if="field.component === 'field-text'"
										heading-element="h4"
										:heading="field.label"
										:value="
											field.isMultilingual
												? field.value[locale.key]
												: field.value
										"
									></FormDisplayItemBasic>
									<FieldSelectDisplay
										v-if="field.component === 'field-select'"
										heading-element="h4"
										:field="field"
									></FieldSelectDisplay>
								</template>
							</div>
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
					:user-groups-to-add="store.acceptinvitationPayload.userGroupsToAdd"
					:user-groups-to-remove="
						store.acceptinvitationPayload.userGroupsToRemove
					"
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
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
import FieldSelectDisplay from '@/components/FormDisplay/FieldSelectDisplay.vue';

defineProps({});
const store = useAcceptInvitationPageStore();
const {t} = useTranslation();
</script>
