<template>
	<div class="previewModal">
		<pkp-button ref="simpleModalButton" @click="isModalOpened = true">
			Open Modal
		</pkp-button>
		<modal
			:open="isModalOpened"
			closeLabel="Close"
			title="Simple Modal"
			@close="isModalOpened = false"
		>
			<p>This is an example of a simple modal.</p>
		</modal>
	</div>
</template>

<script>
import Modal from '@/components/Modal/Modal.vue';

export default {
	components: {
		Modal,
	},
	data: function () {
		return {
			isModalOpened: false,
		};
	},
};
</script>
