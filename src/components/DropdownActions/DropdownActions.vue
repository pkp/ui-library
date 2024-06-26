<template>
	<div class="relative inline-block items-start justify-between">
		<Menu as="div">
			<div>
				<MenuButton
					class="hover:bg-gray-50 inline-flex w-full justify-center gap-x-1.5 rounded px-3 py-2"
					:class="
						displayAsEllipsis
							? 'text-3xl-normal'
							: 'border border-light bg-secondary text-lg-normal'
					"
					:aria-label="ariaLabel || null"
				>
					<span :class="displayAsEllipsis ? 'sr-only' : ''">{{ label }}</span>
					<Icon
						class="-mr-1 h-5 w-5 text-primary"
						:icon="displayAsEllipsis ? 'MoreOptions' : 'Dropdown'"
						aria-hidden="true"
					/>
				</MenuButton>
			</div>

			<transition
				enter-active-class="transition ease-out duration-100"
				enter-from-class="transform opacity-0 scale-95"
				enter-to-class="transform opacity-100 scale-100"
				leave-active-class="transition ease-in duration-75"
				leave-from-class="transform opacity-100 scale-100"
				leave-to-class="transform opacity-0 scale-95"
			>
				<MenuItems
					class="absolute z-10 w-max border border-light bg-secondary shadow focus:outline-none"
					:class="
						direction === 'right'
							? 'ltr:left-0 ltr:origin-top-left rtl:right-0 rtl:origin-top-left'
							: 'ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-right'
					"
				>
					<MenuItem
						v-for="(action, i) in actions"
						:key="i"
						v-slot="{active, close}"
					>
						<div class="min-w-[96px]">
							<PkpButton
								v-if="isValidAction(action)"
								:element="action.url ? 'a' : 'button'"
								:href="action.url"
								:icon="action.icon"
								:is-active="active"
								:is-warnable="action.isWarnable"
								:class="i !== actions.length - 1 ? 'border-b' : ''"
								size-variant="fullWidth"
								class="border-light"
								@click="
									() => {
										emitAction(action);
										close();
									}
								"
							>
								{{ action.label }}
							</PkpButton>
						</div>
					</MenuItem>
				</MenuItems>
			</transition>
		</Menu>
	</div>
</template>

<script setup>
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue';

defineProps({
	/** An array of action objects. Each object should contain `label` (string), `url` (string) to navigate to if the action involves a link, or `name` (string) to perform the action when clicked, an optional `icon` (string) and `isWarnable` (boolean) if the button needs the "warning" button styling from `<Button>` component. */
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
	/** The text label for the button. This is required. If `displayAsEllipsis` is `true`, the label will be used for accessibility. */
	label: {
		type: String,
		required: true,
	},
	/** If `true`, the button will display an ellipsis (`...`) */
	displayAsEllipsis: {
		type: Boolean,
		default: false,
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

const emit = defineEmits(['action']);

const emitAction = (action) => {
	if (action.url) {
		window.location.href = action.url;
	} else if (action.name) {
		emit('action', action.name);
	}
};

const isValidAction = (action) => {
	return action?.label && (action?.url || action?.name);
};
</script>
