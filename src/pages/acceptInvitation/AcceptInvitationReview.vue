<template>
	<div v-for="review in store.steps" :key="review.id">
		<div
			v-if="review.id === 'userCreate'"
			class="submissionWizard__reviewPanel"
		>
			<template v-if="review.id === 'userCreate'">
				<div class="submissionWizard__reviewPanel__header">
					<h3>
						{{ review.reviewName }}
					</h3>
				</div>
				<div
					v-for="(reviews, index) in review.reviewData"
					:key="index"
					class="submissionWizard__reviewPanel__item"
				>
					<h4 class="submissionWizard__reviewPanel__item__header">Email</h4>
					<div class="submissionWizard__reviewPanel__item__value">
						{{ reviews.email }}
					</div>
					<h4 class="submissionWizard__reviewPanel__item__header">Username</h4>
					<div class="submissionWizard__reviewPanel__item__value">
						{{ reviews.username }}
					</div>
					<h4 class="submissionWizard__reviewPanel__item__header">Password</h4>
					<div class="submissionWizard__reviewPanel__item__value">
						{{ reviews.password }}
					</div>
				</div>
			</template>
		</div>
		<div
			v-if="review.id === 'userDetails'"
			class="submissionWizard__reviewPanel"
		>
			<template v-if="review.id === 'userDetails'">
				<div class="submissionWizard__reviewPanel__header">
					<h3>
						{{ review.reviewName }}
					</h3>
					<pkp-button
						class="submissionWizard__reviewPanel__edit"
						@click="store.openStep(review.id)"
					>
						edit
					</pkp-button>
				</div>
				<div v-for="(sections, index) in review.sections" :key="index">
					<div
						v-if="sections.id === 'userCreateDetailsForm'"
						class="submissionWizard__reviewPanel__item"
					>
						<h4 class="submissionWizard__reviewPanel__item__header">
							ORCID iD
						</h4>
						<div class="submissionWizard__reviewPanel__item__value">
							<template v-for="field in sections.form.fields" :key="field.name">
								{{
									field.name === 'orcid'
										? field.value
											? field.value
											: t('common.noneProvided')
										: ''
								}}
							</template>
						</div>
						<template v-if="sections.form.errors.givenName">
							<notification
								v-for="(error, i) in sections.form.errors.givenName"
								:key="i"
								type="warning"
							>
								<icon icon="exclamation-triangle"></icon>
								{{ error }}
							</notification>
						</template>
						<h4 class="submissionWizard__reviewPanel__item__header">
							Given Name
						</h4>
						<div class="submissionWizard__reviewPanel__item__value">
							<template v-for="field in sections.form.fields" :key="field.name">
								{{
									field.name === 'givenName'
										? field.value
											? field.value
											: t('common.noneProvided')
										: ''
								}}
							</template>
						</div>
						<template v-if="sections.form.errors.familyName">
							<notification
								v-for="(error, i) in sections.form.errors.familyName"
								:key="i"
								type="warning"
							>
								<icon icon="exclamation-triangle"></icon>
								{{ error }}
							</notification>
						</template>
						<h4 class="submissionWizard__reviewPanel__item__header">
							Family Name
						</h4>
						<div class="submissionWizard__reviewPanel__item__value">
							<template v-for="field in sections.form.fields" :key="field.name">
								{{
									field.name === 'familyName'
										? field.value
											? field.value
											: t('common.noneProvided')
										: ''
								}}
							</template>
						</div>
						<template v-if="sections.form.errors.affiliation">
							<notification
								v-for="(error, i) in sections.form.errors.affiliation"
								:key="i"
								type="warning"
							>
								<icon icon="exclamation-triangle"></icon>
								{{ error }}
							</notification>
						</template>
						<h4 class="submissionWizard__reviewPanel__item__header">
							Affiliation
						</h4>
						<div class="submissionWizard__reviewPanel__item__value">
							<template v-for="field in sections.form.fields" :key="field.name">
								{{
									field.name === 'affiliation'
										? field.value
											? field.value
											: t('common.noneProvided')
										: ''
								}}
							</template>
						</div>
						<template v-if="sections.form.errors.country">
							<notification
								v-for="(error, i) in sections.form.errors.country"
								:key="i"
								type="warning"
							>
								<icon icon="exclamation-triangle"></icon>
								{{ error }}
							</notification>
						</template>
						<h4 class="submissionWizard__reviewPanel__item__header">
							Country of Affiliation
						</h4>
						<div class="submissionWizard__reviewPanel__item__value">
							<template v-for="field in sections.form.fields" :key="field.name">
								{{
									field.name === 'country'
										? field.value
											? field.value
											: t('common.noneProvided')
										: ''
								}}
							</template>
						</div>
					</div>
				</div>
			</template>
		</div>
		<div
			v-if="review.id === 'userCreateReview'"
			class="submissionWizard__reviewPanel"
		>
			<template v-if="review.id === 'userCreateReview'">
				<div class="submissionWizard__reviewPanel__header">
					<h3>
						{{ review.reviewName }}
					</h3>
				</div>
				<div
					v-for="(sectionData, index) in review.sections"
					:key="index"
					class="submissionWizard__reviewPanel__item"
				>
					<div
						v-if="section.id === 'userCreateRoles'"
						class="submissionWizard__reviewPanel__item"
					>
						<AcceptInvitationUserRoles :section="sectionData" />
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup>
import {defineProps} from 'vue';
import AcceptInvitationUserRoles from './AcceptInvitationUserRoles.vue';
import {useTranslation} from '@/composables/useTranslation';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

defineProps({
	section: {
		type: Object,
		default() {
			return null;
		},
	},
});

const {t} = useTranslation();
const store = useAcceptInvitationPageStore();
</script>
