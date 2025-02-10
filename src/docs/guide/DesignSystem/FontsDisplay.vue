<template>
	<table class="min-w-full">
		<tr>
			<th class="text-left">Sample text</th>
			<th class="text-left">Class name</th>
			<th class="text-left">Size (px)</th>
			<th class="text-left">Weight</th>
			<th class="text-left">Line Height</th>
		</tr>
		<tr
			v-for="font in fonts"
			:key="font.className"
			:class="font.separator ? 'border-light border-t' : ''"
		>
			<td :class="font.className">{{ sampleText }}</td>
			<td>{{ font.className }}</td>
			<td>{{ font.sizePx }}</td>
			<td>{{ font.fontWeight }}</td>
			<td>{{ font.lineHeight }}</td>
		</tr>
	</table>
</template>

<script setup>
// needs to be explicitely listed to force tailwind to include them in css
const fontSizeDefinitions = [
	'text-xs-normal',
	'text-sm-light',
	'text-sm-normal',
	'text-base-light',
	'text-base-normal',
	'text-base-bold',
	'text-lg-normal',
	'text-lg-medium',
	'text-lg-semibold',
	'text-lg-bold',
	'text-xl-bold',
	'text-2xl-bold',
	'text-3xl-normal',
	'text-3xl-medium',
	'text-3xl-bold',
	'text-4xl-bold',
	'text-5xl-bold',
];
const sampleText = 'Lorem ipsum dolor sit amet';

const _getComputedStyleValue = (cssVar) => {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(cssVar)
		.trim();
};

let prevSizeRem = null;
const fonts = fontSizeDefinitions.map((className, i) => {
	const fontSizeValues = [
		_getComputedStyleValue(`--${className}`),
		{
			lineHeight: _getComputedStyleValue(`--${className}--line-height`),
			fontWeight: _getComputedStyleValue(`--${className}--font-weight`),
		},
	];

	const sizeRem = fontSizeValues[0];

	const showDividerBetweenSizes = prevSizeRem != sizeRem;
	prevSizeRem = sizeRem;
	return {
		className,
		sizePx: `${parseFloat(sizeRem) * 16}px`,
		fontWeight: fontSizeValues[1].fontWeight,
		lineHeight: `${parseFloat(fontSizeValues[1].lineHeight) * 16}px`,
		separator: showDividerBetweenSizes,
	};
});
</script>
