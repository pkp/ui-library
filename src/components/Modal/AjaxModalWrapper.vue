<template>
	<div ref="contentDiv" @click="catchInsideClick"></div>
</template>
<script setup>
/**
 * Component to mimick part of AjaxModalHandler which fetches the html content from given url
 * and presents it to the user
 */
import {ref, onMounted, inject, defineProps, onBeforeUnmount} from 'vue';
import {useFetch} from '@/composables/useFetch';

const {legacyOptions} = defineProps({
	/**
	 * Following the object used within AjaxModalHandler
	 * Particularly important is `url` and `modalHandler`
	 */
	legacyOptions: {
		type: Object,
		default: () => {},
	},
});

const closeModal = inject('closeModal');

const contentDiv = ref(null);
// eslint-disable-next-line no-unused-vars
const pkp = window.pkp;

// Fetches html content from legacy endpoints
const {data: modalData, fetch: fetchAssignParticipantPage} = useFetch(
	legacyOptions.url,
);

// Legacy modal has mechanism where it needs to check with form whether it can close
// Mimicking this behaviour
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

/** The wrapping div element for modal is still created by legacy modal handler, but its not mounted
 * only used to keep the legacy event communication going from inside modal to the outside (often its grid component)
 *
 */
function passToHandlerElement(...args) {
	if (legacyOptions.modalHandler) {
		legacyOptions.modalHandler.getHtmlElement().trigger(...args);
	}
	// when legacy modal opened from vue.js, it does not have handler
	// and needs to trigger close for some events
	else {
		const eventType = args?.[0]?.type;

		if (
			[
				'formSubmitted',
				'formCanceled',
				'ajaxHtmlError',
				'modalFinished',
				'wizardClose',
				'wizardCancel',
			].includes(eventType)
		) {
			closeModal();
		}
	}

	return;
}

onMounted(async () => {
	await fetchAssignParticipantPage();
	if (modalData.value) {
		$(contentDiv.value).html(modalData.value.content);
		$(contentDiv.value).bind('formSubmitted', passToHandlerElement);
		$(contentDiv.value).bind('wizardClose', passToHandlerElement);
		$(contentDiv.value).bind('wizardCancel', passToHandlerElement);

		$(contentDiv.value).bind('formCanceled', passToHandlerElement);
		$(contentDiv.value).bind('ajaxHtmlError', passToHandlerElement);
		$(contentDiv.value).bind('modalFinished', passToHandlerElement);

		// Publish some otherwise private events triggered
		// by nested widgets so that they can be handled by
		// the element that opened the modal.

		$(contentDiv.value).bind('redirectRequested', passToHandlerElement);
		$(contentDiv.value).bind('dataChanged', passToHandlerElement);
		$(contentDiv.value).bind('updateHeader', passToHandlerElement);
		$(contentDiv.value).bind('gridRefreshRequested', passToHandlerElement);
	}
});

onBeforeUnmount(() => {
	$(contentDiv.value).unbind('formSubmitted', passToHandlerElement);
	$(contentDiv.value).unbind('wizardClose', passToHandlerElement);
	$(contentDiv.value).unbind('wizardCancel', passToHandlerElement);

	$(contentDiv.value).unbind('formCanceled', passToHandlerElement);
	$(contentDiv.value).unbind('ajaxHtmlError', passToHandlerElement);
	$(contentDiv.value).unbind('modalFinished', passToHandlerElement);

	$(contentDiv.value).unbind('redirectRequested', passToHandlerElement);
	$(contentDiv.value).unbind('dataChanged', passToHandlerElement);
	$(contentDiv.value).unbind('updateHeader', passToHandlerElement);
	$(contentDiv.value).unbind('gridRefreshRequested', passToHandlerElement);
});
</script>
