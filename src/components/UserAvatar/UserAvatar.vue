<template>
	<div
		class="inline-flex h-11 w-11 items-center justify-center rounded-full shadow"
		:class="circleClasses"
	>
		<span class="text-on-dark" :class="initialsClasses">
			{{ initials }}
		</span>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import {useParticipant} from '@/composables/useParticipant';

const {getUserAvatarInitialsFromName} = useParticipant();
const props = defineProps({
	sizeVariant: {
		required: false,
		type: String,
		default: () => 'large',
		validator: (prop) => ['large', 'small'].includes(prop),
	},
	userFullName: {type: String, required: true},
	userId: {type: Number, required: true},
});

const UserProfileColors = [
	'bg-profile-1',
	'bg-profile-2',
	'bg-profile-3',
	'bg-profile-4',
	'bg-profile-5',
	'bg-profile-6',
];

const circleClasses = computed(() => {
	const colorIndex = props.userId % UserProfileColors.length;

	const colorClass = UserProfileColors[colorIndex];
	const sizeClasses =
		props.sizeVariant === 'large' ? ['h-11', 'w-11'] : ['h-8', 'w-8'];
	return [colorClass, ...sizeClasses];
});

const initialsClasses = computed(() => {
	const textSizeClass =
		props.sizeVariant === 'large' ? 'text-2xl-bold' : 'text-lg-bold';
	return [textSizeClass];
});

const initials = computed(() => {
	return getUserAvatarInitialsFromName(props.userFullName);
});
</script>
