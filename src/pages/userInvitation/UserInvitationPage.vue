<template>
	<div>
		<UserInvitationHeader
			:page-title="store.pageTitle"
			:page-title-description="store.pageTitleDescription"
		/>
		<Steps
			v-if="store.steps.length"
			class="border-x border-t border-light bg-secondary"
			:current="store.currentStep.id"
			:started-steps="store.startedSteps"
			:label="t('invitation.wizard.completeSteps')"
			:progress-label="t('common.showingSteps')"
			:show-steps-label="t('common.showingSteps')"
			:scroll-to="wrapper"
			@step:open="store.openStep"
		>
			<Step
				v-for="step in store.steps"
				:id="step.id"
				:key="step.id"
				:label="step.name"
			>
				<div
					v-if="store.currentStep.id === step.id"
					class="border-b border-light"
				>
					<div class="flex border-b border-light p-4">
						<div class="flex-1">
							<h2 class="text-xl-bold text-heading">
								{{ store.stepTitle }}
							</h2>
							<p :class="store.userSearch.class">
								{{ store.userSearch.message }}
							</p>
							<p class="font-bold text-negative">{{ store.errors.error }}</p>
							<p class="mt-1 text-lg-normal">
								{{ step.description }}
							</p>
						</div>
					</div>
					<div v-for="section in step.sections" :key="section.id" class="flex">
						<div class="flex-1">
							<template v-if="step.type === 'review'">
								<notification
									v-if="Object.keys(store.errors).length > 0"
									type="warning"
								>
									{{ t('invitation.wizard.errors') }}
								</notification>
							</template>
							<component
								:is="userInvitationComponents[section.sectionComponent]"
								:key="section.sectionComponent"
								v-bind="section.props"
							/>
						</div>
					</div>
				</div>
			</Step>
		</Steps>
		<div class="border-x border-b border-light bg-secondary p-8">
			<ButtonRow>
				<PkpButton :is-warnable="true" @click="store.cancel">
					{{ t('common.cancel') }}
				</PkpButton>
				<PkpButton v-if="!store.isOnFirstStep" @click="store.previousStep">
					{{ t('common.back') }}
				</PkpButton>
				<PkpButton
					:is-primary="true"
					:is-disabled="store.isSubmitting"
					@click="store.nextStep"
				>
					{{ store.currentStep.nextButtonLabel }}
				</PkpButton>
			</ButtonRow>
		</div>
	</div>
</template>

<script setup>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import PkpButton from '@/components/Button/Button.vue';
import Steps from '@/components/Steps/Steps.vue';
import Step from '@/components/Steps/Step.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';
import {useLocalize} from '@/composables/useLocalize';
import {ref} from 'vue';
import UserInvitationHeader from './UserInvitationHeader.vue';
import UserInvitationDetailsFormStep from './UserInvitationDetailsFormStep.vue';
import UserInvitationSearchFormStep from './UserInvitationSearchFormStep.vue';
import UserInvitationEmailComposerStep from './UserInvitationEmailComposerStep.vue';

const props = defineProps({
	/** steps for invite user */
	steps: {
		type: Array,
		required: true,
	},
	/** primary language */
	primaryLocale: {
		type: String,
		required: true,
	},
	/** API url for fetching email templates */
	emailTemplatesApiUrl: {
		type: String,
		required: true,
	},
	pageTitle: {
		type: String,
		required: true,
	},
	pageTitleDescription: {
		type: String,
		required: true,
	},
	invitationPayload: {
		type: Object,
		required: true,
	},
	invitationType: {
		type: String,
		required: true,
	},
	invitationMode: {
		type: String,
		required: true,
	},
});
const {t} = useLocalize();
const wrapper = ref(null);
const store = useUserInvitationPageStore(props);
const userInvitationComponents = {
	UserInvitationDetailsFormStep,
	UserInvitationSearchFormStep,
	UserInvitationEmailComposerStep,
};
</script>
