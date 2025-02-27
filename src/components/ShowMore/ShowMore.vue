<template>
	<Disclosure>
		<DisclosureButton v-slot="{open}" as="template" class="">
			<Button is-active :icon="open ? 'Dropup' : 'Dropdown'">
				{{ label }}
			</Button>
		</DisclosureButton>
		<DisclosurePanel class="">
			<slot />
		</DisclosurePanel>
	</Disclosure>
</template>

<script setup>
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue';
import Button from '../Button/Button.vue';

defineProps({label: {type: String, required: true}});
</script>
