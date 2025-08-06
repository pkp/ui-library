<template>
	<div>
		<div class="pkp-dialog-body">
			<DialogDescription>
				<slot>
					<div
						v-if="message"
						v-strip-unsafe-html="message"
						class="pkp-dialog-body__message"
					/>
				</slot>
			</DialogDescription>
		</div>
		<div class="pkp-dialog-body__footer">
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
			<PkpSpinner v-if="isLoading || isDialogLoading" />
		</div>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import PkpSpinner from '@/frontend/components/PkpSpinner/PkpSpinner.vue';
import {DialogDescription} from 'reka-ui';

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

<style>
.pkp-dialog-body {
	padding-left: var(--pkp-spacing-12);
	padding-right: var(--pkp-spacing-12);
}

.pkp-dialog-body--has-icon {
	padding-left: var(--pkp-spacing-24);
	padding-right: var(--pkp-spacing-24);
}

.pkp-dialog-body__message {
	font: var(--pkp-font-base-normal);
	color: var(--pkp-text-color-default);
}

.pkp-dialog-body__footer {
	display: flex;
	align-items: center;
	gap: var(--pkp-spacing-4);
	padding: var(--pkp-spacing-12);
}

.pkp-dialog-body__footer--has-icon {
	padding: var(--pkp-spacing-10);
	padding-inline-start: var(--pkp-spacing-24);
}
</style>
