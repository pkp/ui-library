<template>
	<TabsRoot
		:model-value="activeTab"
		:class="cn('root')"
		@update:model-value="setTab"
	>
		<slot />
	</TabsRoot>
</template>
<script setup>
import {ref, provide} from 'vue';
import {TabsRoot} from 'reka-ui';
import {usePkpTab} from '@/frontend/composables/usePkpTab';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	/**
	 * Tab group name. Used as both:
	 * - Identifier for programmatic switching: usePkpTab('tab').setTab('value')
	 * - URL query param: ?tab=value
	 * If not provided, tabs work in local-only mode (no URL sync, no external control).
	 */
	name: {type: String, default: null},
	/**
	 * Default active tab value.
	 */
	defaultValue: {type: String, default: null},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles(props.styles);

// If name provided, use shared state with URL sync
// Otherwise, use local state only
const {activeTab, setTab} = props.name
	? usePkpTab(props.name, {defaultValue: props.defaultValue})
	: useLocalTab(props.defaultValue);

// Simple local state for tabs without external control
function useLocalTab(defaultValue) {
	const activeTab = ref(defaultValue);
	const setTab = (value) => {
		activeTab.value = value;
	};
	return {activeTab, setTab};
}

// Track registered tab values for validation
const registeredTabs = ref(new Set());
let validationScheduled = false;

function register(value) {
	registeredTabs.value.add(value);
	// Schedule validation after all sync registrations complete
	if (!validationScheduled) {
		validationScheduled = true;
		Promise.resolve().then(() => {
			validationScheduled = false;
			validateActiveTab();
		});
	}
}

function unregister(value) {
	registeredTabs.value.delete(value);
}

function validateActiveTab() {
	// If current value is invalid and we have registered tabs, fall back
	if (
		registeredTabs.value.size > 0 &&
		!registeredTabs.value.has(activeTab.value)
	) {
		if (props.defaultValue && registeredTabs.value.has(props.defaultValue)) {
			setTab(props.defaultValue);
		}
	}
}

// Provide registration to children
provide('pkpTabRoot', {register, unregister});
</script>

<style></style>
