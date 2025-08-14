<template>
	<BaseDialog v-bind="$attrs">
		<BaseDialogOverlay></BaseDialogOverlay>
		<BaseDialogContent class="dialog-content">
			<BaseDialogTitle></BaseDialogTitle>
			<BaseDialogBody></BaseDialogBody>
			<BaseDialogActionButtons></BaseDialogActionButtons>
		</BaseDialogContent>
	</BaseDialog>
</template>

<script setup>
import BaseDialog from './base/BaseDialog.vue';
import BaseDialogContent from './base/BaseDialogContent.vue';
import BaseDialogOverlay from './base/BaseDialogOverlay.vue';
import BaseDialogTitle from './base/BaseDialogTitle.vue';
import BaseDialogBody from './base/BaseDialogBody.vue';
import BaseDialogActionButtons from './base/BaseDialogActionButtons.vue';
</script>
