<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<pkp-form v-bind="components.example" @set="set" />
</template>

<script>
import Container from '@/components/Container/Container.vue';
import form from '../helpers/form-user';

export default {
	extends: Container,
	data() {
		return {
			components: {
				example: {
					...form,
					errors: {
						email: ['Please provide a valid email address'],
						affiliation: {
							en_US: ['You must enter your affiliation in English.'],
							fr_CA: ['You must enter your affiliation in French.'],
							ar_AR: ['You must enter your affiliation in Arabic.']
						},
						'user-locales': ['You must select at least two options.'],
						bio: {
							fr_CA: [
								'Please provide a bio statement to accompany your publication.'
							]
						},
						country: ['Please select your country.'],
						'mailing-address': [
							'You must enter a mailing address where you can receive post.'
						]
					}
				}
			}
		};
	}
};
</script>
