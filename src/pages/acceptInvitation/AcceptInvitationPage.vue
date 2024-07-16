<template>
	<div class="userInvitation">
		<AcceptInvitationHeader
			:page-title="store.pageTitle"
			:page-title-description="store.pageTitleDescription"
		/>
		<Steps
			v-if="store.steps.length"
			class="userInvitation__steps"
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
				<Panel class="decision__stepPanel">
					<PanelSection class="decision__stepHeader">
						<h2>{{ store.stepTitle }}</h2>
						<p class="error">{{ store.errors.error }}</p>
						<p>{{ step.description }}</p>
					</PanelSection>
					<PanelSection v-for="section in step.sections" :key="section.id">
						<template v-if="step.type === 'review'">
							<Notification
								v-if="Object.keys(store.errors).length > 0"
								type="warning"
							>
								{{ t('invitation.wizard.errors') }}
							</Notification>
						</template>
						<component
							:is="acceptInvitationComponents[section.sectionComponent]"
							:key="section.sectionComponent"
							v-bind="section.props"
						/>
					</PanelSection>
				</Panel>
			</Step>
		</Steps>
		<ButtonRow class="panel panel--wide userInvitationForm__footer">
			<PkpButton @click="store.cancel">Cancel</PkpButton>
			<PkpButton v-if="!store.isOnFirstStep" @click="store.previousStep">
				Previous
			</PkpButton>
			<PkpButton
				v-if="!store.isOnFirstStep"
				:is-primary="true"
				@click="store.nextStep"
			>
				{{ store.stepButtonTitle }}
			</PkpButton>
		</ButtonRow>
	</div>
</template>

<script setup>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import PkpButton from '@/components/Button/Button.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';
import Steps from '@/components/Steps/Steps.vue';
import Step from '@/components/Steps/Step.vue';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';
import {useTranslation} from '@/composables/useTranslation';
import {ref} from 'vue';
import AcceptInvitationHeader from './AcceptInvitationHeader.vue';
import AcceptInvitationUserDetailsForms from './AcceptInvitationUserDetailsForms.vue';
import AcceptInvitationUserAccountDetails from './AcceptInvitationUserAccountDetails.vue';
import AcceptInvitationReview from './AcceptInvitationReview.vue';
import AcceptInvitationVerifyOrcid from './AcceptInvitationVerifyOrcid.vue';

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
	pageTitle: {
		type: String,
		required: true,
	},
	pageTitleDescription: {
		type: String,
		required: true,
	},
	/** valid invitation id */
	invitationId: {
		type: Number,
		required: true,
	},
	/** valid invitation key */
	invitationKey: {
		type: String,
		required: true,
	},
});

const {t} = useTranslation();
const wrapper = ref(null);
const store = useAcceptInvitationPageStore(props);

const acceptInvitationComponents = {
	AcceptInvitationUserDetailsForms,
	AcceptInvitationUserAccountDetails,
	AcceptInvitationVerifyOrcid,
	AcceptInvitationReview,
};
</script>

<style lang="less">
@import '../../styles/_import';

.userInvitation .app__pageHeading {
	display: flex;
	margin: 2rem 0 0.25rem;

	> .pkpButton {
		margin-inline-start: auto;
	}
}

.userInvitation .pkpSteps__buttonWrapper {
	border: @bg-border-light;
	border-bottom: 0;
	border-top-left-radius: @radius;
	border-top-right-radius: @radius;
}

.userInvitation__submissionDetails,
.userInvitation__submissionConfiguration {
	font-size: @font-sml;
	line-height: @line-sml;
}

// Override the form locale switcher styles
.userInvitation__stepForm .pkpFormLocales {
	border: none;
	margin-top: -1rem;
	margin-bottom: 1rem;
	padding-right: 0;

	.pkpFormLocales__locale--isPrimary {
		border: none;
	}
}

// Hide the form footer for each form, since
// buttons and errors are handled separately
.userInvitation__stepForm .pkpFormPage__footer {
	display: none;
}

// buttons and errors are handled separately
.userInvitationForm__footer {
	padding: 2rem;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	border: none;

	* + .pkpButton {
		margin-inline-start: 0.5rem;
	}
}
.error {
	color: red;
	font-weight: bold;
}
</style>
