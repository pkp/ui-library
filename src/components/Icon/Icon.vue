<template>
	<svg
		v-if="icon === 'orcid'"
		class="pkpIcon--orcid"
		:class="classes"
		viewBox="0 0 256 256"
		aria-hidden="true"
	>
		<path
			class="pkpIcon--orcid__bg"
			d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"
		/>
		<g>
			<path
				class="pkpIcon--orcid__fill"
				d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z"
			/>
			<path
				class="pkpIcon--orcid__fill"
				d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5
				c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z"
			/>
			<path
				class="pkpIcon--orcid__fill"
				d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1
				C84.2,46.7,88.7,51.3,88.7,56.8z"
			/>
		</g>
	</svg>
	<span v-else-if="isSvgIcon" class="inline-block rtl:scale-x-[-1]">
		<component :is="svgIcons[icon]"></component>
	</span>
	<span v-else class="fa" :class="classes" aria-hidden="true"></span>
</template>

<script></script>
<script setup>
import {defineProps, computed} from 'vue';
import Announcements from './icons/Announcements.vue';
import AnonymousReview from './icons/AnonymousReview.vue';
import AttachFile from './icons/AttachFile.vue';
import BackButton from './icons/BackButton.vue';
import Bold from './icons/Bold.vue';
import Bullets from './icons/Bullets.vue';
import Cancel from './icons/Cancel.vue';
import Complete from './icons/Complete.vue';
import Dashboard from './icons/Dashboard.vue';
import DecreaseTextSize from './icons/DecreaseTextSize.vue';
import DisableUser from './icons/DisableUser.vue';
import Dropdown from './icons/Dropdown.vue';
import Edit from './icons/Edit.vue';
import Email from './icons/Email.vue';
import EmailOpened from './icons/EmailOpened.vue';
import Expand from './icons/Expand.vue';
import DefaultDocument from './icons/DefaultDocument.vue';
import FileAudio from './icons/FileAudio.vue';
import FileDoc from './icons/FileDoc.vue';
import FileEpub from './icons/FileEpub.vue';
import FileExcel from './icons/FileExcel.vue';
import FileHtml from './icons/FileHtml.vue';
import FileImage from './icons/FileImage.vue';
import FilePdf from './icons/FilePdf.vue';
import FileVideo from './icons/FileVideo.vue';
import FileZip from './icons/FileZip.vue';
import Help from './icons/Help.vue';
import InProgress from './icons/InProgress.vue';
import IncreaseTextSize from './icons/IncreaseTextSize.vue';
import InsertContent from './icons/InsertContent.vue';
import Institutes from './icons/Institutes.vue';
import Issues from './icons/Issues.vue';
import Italics from './icons/Italics.vue';
import LoginAs from './icons/LoginAs.vue';
import MergeUser from './icons/MergeUser.vue';
import MySubmissions from './icons/MySubmissions.vue';
import NavDoi from './icons/NavDoi.vue';
import Notifications from './icons/Notifications.vue';
import OpenReview from './icons/OpenReview.vue';
import Orcid from './icons/Orcid.vue';
import Overdue from './icons/Overdue.vue';
import ReadRecommendation from './icons/ReadRecommendation.vue';
import ReviewAssignments from './icons/ReviewAssignments.vue';
import ReviewRequestDeclined from './icons/ReviewRequestDeclined.vue';
import ReviewSent from './icons/ReviewSent.vue';
import Search from './icons/Search.vue';
import Settings from './icons/Settings.vue';
import Sort from './icons/Sort.vue';
import Statistics from './icons/Statistics.vue';
import Underline from './icons/Underline.vue';
import Url from './icons/Url.vue';
import UsefulTips from './icons/UsefulTips.vue';
import View from './icons/View.vue';

const svgIcons = {
	Announcements,
	AnonymousReview,
	AttachFile,
	BackButton,
	Bold,
	Bullets,
	Cancel,
	Complete,
	Dashboard,
	DefaultDocument,
	DecreaseTextSize,
	DisableUser,
	Dropdown,
	Edit,
	Email,
	EmailOpened,
	Expand,
	FileAudio,
	FileDoc,
	FileEpub,
	FileExcel,
	FileHtml,
	FileImage,
	FilePdf,
	FileVideo,
	FileZip,
	Help,
	InProgress,
	IncreaseTextSize,
	InsertContent,
	Institutes,
	Issues,
	Italics,
	LoginAs,
	MergeUser,
	MySubmissions,
	NavDoi,
	Notifications,
	OpenReview,
	Orcid,
	Overdue,
	ReadRecommendation,
	ReviewAssignments,
	ReviewRequestDeclined,
	ReviewSent,
	Search,
	Settings,
	Sort,
	Statistics,
	Underline,
	Url,
	UsefulTips,
	View,
};

const props = defineProps({
	/** Which <a href="https://fontawesome.com/">FontAwesome</a> icon to use. Drop the `fa-` prefix from the class name.
	 * If you want to use `fa-bug`, the value of this prop should be `bug`.  */
	icon: String,
	/** Use when an icon sits alongside text to ensure adequate spacing between the icon and text. */
	inline: Boolean,
});

const isSvgIcon = computed(() => !!svgIcons[props.icon]);

const classes = computed(() => {
	let classes = [];
	if (props.icon !== 'orcid') {
		classes.push('fa-' + props.icon);
	}
	if (props.inline) {
		classes.push('pkpIcon--inline');
	}
	return classes;
});
</script>

<style lang="less">
@import '../../styles/_import';

.pkpIcon--inline {
	margin-inline-end: 0.25em;
}

/**
 * Help icon
 */
.fa-info-circle {
	color: @yes;
}

/**
 * Warning icon
 */
.fa-exclamation-triangle {
	color: @no;
}

/**
 * Orcid icon
 */
.pkpIcon--orcid {
	display: inline-block;
	width: 1.5em;
	height: 1.5em;
	vertical-align: middle;

	// These colors match the orcid branding guidelines
	.pkpIcon--orcid__bg {
		fill: #a6ce39;
	}

	.pkpIcon--orcid__fill {
		fill: #ffffff;
	}
}
</style>
