<template>
	<div class="userInvitation">
		<UserInvitationHeader
			:page-title="store.pageTitle"
			:page-title-description="store.pageTitleDescription"
		/>
		<steps
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
			<step
				v-for="step in store.steps"
				:id="step.id"
				:key="step.id"
				:label="step.name"
			>
				<panel
					v-if="store.currentStep.id === step.id"
					class="decision__stepPanel"
				>
					<panel-section class="decision__stepHeader">
						<h2>{{ store.stepTitle }}</h2>
						<p class="error">{{ store.errors.error }}</p>
						<p>{{ step.description }}</p>
					</panel-section>
					<panel-section v-for="section in step.sections" :key="section.id">
						<component
							:is="userInvitationComponents[section.sectionComponent]"
							:key="section.sectionComponent"
							v-bind="section.props"
						/>
					</panel-section>
				</panel>
			</step>
		</steps>
		<button-row class="panel panel--wide userInvitationForm__footer">
			<pkp-button @click="store.cancel">Cancel</pkp-button>
			<pkp-button @click="store.previousStep">Previous</pkp-button>
			<pkp-button :is-primary="true" @click="store.nextStep">
				{{ store.currentStep.nextButtonLabel }}
			</pkp-button>
		</button-row>
	</div>
</template>

<script setup>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import PkpButton from '@/components/Button/Button.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';
import Steps from '@/components/Steps/Steps.vue';
import Step from '@/components/Steps/Step.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';
import {useTranslation} from '@/composables/useTranslation';
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
});
const {t} = useTranslation();
const wrapper = ref(null);
const store = useUserInvitationPageStore(props);
const userInvitationComponents = {
	UserInvitationDetailsFormStep,
	UserInvitationSearchFormStep,
	UserInvitationEmailComposerStep,
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

.submissionWizard__steps {
	margin-top: 2rem;
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
.userInvitationModal__body {
	padding: 0.5rem 0.75rem;
}
.userInvitationModal__body_success {
	box-shadow: inset 0.25rem 0 #00b24e;
}
</style>
