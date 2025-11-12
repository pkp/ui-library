<template>
	<div class="pkpFormField pkpFormField--html">
		<div class="pkpFormField__heading">
			<span class="pkpFormFieldLabel align-middle">
				{{ label }}
			</span>
			<Tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
		</div>
		<div
			v-strip-unsafe-html="description"
			class="pkpFormField__control pkpFormField__control--html semantic-defaults"
		/>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';

export default {
	name: 'FieldHtml',
	components: {Tooltip},
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
