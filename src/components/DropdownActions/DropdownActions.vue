<template>
	<div
		class="relative inline-block items-start justify-between"
		:class="{'leading-none': displayAsEllipsis}"
	>
		<DropdownMenuRoot :modal="false" :dir="dir">
			<DropdownMenuTrigger
				ref="buttonTriggerRef"
				:class="menuButtonStyle"
				:aria-label="displayAsEllipsis ? label : ariaLabel"
			>
				<span v-if="!displayAsEllipsis">{{ label }}</span>
				<Icon
					v-if="buttonVariant === 'dropdown'"
					class="h-5 w-5 text-primary"
					icon="Dropdown"
					aria-hidden="true"
				/>
				<Icon
					v-else-if="displayAsEllipsis"
					class="relative h-6 w-6"
					icon="MoreOptions"
					aria-hidden="true"
				/>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				:align="direction === 'right' ? 'start' : 'end'"
				:side-offset="4"
				:collision-padding="8"
				position-strategy="absolute"
				class="z-10 flex w-fit min-w-[96px] flex-col border border-light bg-secondary shadow focus:outline-none"
				@focus-outside.prevent
			>
				<template v-for="(action, i) in actions" :key="i">
					<DropdownMenuItem
						v-if="isValidAction(action)"
						as-child
						:disabled="action.disabled || false"
						@select="handleSelect(action)"
					>
						<PkpButton
							:element="action.url ? 'a' : 'button'"
							:href="action.url"
							:icon="action.icon"
							:is-warnable="action.isWarnable"
							:class="i !== actions.length - 1 ? 'border-b' : ''"
							size-variant="fullWidth"
							:is-disabled="action.disabled || false"
							class="whitespace-nowrap border-light focus:outline-none data-[highlighted]:!border-transparent data-[highlighted]:!bg-selection-dark data-[highlighted]:!text-on-dark"
						>
							{{ action.label }}
						</PkpButton>
					</DropdownMenuItem>
				</template>
			</DropdownMenuContent>
		</DropdownMenuRoot>
	</div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from 'reka-ui';
import {useDirection} from '@/composables/useDirection';

import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	/**
	 * An array of action objects.
	 * Each object should contain
	 * 	`label` (string),
	 * 	`url` (string) to navigate to if the action involves a link, or
	 * 	`name` (string) to perform the action when clicked, an optional
	 * 	`icon` (string) and
	 * 	`isWarnable` (boolean) if the button needs the "warning" button styling from `<Button>` component.
	 *  `disabled` (boolean) when the item is not available
	 *  `actionFn` (function) its possible to provide action function directly to be triggered instead of the emit, useful for plugins
	 * */
	actions: {
		type: Array,
		required: true,
		validator: (actions) => {
			return actions.every((action) => {
				const hasLabel =
					typeof action.label === 'string' && action.label.trim() !== '';
				const hasAction = action.url || action.name;
				return hasLabel && hasAction;
			});
		},
	},
	/** Arguments that are passed as second argument to the emit */
	actionArgs: {
		type: Object,
		required: false,
		default: () => null,
	},
	/** The text label for the button. This is required. If buttonVariant is `ellipsis`, the label will be used for accessibility. */
	label: {
		type: String,
		required: true,
	},
	/** Defines the type of button used to display the options. Accepted values are: 'dropdown', 'ellipsis', or 'text'. */
	buttonVariant: {
		type: String,
		default: 'dropdown',
		validator: (val) => ['dropdown', 'ellipsis', 'text'].includes(val),
	},
	/** The accessible label for the button, used by screen readers. This is optional. */
	ariaLabel: {
		type: String,
		default: '',
	},
	/** This specifies where the dropdown appears relative to the element, such as "left" or "right." */
	direction: {
		type: String,
		default: 'left',
		validator: (direction) => ['left', 'right'].includes(direction),
	},
});

const displayAsEllipsis = computed(() => props.buttonVariant === 'ellipsis');

const emit = defineEmits([
	/** When a button is clicked from the dropdown menu */
	'action',
]);

function handleSelect(action) {
	// important to set focus, because often another modal is opened and it needs to safe correct
	// button to get back to
	if (buttonTriggerRef.value && buttonTriggerRef.value.$el) {
		const el = buttonTriggerRef.value.$el;
		el.focus();
	}
	emitAction(action);
}

const emitAction = (action) => {
	if (action.actionFn) {
		action.actionFn(props?.actionArgs);
	} else if (action.name) {
		emit('action', action.name, props?.actionArgs || {});
	}
};

const buttonTriggerRef = ref(null);
const dir = useDirection();

const menuButtonStyle = computed(() => ({
	// Base
	'w-full justify-center': true,
	// Default: "dropdown" button type
	'inline-flex rounded border border-light bg-secondary px-3 py-2 text-lg-normal gap-x-1.5':
		props.buttonVariant === 'dropdown',
	// "text" button type
	'text-primary hover:text-hover mb-1': props.buttonVariant === 'text',
	// Ellipsis Menu
	// The pseudo-element extends the 24px button to a 36px click target
	"relative leading-none hover:text-on-dark before:absolute before:-inset-[6px] before:rounded before:content-[''] hover:before:bg-hover data-[state=open]:text-on-dark data-[state=open]:before:bg-hover":
		displayAsEllipsis.value,
}));

const isValidAction = (action) => {
	return action?.label && (action?.url || action?.name);
};
</script>
