<template>
	<!-- Stop pointer events reaching PrimeVue's menu wrapper, so it doesn't steal focus from the input. -->
	<div class="relative w-full p-3" @click.stop @mousedown.stop @mousemove.stop>
		<label class="relative block">
			<span class="-screenReader">{{ searchLabel }}</span>
			<input
				v-model="globalPhrase"
				type="search"
				class="block w-full appearance-none rounded border border-light pe-2 ps-14 text-lg-normal leading-8 focus:border-primary focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
				:placeholder="searchLabel"
				@keydown.stop
				@keyup.enter="onEnter"
			/>
			<span
				class="pointer-events-none absolute inset-y-0 start-0 flex w-10 items-center justify-center border-e border-light"
			>
				<Icon icon="Search" class="h-5 w-5 text-primary" />
			</span>
		</label>
	</div>
</template>

<script setup>
import {ref, watch} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import {t} from '@/utils/i18n.js';

const props = defineProps({
	/** Placeholder/label for the search input. */
	searchLabel: {
		type: String,
		default: () => t('common.search'),
	},
	/** The current search phrase. */
	searchPhrase: {
		type: String,
		default: '',
	},
});

const emit = defineEmits([
	/** Emitted with the input value when the user presses Enter. */
	'submit-search',
]);

// Local copy so typing isn't overwritten by the prop.
const globalPhrase = ref(props.searchPhrase);
watch(
	() => props.searchPhrase,
	(value) => (globalPhrase.value = value),
);

function onEnter() {
	emit('submit-search', globalPhrase.value);
}
</script>
