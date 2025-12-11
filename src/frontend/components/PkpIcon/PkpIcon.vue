<template>
	<component :is="svgIcons[icon]" class="PkpIcon"></component>
</template>

<script setup>
import Cancel from './icons/Cancel.vue';
import MoreOptions from './icons/MoreOptions.vue';
import Error from './icons/Error.vue';
import Help from './icons/Help.vue';
import User from './icons/User.vue';
import Orcid from '@/frontend/components/PkpIcon/icons/Orcid.vue';
import OrcidUnauthenticated from '@/frontend/components/PkpIcon/icons/OrcidUnauthenticated.vue';
import ReviewApproved from './icons/ReviewApproved.vue';
import ReviewRevisionsRequested from './icons/ReviewRevisionsRequested.vue';
import ReviewNotApproved from './icons/ReviewNotApproved.vue';
import ReviewComments from './icons/ReviewComments.vue';
const svgIcons = {
	Cancel,
	MoreOptions,
	Error,
	Help,
	User,
	Orcid,
	OrcidUnauthenticated,
	// Review recommendation icons - keys match recommendation values
	approved: ReviewApproved,
	revisions_requested: ReviewRevisionsRequested,
	not_approved: ReviewNotApproved,
	comments: ReviewComments,
};
defineProps({
	/** Which icon to use from our [Icon Gallery](?path=/story/components-icon--icon-gallery) */
	icon: {type: String, required: true},
});
</script>
<style>
[dir='rtl'] .PkpIcon {
	transform: scaleX(-1);
}
</style>
