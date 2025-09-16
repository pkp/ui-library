<template>
	<PkpBaseDialog v-bind="$attrs">
		<PkpBaseDialogOverlay class="dialog-overlay"></PkpBaseDialogOverlay>
		<PkpBaseDialogContent class="dialog-content">
			<PkpBaseDialogTitle></PkpBaseDialogTitle>
			<PkpBaseDialogBody></PkpBaseDialogBody>
			<PkpBaseDialogActionButtons></PkpBaseDialogActionButtons>
		</PkpBaseDialogContent>
	</PkpBaseDialog>
</template>

<script setup>
import PkpBaseDialog from './PkpBaseDialog.vue';
import PkpBaseDialogContent from './PkpBaseDialogContent.vue';
import PkpBaseDialogOverlay from './PkpBaseDialogOverlay.vue';
import PkpBaseDialogTitle from './PkpBaseDialogTitle.vue';
import PkpBaseDialogBody from './PkpBaseDialogBody.vue';
import PkpBaseDialogActionButtons from './PkpBaseDialogActionButtons.vue';

//defineProps({title: {type: String, required: true}});
</script>

<style scoped>
.dialog-overlay {
	position: fixed;
	inset: 0;
	z-index: 30;
	background-color: var(--bg-tertiary, rgba(0, 0, 0, 0.5));
}

.dialog-overlay[data-state='open'] {
	animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dialog-content {
	background-color: white;
	position: fixed;
	left: 50%;
	top: 50%;
	z-index: 100;
	max-height: 85vh;
	width: 90vw;
	max-width: 450px;
	transform: translate(-50%, -50%);
	border-radius: 6px;
	padding: 25px;
	box-shadow:
		hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
		hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
}

.dialog-content:focus {
	outline: none;
}

.dialog-content[data-state='open'] {
	animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes overlayShow {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes contentShow {
	from {
		opacity: 0;
		transform: translate(-50%, -48%) scale(0.96);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
}
</style>
