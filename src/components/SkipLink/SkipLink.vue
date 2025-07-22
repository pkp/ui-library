<template>
	<div
		class="sr-only focus-within:not-sr-only focus-within:absolute focus-within:left-4 focus-within:top-4 focus-within:z-50 focus-within:flex focus-within:flex-col focus-within:gap-2 focus-within:rounded focus-within:bg-secondary focus-within:p-3 focus-within:shadow"
	>
		<a
			v-for="link in links"
			:key="link.id"
			:href="`#{link.id}`"
			class="text-base-normal font-bold focus:text-primary focus:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
			@click="moveFocus(link.id)"
		>
			{{ link.label }}
		</a>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();
/**
 * After the URL hash jump, transfer keyboard focus to the
 * landmark so screen‑reader users hear the new region announced.
 */

const links = [
	{id: 'app-main', label: t('navigation.skip.main')},
	{id: 'app-nav', label: t('navigation.skip.nav')},
];

function moveFocus(id) {
	const main = document.getElementById(id);
	if (main) {
		main.setAttribute('tabindex', '-1');
		main.focus({preventScroll: true});
		main.addEventListener('blur', () => main.removeAttribute('tabindex'), {
			once: true,
		});
	}
}
</script>
