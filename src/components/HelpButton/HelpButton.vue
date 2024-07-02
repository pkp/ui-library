<template>
	<button
		class="helpButton requestHelpPanel"
		:data-topic="topic"
		:data-section="section"
		@click.prevent
	>
		<Icon class="h-5 w-5 text-primary" icon="Help" />
		<span class="-screenReader">{{ label }}</span>
	</button>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'HelpButton',
	components: {Icon},
	props: {
		/** Which topic to open in the help panel. This will correspond with one of the `.md` files used in the help panel. Do not include the `.md` extension. */
		topic: {
			type: String,
			required: true,
		},
		/** Open the help panel to a particular section of the topic. This must match one of the named anchors in the topic page, such as `<a name="workflow-library"></a>`. */
		section: String,
		/** A localized label for screen readers. In English this should be "Help". */
		label: {
			type: String,
			required: true,
		},
	},
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
