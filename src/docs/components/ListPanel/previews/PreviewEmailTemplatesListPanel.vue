<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<email-templates-list-panel v-bind="components.example" @set="set" />
</template>

<script>
import Container from '@/components/Container/Container.vue';
import EmailTemplatesListPanel from '@/components/ListPanel/emailTemplates/EmailTemplatesListPanel.vue';
import {propsEmailTemplatesListPanel} from '../config';

export default {
	extends: Container,
	components: {
		EmailTemplatesListPanel
	},
	data() {
		return {
			components: {
				example: {
					...propsEmailTemplatesListPanel,
					id: 'example'
				}
			}
		};
	}
};
</script>
