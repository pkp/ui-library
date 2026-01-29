<template>
	<DialogRoot :class="cn('root')" :open="opened">
		<DialogPortal>
			<DialogOverlay :class="cn('overlay')" />
			<div :class="cn('positionContainer')">
				<DialogContent
					:class="[cn('content'), cn('content', {modifier: size})]"
				>
					<DialogClose
						v-if="showCloseButton"
						:class="cn('close')"
						aria-label="Close"
						@click="onClose"
					>
						<PkpIcon icon="Cancel" />
					</DialogClose>
					<DialogTitle :class="cn('title')">{{ title }}</DialogTitle>
					<DialogDescription as-child :class="cn('body')">
						<component
							:is="bodyComponent"
							v-if="bodyComponent"
							v-bind="bodyProps"
						/>
						<div v-else v-strip-unsafe-html="message" />
					</DialogDescription>
					<div v-if="actions?.length" :class="cn('actionButtons')">
						<pkp-button
							v-for="action in actions"
							:key="action.label"
							:href="action.href || null"
							:is-primary="action.isPrimary || null"
							:is-secondary="action.isSecondary || null"
							@click="action.callback ? fireCallback(action.callback) : null"
						>
							{{ action.label }}
						</pkp-button>
					</div>
				</DialogContent>
			</div>
		</DialogPortal>
	</DialogRoot>
</template>

<script setup>
import {ref} from 'vue';
import {
	DialogRoot,
	DialogPortal,
	DialogOverlay,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from 'reka-ui';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	/** Used only internally, don't pass this prop via openDialog */
	opened: {type: Boolean, default: false},
	/** Title of the dialog */
	title: {type: String, required: false, default: ''},
	/** Message to be displayed, for more complex messages use bodyComponent&bodyProps */
	message: {type: String, default: null},
	/** For more complex messages Vue.js component can be passed */
	bodyComponent: {type: [Object, String], default: null},
	/** Props to be passed to bodyComponent */
	bodyProps: {type: Object, default: null},
	/** Array of button props to display actions, following props are passed to button component: label, element, href, isPrimary, isWarnable, callback */
	actions: {type: Array, default: () => []},
	/** Defines if the close button (x) should be shown */
	showCloseButton: {type: Boolean, default: false},
	/** Callback when dialog is being closed by close button */
	close: {type: Function, default: null},
	/** Dialog size variant */
	size: {
		type: String,
		default: 'default',
		validator: (value) => ['default', 'large'].includes(value),
	},
	styles: {
		type: Object,
		default: () => ({}),
	},
});

const {cn} = usePkpStyles(props.styles);

const emit = defineEmits(['close']);

// for components that doesn't manually handle loading state
const isDialogLoading = ref(false);

function fireCallback(callback) {
	isDialogLoading.value = true;
	if (typeof callback === 'function') {
		callback(() => {
			emit('close');
		});
	}
}

function onClose() {
	if (props.close) {
		props.close();
	}
	emit('close');
}
</script>

<style>
/**
 * PkpDialog - Structural Styles
 *
 * These styles handle the core positioning, responsiveness, and layout
 * of the dialog component. Visual styling (colors, shadows, padding, etc.)
 * should be handled by the theme (dialog.less).
 *
 * This style block is intentionally NOT scoped so themes can override
 * when necessary.
 */

/* Overlay: just the backdrop */
.PkpDialog__overlay {
	position: fixed;
	inset: 0;
	z-index: 30;
}

/* Position container: handles centering */
.PkpDialog__positionContainer {
	position: fixed;
	inset: 0;
	z-index: 40;
	overflow-y: auto;
	display: flex;
	align-items: flex-end; /* Mobile: bottom-aligned */
	justify-content: center;
	padding: 1rem;
	pointer-events: none; /* Allow clicks to pass through to overlay */
}

@media (min-width: 640px) {
	.PkpDialog__positionContainer {
		align-items: center; /* Desktop: centered */
		padding: 0;
	}
}

/* Content panel - base structural styles */
.PkpDialog__content {
	position: relative;
	z-index: 100;
	width: 100%;
	max-height: calc(100vh - 2rem);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	pointer-events: auto; /* Re-enable clicks on the dialog itself */
}

@media (min-width: 640px) {
	.PkpDialog__content {
		max-height: 85vh;
		margin: 2rem 0;
	}
}

/* Size variants */
.PkpDialog__content--default {
	max-width: 28rem; /* ~450px - simple dialogs */
}

.PkpDialog__content--large {
	max-width: 50rem; /* ~800px - content-rich modals */
}

/* Body: scrollable content area */
.PkpDialog__body {
	flex: 1;
	overflow-y: auto;
	min-height: 0;
}

.PkpDialog__content:focus {
	outline: none;
}

/* Action buttons: stay at bottom */
.PkpDialog__actionButtons {
	flex-shrink: 0;
	display: flex;
}

/* Close button: structural positioning */
.PkpDialog__close {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
