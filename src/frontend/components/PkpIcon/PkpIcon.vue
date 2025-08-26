<script setup>
import {computed} from 'vue';
import Cancel from './icons/Cancel.vue';
import MoreOptions from './icons/MoreOptions.vue';
import Error from './icons/Error.vue';
import Help from './icons/Help.vue';
import User from './icons/User.vue';
import Orcid from '@/frontend/components/PkpIcon/icons/Orcid.vue';
import OrcidUnauthenticated from '@/frontend/components/PkpIcon/icons/OrcidUnauthenticated.vue';
const svgIcons = {
	Cancel,
	MoreOptions,
	Error,
	Help,
	User,
	Orcid,
	OrcidUnauthenticated,
};

const props = defineProps({
	/** Which icon to use from our [Icon Gallery](?path=/story/components-icon--icon-gallery) */
	icon: {type: String, required: true},
});

const classes = computed(() => {
	return ['pkpIcon', props.icon === 'Error' ? 'pkpIcon--error' : ''];
});
</script>

<template>
	<span :class="classes">
		<component :is="svgIcons[icon]"></component>
	</span>
</template>

<style>
.pkpIcon {
	display: inline-block;
	vertical-align: middle;
}

[dir='rtl'] .pkpIcon {
	transform: scaleX(-1);
}

.pkpIcon--error {
	color: var(--pkp-color-negative);
}
</style>
