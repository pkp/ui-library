<template>
	<help-button :topic="topic" :label="label" />
</template>

<script>
import HelpButton from '@/components/HelpButton/HelpButton.vue';

export default {
	name: 'ViweHelpButton',
	components: {
		HelpButton,
	},
	data: function () {
		return {
			topic: 'user-profile.md',
			label: 'Help',
		};
	},
};
</script>
