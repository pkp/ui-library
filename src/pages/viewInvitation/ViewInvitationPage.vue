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
				<panel class="decision__stepPanel">
					<panel-section class="decision__stepHeader">
						<h2>{{ store.stepTitle }}</h2>
						<p class="error">{{ store.errors.error }}</p>
						<p>{{ step.description }}</p>
					</panel-section>
					<panel-section v-for="section in step.sections" :key="section.id">
						<component
							:is="userInvitationComponents[section.sectionComponent]"
							:key="section.sectionComponent"
							:section="section"
						/>
					</panel-section>
				</panel>
			</step>
		</steps>
		<button-row class="panel panel--wide userInvitationForm__footer">
			<pkp-button @click="store.cancel">Cancel</pkp-button>
			<pkp-button @click="store.previousStep">Previous</pkp-button>
			<pkp-button :is-primary="true" @click="store.nextStep">
				<template v-if="store.isOnLastStep">Invite user to role</template>
				<template v-else-if="store.isOnFirstStep">Save and Continue</template>
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
import {defineProps} from 'vue';
import ViewInvitationDetails from './ViewInvitationDetails.vue';
import {useTranslation} from '@/composables/useTranslation';
import {useUserInvitationPageStore} from '../userInvitation/UserInvitationPageStore';

// defineProps({
//     section: {
//         type: Object,
//         default() {
//             return null;
//         },
//     },
// });

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
	/** Url for redirect to invitations */
	userInvitationSavedUrl: {
		type: String,
		required: true,
	},
	/** Url for redirect to invitations */
	userGroups: {
		type: Array,
		required: true,
	},
	currentUserGroups: {
		type: Array,
		required: true,
	},
});
console.log(props);

const {t} = useTranslation();
const store = useUserInvitationPageStore(props);
const userInvitationComponents = {
	ViewInvitationDetails,
};
</script>
