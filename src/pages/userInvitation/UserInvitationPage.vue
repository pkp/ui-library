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
						<template v-if="step.type === 'email'">
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
							:section="section"
						/>
					</panel-section>
					<!-- <template v-if="step.type === 'form' && step.sections.length > 0">
						<panel-section v-for="section in step.sections" :key="section.id">
							<UserInvitationDetailsFormStep :section="section" />
						</panel-section>
					</template>
					<template v-if="step.type === 'form' && step.sections.length === 0">
						<panel-section :key="step.id">
							<UserInvitationSearchFormStep
								:email-field="store.emailField"
								:username-field="store.usernameField"
								:orcid-field="store.orcidField"
								:email-change="store.emailChange"
								:orcid-change="store.usernameChange"
								:username-change="store.orcidChange"
							/>
						</panel-section>
					</template>
					<template v-else-if="step.type === 'email'">
						<panel-section v-for="section in step.sections" :key="section.id">
							<notification
								v-if="Object.keys(store.errors).length"
								type="warning"
							>
								{{ t('invitation.wizard.errors') }}
							</notification>
							<UserInvitationEmailComposerStep
								:id="step.id"
								:section="section"
								:update-step="store.updateStep"
								:email-templates-api-url="emailTemplatesApiUrl"
							/>
						</panel-section>
					</template> -->
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
		<modal
			:close-label="t('common.close')"
			:name="t('invitation.notification.title')"
			:title="t('invitation.notification.title')"
			:open="store.isModalOpened"
			@close="store.isModalClosed"
		>
			<div class="userInvitationModal__body userInvitationModal__body_success">
				{{ t('invitation.wizard.success', {email: store.email}) }}
			</div>
			<pkp-button @click="store.isModalClosed">
				{{ t('invitation.notification.closeBtn') }}
			</pkp-button>
		</modal>
	</div>
</template>

<script setup>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Modal from '@/components/Modal/Modal.vue';
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
	/** API url search user */
	searchUserApiUrl: {
		type: String,
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
	/** API url for send email invitations for users */
	inviteUserApiUrl: {
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
	/** Url for redirect to invitations */
	userInvitationSavedUrl: {
		type: String,
		required: true,
	},
	/** all user groups */
	userGroups: {
		type: Array,
		required: true,
	},
	/** User object for edit invitations */
	user: {
		type: Object,
		default() {
			return null;
		},
	},
	invitationPayload: {type: Object, required: true},
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

// Review step
.submissionWizard__reviewPanel {
	border: @bg-border-light;
	border-radius: @radius;

	+ .submissionWizard__reviewPanel {
		margin-top: 2rem;
	}
}

.submissionWizard__reviewPanel__header {
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	border-bottom: @bg-border-light;

	h3 {
		margin: 0;
		font-size: @font-base;
		line-height: @line-base;
	}
}

.submissionWizard__reviewPanel__edit {
	margin-inline-start: auto;
}

.submissionWizard__reviewPanel__body {
	font-size: @font-sml;
	line-height: @line-sml;
}

.submissionWizard__reviewPanel__list {
	margin: 0;
	padding: 0;
	list-style: none;

	li {
		display: flex;
		align-items: center;
		margin: 1rem;
	}

	.pkpBadge {
		white-space: nowrap;
	}
}

.submissionWizard__reviewPanel__list__name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.submissionWizard__reviewPanel__list__actions {
	margin-inline-start: auto;
	white-space: nowrap;

	> * {
		margin-inline-start: 0.5rem;
	}
}

.submissionWizard__review_errors {
	margin-bottom: 2rem;
}

.submissionWizard__reviewPanel__fileLink {
	display: block;
	margin-left: -0.25rem;
	padding: 0.25rem;
	border: 1px solid transparent;
	border-radius: @radius;
	color: @text;
	text-decoration: none;

	&:hover,
	&:focus {
		color: @text;
		border-color: @primary;
		outline: 0;
	}
}

.submissionWizard__reviewPanel__download {
	text-align: center;
}

.submissionWizard__reviewPanel__item {
	padding: 1rem;
	border-bottom: @bg-border-light;

	&:last-child {
		border-bottom: none;
	}

	.pkpNotification {
		margin-bottom: 0.5rem;
	}
}

.submissionWizard__reviewPanel__item__header,
.submissionWizard__reviewPanel__item__value {
	margin: 0;
	font-size: @font-sml;
	line-height: @line-sml;
}

.submissionWizard__reviewPanel__item__value {
	> p:first-child,
	> ul:first-child {
		margin-top: 0;
	}

	> p:last-child,
	> ul:last-child {
		margin-bottom: 0;
	}
}

.submissionWizard__reviewEmptyWarning {
	margin: 1rem;
}

// When the data being reviewed is a list of items
ul.submissionWizard__reviewPanel__item__value {
	margin: 0;
	padding: 0;
	list-style: none;
}

// A table used for a review
.submissionWizard__reviewPanel__body {
	.pkpTable {
		border: none;
	}
}

.submissionWizard__reviewPanel__citation,
+ .submissionWizard__reviewPanel__citation {
	margin-top: 1rem;
}

.submissionWizard__footer {
	padding: 2rem;
	background: @lift;
	border: @bg-border-light;
	border-top: none;
}

.submissionWizard__lastSaved {
	margin-right: 0.5rem;
	font-size: @font-sml;
	line-height: @line-sml;
}

.submissionWizard__lastSaved--disconnected {
	color: @no-red;

	.pkpSpinner:before {
		border-top-color: @no-red;
		border-left-color: @no-red;
	}
}

// Loading screen when review is opened
.submissionWizard__loadingReview {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 2;
	transition: opacity 0.3s;
	background: rgba(255, 255, 255, 0.75);
	text-align: center;
	font-size: @font-sml;
}

.submissionWizard__reviewLoading-enter,
.submissionWizard__reviewLoading-leave-to {
	opacity: 0;
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
