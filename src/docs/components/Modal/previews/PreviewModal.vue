<template>
	<div class="previewModal">
		<pkp-button ref="simpleModalButton" @click="$modal.show('simple')">
			Open Modal
		</pkp-button>
		<modal
			v-bind="MODAL_PROPS"
			name="simple"
			@closed="setFocusToRef('simpleModalButton')"
		>
			<modal-content closeLabel="Close" modalName="simple" title="Simple Modal">
				<p>This is an example of a simple modal.</p>
			</modal-content>
		</modal>
	</div>
</template>

<script>
import modal from '@/mixins/modal';

export default {
	mixins: [modal]
};
</script>
