<template>
	<TabsRoot
		ref="tab-root"
		:activation-mode="props.activationMode"
		:model-value="activeTab"
		:dir="documentDir"
		:class="cn('root')"
		:unmount-on-hide="false"
		@update:model-value="setTab"
	>
		<slot />
	</TabsRoot>
</template>
<script setup>
import {ref, provide, useTemplateRef, watch} from 'vue';
import {TabsRoot} from 'reka-ui';
import {usePkpTab} from '@/frontend/composables/usePkpTab';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpDirection} from '@/frontend/composables/usePkpDirection';

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
	/**
	 * Optionally scroll to the top of the tabs when
	 * a new tab is opened.
	 */
	scrollTo: {type: Boolean, default: false},
	/**
	 * Whether tabs are activated immediately on selection
	 *
	 * @see https://reka-ui.com/docs/components/tabs#root
	 */
	activationMode: {type: String, default: 'automatic'},
});

const documentDir = usePkpDirection();

const {cn} = usePkpStyles('PkpTabRoot', props.styles);

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

const tabRoot = useTemplateRef('tab-root');
watch(activeTab, () => {
	if (props.scrollTo && tabRoot.value?.$el) {
		/**
		 * This small delay fixes a bug where the browser sometimes
		 * scrolls back up too far. I believe this is because the
		 * height of the page changes with different tab content
		 * and the browser is mis-calculating the smooth scroll.
		 * In rare cases, the browser repaint will not have completed
		 * when the scrollTo is called and this bug will occur.
		 *
		 * nextTick() was not successful in addressing this.
		 */
		setTimeout(() => {
			const scrollOffset = Math.round(window.innerHeight / 5);
			window.scrollTo({top: tabRoot.value.$el.offsetTop - scrollOffset});
		}, 200);
	}
});

// Provide registration to children
provide('pkpTabRoot', {register, unregister});
</script>
