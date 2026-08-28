<template>
	<span ref="root" :class="cn('root')">
		<slot />
	</span>
</template>

<script setup>
/**
 * Attach a click handler to <button>s that appear inside
 * of translated strings.
 *
 * When a part of a localized string needs a clickable button,
 * it is not possible to attach event handlers to the button,
 * because it forms part of the translated string.
 *
 * Example:
 *
 * You can <button>report this comment</a> for inappropriate content.
 *
 * This component will pass one or more click handlers to any
 * <button> elements within the string content.
 *
 * Usage:
 *
 * <PkpButtonPartialPhrase :click-handlers="[callback]">
 *   <span v-html="t('localized.phrase')" />
 * </PkpButtonPartialPhrase>
 *
 * Output is equivalent to:
 *
 * <span class="PkpButtonPartialPhrase">
 * 	You can <button @click="callback">report this comment</button>
 *  for inappropriate content.
 * </span>
 *
 * If the localised string contains more than one button, you can
 * pass multiple click handlers in the same order as the buttons
 * appear.
 *
 * <PkpButtonPartialPhase :click-handlers="[edit, delete]">
 * 	You can <button>edit</button> or <button>delete</button> this.
 * </PkpButtonPartialPhrase>
 *
 * WARNING: this will break if the translated string reverses the
 * order of buttons. If the phrase may need to change the order
 * of buttons to be translated, consider a different approach.
 */
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {onBeforeUnmount, onMounted, ref, useTemplateRef} from 'vue';

const props = defineProps({
	clickHandlers: {type: Array, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpButtonPartialPhrase', props.styles);

const el = useTemplateRef('root');
const buttons = ref([]);

onMounted(() => {
	buttons.value = el?.value?.querySelectorAll('button') ?? [];
	buttons.value.forEach((button, i) => {
		if (props.clickHandlers[i]) {
			button.addEventListener('click', props.clickHandlers[i]);
		}
	});
});

onBeforeUnmount(() => {
	buttons.value.forEach((button, i) => {
		if (props.clickHandlers[i]) {
			button.removeEventListener('click', props.clickHandlers[i]);
		}
	});
});
</script>
