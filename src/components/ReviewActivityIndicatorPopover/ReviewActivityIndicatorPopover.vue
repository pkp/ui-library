<template>
	<PkpPopover>
		<template #button>
			<ReviewActivityIndicator
				class=""
				:status="status"
				progress="50"
			></ReviewActivityIndicator>
		</template>

		<div>
			<badge :is-primary="true">
				<icon icon="comment-o" :inline="true" />
				Ongoing review - request accepted
			</badge>
		</div>
		<div class="flex items-start justify-between pt-4">
			<span class="text-base-bold">Julie Janssen</span>
			<span>
				<icon class="h-6 w-6" icon="pkp-questionmark-circle" />
				<icon class="ml-2.5 h-6 w-6" icon="pkp-questionmark-circle" />
			</span>
		</div>
		<div class="border-t border-light pt-4 text-sm-normal">
			This reviewer has accepted the review request. Their review is due in
			<b>8 days on 7th April, 2023</b>
			.
		</div>
		<div>
			<PkpButton :is-link="true">Edit due date</PkpButton>
		</div>
		<div class="mt-4">
			<PkpButton>View details</PkpButton>
			<PkpButton class="ml-4" :is-warnable="true">Unassign</PkpButton>
		</div>
	</PkpPopover>
</template>

<script setup>
import {defineProps} from 'vue';
import ReviewActivityIndicator from './ReviewActivityIndicator.vue';
import Badge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpPopover from '@/components/Popover/Popover.vue';

defineProps({
	status: {
		type: String,
		required: true,
		validator(value, props) {
			// The value must match one of these strings
			return [
				'completed',
				'ongoing',
				'overdue',
				'awaiting_confirmation',
			].includes(value);
		},
	},
	progress: {type: Number, required: false, default: () => null},
});
</script>
<style>
.tooltip-arrow {
	/*clip-path: inset(-15px 0px 0px -15px);*/
	clip-path: polygon(
		-20% -20%,
		120% -20%,
		100% 0%,
		95% 10%,
		10% 95%,
		0% 100%,
		-20% 120%
	);
}

/*.tooltip-arrow {
	position: absolute;
	width: 0;
	height: 0;
	top: -10px;
	left: 50%;
	transform: translateX(-50%);


	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	border-bottom: 10px solid #fff;
}*/
</style>
