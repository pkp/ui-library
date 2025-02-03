<template>
	<table class="min-w-full">
		<tr>
			<th class="text-left">Sample text</th>
			<th class="text-left">Class Name</th>
			<th class="text-left">Size (px)</th>
			<th class="text-left">Weight</th>
			<th class="text-left">Line Height</th>
		</tr>
		<tr
			v-for="font in fonts"
			:key="font.className"
			:class="font.separator ? 'border-t border-light' : ''"
		>
			<td :class="font.className">{{ sampleText }}</td>
			<td>
				<Popover>
					<template #button>
						<span style="font-weight: 400">{{ font.className }}</span>
					</template>
					<div>
						<strong>{{ font.className }}</strong>
						<br />
						<table
							class="border-gray-300 mt-1 w-full border-collapse border text-left"
						>
							<tbody>
								<tr>
									<td colspan="2" class="py-1 text-center font-semibold">
										CSS Variable Names
									</td>
								</tr>
								<tr>
									<td class="border-gray-300 border px-2 py-1">Size</td>
									<td class="border-gray-300 border px-2 py-1">
										<i>{{ font.cssVar }}</i>
									</td>
								</tr>
								<tr>
									<td class="border-gray-300 border px-2 py-1">Font Weight</td>
									<td class="border-gray-300 border px-2 py-1">
										<i>{{ font.fwCssVar }}</i>
									</td>
								</tr>
								<tr>
									<td class="border-gray-300 border px-2 py-1">Line Height</td>
									<td class="border-gray-300 border px-2 py-1">
										<i>{{ font.lhCssVar }}</i>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</Popover>
			</td>
			<td>{{ font.sizePx }}</td>
			<td>{{ font.fontWeight }}</td>
			<td>{{ font.lineHeight }}</td>
		</tr>
	</table>
</template>

<script setup>
import TailwindConfig from '../../../../tailwind.config.js';
import Popover from '@/components/Popover/Popover.vue';

// needs to be explicitely listed to force tailwind to include them in css
[
	[
		[
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
		],
	],
];
const sampleText = 'Lorem ipsum dolor sit amet';
const fontSizesObject = TailwindConfig.theme.fontSize;

let prevSizeRem = null;

const _getComputedStyleValue = (cssVar) => {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(cssVar)
		.trim();
};
const fonts = Object.keys(fontSizesObject).map((className, i) => {
	const fontSizeValues = fontSizesObject[className];
	const cssVar = fontSizeValues[0].replace(/^var\((.+)\)$/, '$1');
	const fwCssVar = fontSizeValues[1].fontWeight.replace(/^var\((.+)\)$/, '$1');
	const lhCssVar = fontSizeValues[1].lineHeight.replace(/^var\((.+)\)$/, '$1');

	const sizeRem = _getComputedStyleValue(cssVar);

	const showDividerBetweenSizes = prevSizeRem != sizeRem;
	prevSizeRem = sizeRem;
	return {
		className: 'text-' + className,
		sizePx: `${parseFloat(sizeRem) * 16}px`,
		fontWeight: _getComputedStyleValue(fwCssVar),
		lineHeight: `${parseFloat(_getComputedStyleValue(lhCssVar)) * 16}px`,
		separator: showDividerBetweenSizes,
		cssVar,
		fwCssVar,
		lhCssVar,
	};
});
</script>
