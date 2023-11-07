<template>
	<SideModalBody secondary="true">
		<template #header>Assign editors stuff</template>
		<div ref="content" @click="catchInsideClick"></div>
	</SideModalBody>
</template>

<script>
import {mapStores} from 'pinia';

import SideModalBody from '@/components/Modal/SideModalBody.vue';

import {useSubmissionsStore} from '@/pages/submissions/submissionsStore';
import {pkpFetch} from '@/utils/pkpFetch';

export default {
	components: {SideModalBody},
	props: {
		testProp: Function,
	},
	data() {
		return {pkp: window.pkp, content: null};
	},
	computed: {...mapStores(useSubmissionsStore)},
	mounted() {
		console.log('submission summary mounted');
		const submission = this.submissionsStore.submissions[3];
		const url = this.submissionsStore.assignParticipantUrl
			.replace('__id__', submission.id)
			.replace('__stageId__', submission.stageId);
		const closeModal = () => {
			this.closeModal();
		};
		pkpFetch(url).then((data) => {
			$(this.$refs.content).html(data.content);
			$(this.$refs.content).bind('formSubmitted', closeModal);
			$(this.$refs.content).bind('formCanceled', closeModal);
			$(this.$refs.content).bind('ajaxHtmlError', closeModal);
			$(this.$refs.content).bind('modalFinished', closeModal);
		});
		// load the content with participants
	},
	unmounted() {
		console.log('submission summary unmounted');
	},
	methods: {
		catchInsideClick(e) {
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
		},
	},
	inject: ['closeModal'],
};
</script>
