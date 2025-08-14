<template>
	<div>
		<div class="pkpDialogBody">
			<DialogDescription>
				<slot>
					<div
						v-if="message"
						v-strip-unsafe-html="message"
						class="pkpDialogBody__message"
					/>
				</slot>
			</DialogDescription>
		</div>
		<div class="pkpDialogBody__footer">
			<slot name="actions">
				<PkpButton
					v-for="action in actions"
					:key="action.label"
					:element="action.element || 'button'"
					:href="action.href || null"
					:is-primary="action.isPrimary || null"
					:is-secondary="action.isSecondary || null"
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
.pkpDialogBody {
	padding-left: var(--pkp-spacing-12);
	padding-right: var(--pkp-spacing-12);
}

.pkpDialogBody--hasIcon {
	padding-left: var(--pkp-spacing-24);
	padding-right: var(--pkp-spacing-24);
}

.pkpDialogBody__message {
	font: var(--pkp-font-base-normal);
	color: var(--pkp-text-color-default);
}

.pkpDialogBody__footer {
	display: flex;
	align-items: center;
	gap: var(--pkp-spacing-4);
	padding: var(--pkp-spacing-12);
}

.pkpDialogBody__footer--hasIcon {
	padding: var(--pkp-spacing-10);
	padding-inline-start: var(--pkp-spacing-24);
}
</style>
