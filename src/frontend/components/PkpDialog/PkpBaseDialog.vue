<template>
	<DialogRoot :open="opened">
		<DialogPortal><slot></slot></DialogPortal>
	</DialogRoot>
</template>

<script setup>
import {ref, provide} from 'vue';
import {DialogRoot, DialogPortal} from 'reka-ui';

const props = defineProps({
	/** Used only internally, don't pass this prop via openDialog */
	opened: {type: Boolean, default: false},
	/** Title of the dialog */
	title: {type: String, required: false, default: ''},
	/** Message to be displayed, for more complex messages use bodyComponent&bodyProps */
	message: {type: String, default: null},
	/** For more complex messages Vue.js component can be passed */
	bodyComponent: {type: Object, default: null},
	/** Props to be passed to bodyComponent */
	bodyProps: {type: Object, default: null},
	/** Array of button props to display actions, following props are passed to button component: label, element, href, isPrimary, isWarnable, callback */
	actions: {type: Array, default: () => []},
});

const emit = defineEmits(['close']);

// for components that doesn't manually handle loading state
const isDialogLoading = ref(props.isLoading);

function fireCallback(callback) {
	isDialogLoading.value = true;
	if (typeof callback === 'function') {
		callback(() => {
			emit('close');
		});
	}
}

provide('dialogProps', props);
provide('fireCallback', fireCallback);
</script>
