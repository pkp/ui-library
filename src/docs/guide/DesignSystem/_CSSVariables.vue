<template>
	<table class="min-w-full divide-y divide-light">
		<tr class="">
			<th class="text-left rtl:text-right">Variable</th>
			<th class="px-2 text-left rtl:text-right">Value</th>
		</tr>
		<tr v-for="(variable, index) in cssVariables" :key="index">
			<td class="whitespace-nowrap rtl:text-right" dir="ltr">
				{{ variable.name }}
			</td>
			<td class="inline-flex p-2">
				<div
					v-if="variable.styles"
					class="h-6 w-6"
					:style="variable.styles"
				></div>
				<span class="px-1" dir="ltr">{{ variable.value }}</span>
			</td>
		</tr>
	</table>
</template>

<script setup>
import {ref, onMounted} from 'vue';

const cssVariables = ref([]);

onMounted(() => {
	const vars = [];

	for (const sheet of document.styleSheets) {
		try {
			for (const rule of sheet.cssRules) {
				if (rule.style) {
					let primaryColor;
					for (let i = 0; i < rule.style.length; i++) {
						const prop = rule.style[i];
						if (prop.startsWith('--') && !prop.startsWith('--tw')) {
							const value = rule.style.getPropertyValue(prop).trim();

							if (prop === '--color-primary') {
								primaryColor = value;
							}
							let styles;
							if (prop.includes('color')) {
								styles = {
									backgroundColor: value,
								};
							} else if (prop.includes('shadow')) {
								styles = {
									boxShadow: value,
									borderRadius: '1px',
								};
							} else if (prop.includes('radius')) {
								styles = {
									backgroundColor: primaryColor,
									borderRadius: value,
								};
							}

							vars.push({
								name: prop,
								value,
								styles,
							});
						}
					}
				}
			}
		} catch (error) {
			console.warn('Cannot get all the stylesheets on the page.', error);
		}
	}

	cssVariables.value = vars;
});
</script>
