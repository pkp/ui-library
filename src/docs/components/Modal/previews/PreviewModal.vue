<template>
	<div class="previewModal">
		<pkp-button ref="simpleModalButton" @click="$modal.show('simple')">
			Open Modal
		</pkp-button>
		<modal
			closeLabel="Close"
			name="simple"
			title="Simple Modal"
			@closed="setFocusToRef('simpleModalButton')"
		>
			<p>This is an example of a simple modal.</p>
		</modal>
	</div>
</template>

<script>
import Modal from '@/components/Modal/Modal.vue';

export default {
	components: {
		Modal
	}
};
</script>
