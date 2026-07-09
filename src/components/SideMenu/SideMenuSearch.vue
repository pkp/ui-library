<template>
	<!-- Stop pointer events reaching PrimeVue's menu wrapper, so it doesn't steal focus from the input. -->
	<div class="relative w-full p-3" @click.stop @mousedown.stop @mousemove.stop>
		<label class="relative block">
			<span class="-screenReader">{{ searchLabel }}</span>
			<input
				:id="inputId"
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
			<button
				v-if="globalPhrase"
				class="absolute inset-y-0 end-0 w-8 text-negative hover:bg-negative hover:text-on-dark focus:bg-negative focus:text-on-dark"
				:aria-controls="inputId"
				@click.prevent="clearGlobalPhrase"
				@keydown.enter.prevent="clearGlobalPhrase"
				@keydown.space.prevent="clearGlobalPhrase"
			>
				<Icon icon="Cancel" class="relative bottom-[2px] h-4 w-4" />
				<span class="-screenReader">{{ t('common.clearSearch') }}</span>
			</button>
		</label>
	</div>
</template>

<script setup>
import {ref, watch, useId} from 'vue';
import {t} from '@/utils/i18n.js';
import Icon from '@/components/Icon/Icon.vue';

const inputId = useId();

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

function clearGlobalPhrase() {
	globalPhrase.value = '';
	emit('submit-search', '');
}
</script>
