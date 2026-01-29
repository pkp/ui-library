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
