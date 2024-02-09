<template>
	<div class="pkpFormField pkpFormField--html">
		<div class="pkpFormField__heading">
			<span class="pkpFormFieldLabel">
				{{ label }}
			</span>
			<tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				class="-screenReader"
				v-strip-unsafe-html="tooltip"
			/>
			<help-button
				v-if="helpTopic"
				:topic="helpTopic"
				:section="helpSection"
				:label="__('help.help')"
			/>
		</div>
		<div
			class="pkpFormField__control pkpFormField__control--html"
			v-strip-unsafe-html="description"
		/>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';

export default {
	name: 'FieldHtml',
	extends: FieldBase,
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField__control--html {
	font-size: @font-sml;
	line-height: 1.8em;

	p:first-child {
		margin-top: 0;
	}

	p:last-child {
		margin-bottom: 0;
	}
}
</style>
