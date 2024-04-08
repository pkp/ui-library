<template>
	<div ref="contentDiv" @click="catchInsideClick"></div>
</template>
<script setup>
/* eslint-disable */

import {ref, onMounted, inject, defineProps, onBeforeUnmount} from 'vue';
import {useFetch} from '@/composables/useFetch';

const {options} = defineProps({
	options: {
		type: Object,
		default: () => {},
	},
});

const contentDiv = ref(null);
// eslint-disable-next-line no-unused-vars
const pkp = window.pkp;

const {data: modalData, fetch: fetchAssignParticipantPage} = useFetch(
	options.url,
);

const closeModal = inject('closeModal');
const registerCloseCallback = inject('registerCloseCallback');
registerCloseCallback(() => {
	// eslint-disable-next-line no-unused-vars
	const form = $(contentDiv.value).find('form').first();

	if (form.length == 1) {
		const informationObject = {closePermitted: true};
		form.trigger('containerClose', [informationObject]);
		if (!informationObject.closePermitted) {
			return false;
		}
	}

	return true;
});

function catchInsideClick(e) {
	// open help dialog
	// click event does not propagate to the body when in modal
	// therefore triggering help panel explicitely
	if (e?.target?.className?.includes('requestHelpPanel')) {
		// forward it to body
		e.preventDefault();
		const $self = $(e.target);
		const opts = $.extend({}, $self.data(), {caller: $self});
		$('#pkpHelpPanel').trigger('pkp.HelpPanel.Open', opts);
	}
}

function passToBridge(...args) {
	console.log('HELLO');
	console.log(args);
	//console.log(jQueryEvent, b, c);
	if (options.modalHandler) {
		options.modalHandler.getHtmlElement().trigger(...args);
	}

	return;

	// If we have an event bridge configured then re-trigger
	// the event on the target object.
	if (options.eventBridge) {
		$('[id^="' + options.eventBridge + '"]').trigger(
			jQueryEvent.type,
			jQueryEvent.data,
		);
	}
}

onMounted(async () => {
	await fetchAssignParticipantPage();
	if (modalData.value) {
		// TODO CONSIDER REMOVE BINDS ON UNMOUNT
		$(contentDiv.value).html(modalData.value.content);
		$(contentDiv.value).bind('formSubmitted', passToBridge);
		$(contentDiv.value).bind('wizardClose', passToBridge);
		$(contentDiv.value).bind('wizardCancel', passToBridge);

		$(contentDiv.value).bind('formCanceled', passToBridge);
		$(contentDiv.value).bind('ajaxHtmlError', passToBridge);
		$(contentDiv.value).bind('modalFinished', passToBridge);

		// Publish some otherwise private events triggered
		// by nested widgets so that they can be handled by
		// the element that opened the modal.

		$(contentDiv.value).bind('redirectRequested', passToBridge);
		$(contentDiv.value).bind('dataChanged', passToBridge);
		$(contentDiv.value).bind('updateHeader', passToBridge);
		$(contentDiv.value).bind('gridRefreshRequested', passToBridge);
	}
});

onBeforeUnmount(() => {
	$(contentDiv.value).unbind('formSubmitted', passToBridge);
	$(contentDiv.value).unbind('wizardClose', passToBridge);
	$(contentDiv.value).unbind('wizardCancel', passToBridge);

	$(contentDiv.value).unbind('formCanceled', passToBridge);
	$(contentDiv.value).unbind('ajaxHtmlError', passToBridge);
	$(contentDiv.value).unbind('modalFinished', passToBridge);

	// Publish some otherwise private events triggered
	// by nested widgets so that they can be handled by
	// the element that opened the modal.

	$(contentDiv.value).unbind('redirectRequested', passToBridge);
	$(contentDiv.value).unbind('dataChanged', passToBridge);
	$(contentDiv.value).unbind('updateHeader', passToBridge);
	$(contentDiv.value).unbind('gridRefreshRequested', passToBridge);
});
</script>
