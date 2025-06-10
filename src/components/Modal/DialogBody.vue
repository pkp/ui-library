<template>
	<div class="modal-content" :class="hasIcon ? 'px-24' : 'pt- px-12'">
		<slot>
			<div
				v-if="message"
				v-strip-unsafe-html="message"
				class="semantic-defaults"
			/>
		</slot>
	</div>

	<div
		class="flex items-center gap-x-4"
		:class="hasIcon ? 'p-10 ps-24' : 'p-12'"
	>
		<slot name="actions">
			<PkpButton
				v-for="action in actions"
				:key="action.label"
				:element="action.element || 'button'"
				:href="action.href || null"
				:is-primary="action.isPrimary || null"
				:is-warnable="action.isWarnable || null"
				:is-disabled="isLoading"
				@click="action.callback ? fireCallback(action.callback) : null"
			>
				{{ action.label }}
			</PkpButton>
		</slot>

		<Spinner v-if="isLoading || isDialogLoading" />
	</div>
</template>

<script setup>
import {ref} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const props = defineProps({
	message: {
		type: String,
		required: true,
	},
	actions: {type: Array, default: () => []},
	hasIcon: Boolean,
	onClose: {
		type: Function,
		default: () => () => {},
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
});

// for components that doesn't manually handle loading state
const isDialogLoading = ref(props.isLoading);

function fireCallback(callback) {
	isDialogLoading.value = true;
	if (typeof callback === 'function') {
		callback(() => {
			props.onClose?.();
		});
	}
}
</script>
