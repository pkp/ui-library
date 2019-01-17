<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<pkp-form
		v-bind="forms.example"
		@set-fields="setFormFields"
		@set-errors="setFormErrors"
		@set-visible-locales="setFormVisibleLocales"
	/>
</template>

<script>
import SettingsContainer from '@/components/SettingsContainer/SettingsContainer.vue';
import {props} from '../config';

export default {
	extends: SettingsContainer,
	data() {
		return {
			forms: {
				example: props
			}
		};
	}
};
</script>
