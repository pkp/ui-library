<template>
	<component :is="svgIcons[icon]" class="BaseIcon"></component>
</template>

<script setup>
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
defineProps({
	/** Which icon to use from our [Icon Gallery](?path=/story/components-icon--icon-gallery) */
	icon: {type: String, required: true},
});
</script>
