<template>
	<div ref="contentDiv" @click="catchInsideClick"></div>
</template>
<script setup>
import {ref, onMounted, inject, defineProps} from 'vue';
import {useFetch} from '@/composables/useFetch';

const props = defineProps({
	contentUrl: {
		type: String,
	},
});

const contentDiv = ref(null);
// eslint-disable-next-line no-unused-vars
const pkp = window.pkp;

const {data: assignParticipantPageData, fetch: fetchAssignParticipantPage} =
	useFetch(props.contentUrl);

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
		const options = $.extend({}, $self.data(), {caller: $self});
		$('#pkpHelpPanel').trigger('pkp.HelpPanel.Open', options);
	}
}

onMounted(async () => {
	await fetchAssignParticipantPage();
	if (assignParticipantPageData.value) {
		$(contentDiv.value).html(assignParticipantPageData.value.content);
		$(contentDiv.value).bind('formSubmitted', closeModal);
		$(contentDiv.value).bind('formCanceled', closeModal);
		$(contentDiv.value).bind('ajaxHtmlError', closeModal);
		$(contentDiv.value).bind('modalFinished', closeModal);
	}
});
</script>
