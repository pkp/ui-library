<template>
	<div class="relative flex items-start justify-between">
		<Menu
			as="div"
			:class="
				position === 'right'
					? 'ltr:ml-auto rtl:mr-auto'
					: 'ltr:mr-auto rtl:ml-auto'
			"
		>
			<div>
				<MenuButton
					class="hover:bg-gray-50 inline-flex w-full justify-center gap-x-1.5 rounded px-3 py-2"
					:class="
						name
							? 'border border-light bg-secondary text-lg-normal'
							: 'text-3xl-normal'
					"
				>
					{{ name }}
					<Icon
						class="-mr-1 h-5 w-5 text-primary"
						:icon="name ? 'Dropdown' : 'MoreOptions'"
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
					class="dropdown-shadow absolute z-10 w-max border border-light bg-secondary focus:outline-none"
					:class="
						position === 'right'
							? 'ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-right'
							: 'ltr:left-0 ltr:origin-top-left rtl:right-0 rtl:origin-top-left'
					"
				>
					<MenuItem v-for="(action, i) in actions" :key="i" v-slot="{active}">
						<div class="min-w-[96px]">
							<PkpButton
								v-if="action.label"
								element="a"
								:href="action.url"
								:icon="action.icon"
								:is-active="active"
								:is-warnable="action.isWarnable"
								:class="i !== actions.length - 1 ? 'border-b' : ''"
								size-variant="fullWidth"
								class="border-light"
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
	actions: {
		type: Array,
		required: true,
		validator: (actions) => {
			return actions.every(
				(action) =>
					typeof action.label === 'string' && action.label.trim() !== '',
			);
		},
	},
	name: {
		type: String,
		default: undefined,
	},
	position: {
		type: String,
		default: 'right',
	},
});
</script>

<style scoped>
.dropdown-shadow {
	box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.5);
}
</style>
