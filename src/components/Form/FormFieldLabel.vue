<template>
	<label :for="controlId" class="pkpFormFieldLabel">
		<template v-if="localeLabel">
			<span class="aria-hidden">{{ localeLabel }}</span>
			<span class="-screenReader">{{ multilingualLabel }}</span>
		</template>
		<template v-else>
			{{ label }}
		</template>
		<span v-if="isRequired" class="pkpFormFieldLabel__required">
			<span class="aria-hidden">*</span>
			<span class="-screenReader">{{ requiredLabel }}</span>
		</span>
	</label>
</template>

<script>
export default {
	name: 'FormFieldLabel',
	props: {
		controlId: String,
		label: String,
		localeLabel: String,
		multilingualLabel: String,
		isRequired: {
			type: Boolean,
			default: false
		},
		requiredLabel: String
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFormFieldLabel {
	font-weight: @bold;
}

.pkpFormFieldLabel__required {
	color: @no;
}
</style>
