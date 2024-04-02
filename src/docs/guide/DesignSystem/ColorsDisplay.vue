<template>
	<table class="min-w-full divide-y divide-light">
		<tr>
			<th class="text-left">Colour</th>
			<th class="px-2 text-left">Class name</th>
			<th class="px-2 text-left">Value</th>
			<th class="px-2 text-left">Used In</th>
		</tr>
		<tr v-for="color in colors" :key="color.className">
			<!-- First column -->
			<td
				v-if="displayAs === 'background'"
				:class="color.classNameToApply"
				class="h-16 w-24"
			></td>
			<td v-else-if="displayAs === 'text'" :class="color.classNameToApply">
				{{ sampleText }}
			</td>
			<td v-else-if="displayAs === 'border'">
				<div class="h-6 w-6 border-2" :class="color.classNameToApply" />
			</td>

			<!-- First column -->

			<td class="whitespace-nowrap px-2">{{ color.className }}</td>
			<td class="px-2">{{ color.value }}</td>
			<td class="whitespace-pre-line px-2">
				{{ color.usedIn }}
			</td>
		</tr>
	</table>
</template>

<script setup>
import {defineProps} from 'vue';
const sampleText = 'Lorem ipsum dolor';

const {colorUsedIn, colorDefinition, displayAs} = defineProps({
	displayAs: {
		type: String,
		default: 'background',
		validator(value) {
			return ['background', 'text', 'border'].includes(value);
		},
	},
	colorUsedIn: Object,
	colorDefinition: Object,
});
// needs to be explicitely listed to force tailwind to include them in css
[
	// common ones
	'bg-primary',
	'bg-hover',
	'bg-attention',
	'bg-success',
	'bg-negative',
	'bg-stage-desk-review',
	'bg-stage-in-review',
	'bg-stage-copyediting',
	'bg-stage-production',
	'bg-stage-scheduled-for-publishing',
	'bg-stage-incomplete-submission',
	'bg-stage-published',
	'bg-stage-declined',
	'bg-profile-1',
	'bg-profile-2',
	'bg-profile-3',
	'bg-profile-4',
	'bg-profile-5',
	'bg-profile-6',
	'bg-transparent',
	// text specific
	'text-default',
	'text-secondary',
	'text-on-dark',
	'text-heading',
	'text-disabled',
	// bg specific
	'bg-default',
	'bg-secondary',
	'bg-tertiary',
	'bg-blur',
	'bg-selection-light',
	'bg-selection-dark',
	'bg-disabled',
	// border specific
	'border-light',
	'border-dark',
];

const colors = Object.keys(colorUsedIn).map((className) => {
	let classNameToApply = `bg-${className}`;

	if (displayAs === 'text') {
		classNameToApply = `text-${className}`;
		if (className === 'on-dark') {
			classNameToApply += ' bg-primary';
		}
	} else if (displayAs === 'border') {
		classNameToApply = `border-${className}`;
	}
	return {
		className: classNameToApply,
		classNameToApply,
		value: colorDefinition[className],
		usedIn: colorUsedIn[className].trim(),
	};
});
</script>
