<template>
	<button class="helpButton requestHelpPanel" :data-topic="topic" :data-section="section" @click.prevent>
		<icon icon="info-circle" />
		<span class="-screenReader">{{ label }}</span>
	</button>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'HelpButton',
	components: {
		Icon
	},
	props: {
		topic: {
			type: String,
			required: true
		},
		section: String,
		label: {
			type: String,
			required: true
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.helpButton {
	display: inline-block;
	border: none;
	padding: 0 0.25em;
	background: transparent;
	cursor: pointer;
}
</style>
