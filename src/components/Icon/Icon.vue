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
	<svg
		v-if="icon === 'ror'"
		class="pkpIcon--ror"
		:class="classes"
		aria-hidden="true"
		width="100%"
		height="100%"
		viewBox="0 0 164 118"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		xml:space="preserve"
		xmlns:serif="http://www.serif.com/"
		style="
			fill-rule: evenodd;
			clip-rule: evenodd;
			stroke-linejoin: round;
			stroke-miterlimit: 2;
		"
	>
		<g transform="matrix(0.994301,0,0,0.989352,0,0)">
			<rect x="0" y="0" width="164.94" height="119.27" style="fill: white" />
		</g>
		<g transform="matrix(1,0,0,1,-0.945,-0.815)">
			<path
				d="M68.65,4.16L56.52,22.74L44.38,4.16L68.65,4.16Z"
				style="fill: rgb(83, 186, 161); fill-rule: nonzero"
			/>
			<path
				d="M119.41,4.16L107.28,22.74L95.14,4.16L119.41,4.16Z"
				style="fill: rgb(83, 186, 161); fill-rule: nonzero"
			/>
			<path
				d="M44.38,115.47L56.52,96.88L68.65,115.47L44.38,115.47Z"
				style="fill: rgb(83, 186, 161); fill-rule: nonzero"
			/>
			<path
				d="M95.14,115.47L107.28,96.88L119.41,115.47L95.14,115.47Z"
				style="fill: rgb(83, 186, 161); fill-rule: nonzero"
			/>
			<path
				d="M145.53,63.71C149.83,62.91 153.1,61 155.33,57.99C157.57,54.98 158.68,51.32 158.68,47.03C158.68,43.47 158.06,40.51 156.83,38.13C155.6,35.75 153.93,33.86 151.84,32.45C149.75,31.05 147.31,30.04 144.53,29.44C141.75,28.84 138.81,28.54 135.72,28.54L112.16,28.54L112.16,47.37C111.97,46.82 111.77,46.28 111.55,45.74C109.92,41.79 107.64,38.42 104.71,35.64C101.78,32.86 98.32,30.72 94.3,29.23C90.29,27.74 85.9,26.99 81.14,26.99C76.38,26.99 72,27.74 67.98,29.23C63.97,30.72 60.5,32.86 57.57,35.64C54.95,38.13 52.85,41.1 51.27,44.54C51.04,42.07 50.46,39.93 49.53,38.13C48.3,35.75 46.63,33.86 44.54,32.45C42.45,31.05 40.01,30.04 37.23,29.44C34.45,28.84 31.51,28.54 28.42,28.54L4.87,28.54L4.87,89.42L18.28,89.42L18.28,65.08L24.9,65.08L37.63,89.42L53.71,89.42L38.24,63.71C42.54,62.91 45.81,61 48.04,57.99C48.14,57.85 48.23,57.7 48.33,57.56C48.31,58.03 48.3,58.5 48.3,58.98C48.3,63.85 49.12,68.27 50.75,72.22C52.38,76.17 54.66,79.54 57.59,82.32C60.51,85.1 63.98,87.24 68,88.73C72.01,90.22 76.4,90.97 81.16,90.97C85.92,90.97 90.3,90.22 94.32,88.73C98.33,87.24 101.8,85.1 104.73,82.32C107.65,79.54 109.93,76.17 111.57,72.22C111.79,71.69 111.99,71.14 112.18,70.59L112.18,89.42L125.59,89.42L125.59,65.08L132.21,65.08L144.94,89.42L161.02,89.42L145.53,63.71ZM36.39,50.81C35.67,51.73 34.77,52.4 33.68,52.83C32.59,53.26 31.37,53.52 30.03,53.6C28.68,53.69 27.41,53.73 26.2,53.73L18.29,53.73L18.29,39.89L27.06,39.89C28.26,39.89 29.5,39.98 30.76,40.15C32.02,40.32 33.14,40.65 34.11,41.14C35.08,41.63 35.89,42.33 36.52,43.25C37.15,44.17 37.47,45.4 37.47,46.95C37.47,48.6 37.11,49.89 36.39,50.81ZM98.74,66.85C97.85,69.23 96.58,71.29 94.91,73.04C93.25,74.79 91.26,76.15 88.93,77.13C86.61,78.11 84.01,78.59 81.15,78.59C78.28,78.59 75.69,78.1 73.37,77.13C71.05,76.16 69.06,74.79 67.39,73.04C65.73,71.29 64.45,69.23 63.56,66.85C62.67,64.47 62.23,61.85 62.23,58.98C62.23,56.17 62.67,53.56 63.56,51.15C64.45,48.74 65.72,46.67 67.39,44.92C69.05,43.17 71.04,41.81 73.37,40.83C75.69,39.86 78.28,39.37 81.15,39.37C84.02,39.37 86.61,39.86 88.93,40.83C91.25,41.8 93.24,43.17 94.91,44.92C96.57,46.67 97.85,48.75 98.74,51.15C99.63,53.56 100.07,56.17 100.07,58.98C100.07,61.85 99.63,64.47 98.74,66.85ZM143.68,50.81C142.96,51.73 142.06,52.4 140.97,52.83C139.88,53.26 138.66,53.52 137.32,53.6C135.97,53.69 134.7,53.73 133.49,53.73L125.58,53.73L125.58,39.89L134.35,39.89C135.55,39.89 136.79,39.98 138.05,40.15C139.31,40.32 140.43,40.65 141.4,41.14C142.37,41.63 143.18,42.33 143.81,43.25C144.44,44.17 144.76,45.4 144.76,46.95C144.76,48.6 144.4,49.89 143.68,50.81Z"
				style="fill: rgb(32, 40, 38); fill-rule: nonzero"
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
import Add from './icons/Add.vue';
import Announcements from './icons/Announcements.vue';
import AnonymousReview from './icons/AnonymousReview.vue';
import ArrowLeft from './icons/ArrowLeft.vue';
import ArrowRight from './icons/ArrowRight.vue';
import AttachFile from './icons/AttachFile.vue';
import Attention from './icons/Attention.vue';
import BackButton from './icons/BackButton.vue';
import Bold from './icons/Bold.vue';
import Book from './icons/Book.vue';
import Bullets from './icons/Bullets.vue';
import Calendar from './icons/Calendar.vue';
import Cancel from './icons/Cancel.vue';
import Catalog from './icons/Catalog.vue';
import ChevronDown from './icons/ChevronDown.vue';
import ChevronLeft from './icons/ChevronLeft.vue';
import ChevronRight from './icons/ChevronRight.vue';
import ChevronUp from './icons/ChevronUp.vue';
import Clock from './icons/Clock.vue';
import Complete from './icons/Complete.vue';
import Dashboard from './icons/Dashboard.vue';
import DecreaseTextSize from './icons/DecreaseTextSize.vue';
import DisableUser from './icons/DisableUser.vue';
import Dropdown from './icons/Dropdown.vue';
import Dropup from './icons/Dropup.vue';
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
import History from './icons/History.vue';
import InProgress from './icons/InProgress.vue';
import IncreaseTextSize from './icons/IncreaseTextSize.vue';
import InsertContent from './icons/InsertContent.vue';
import Institutes from './icons/Institutes.vue';
import Issues from './icons/Issues.vue';
import Italics from './icons/Italics.vue';
import LoginAs from './icons/LoginAs.vue';
import MergeUser from './icons/MergeUser.vue';
import MoreOptions from './icons/MoreOptions.vue';
import MySubmissions from './icons/MySubmissions.vue';
import NavDoi from './icons/NavDoi.vue';
import NavAdmin from './icons/NavAdmin.vue';
import New from './icons/New.vue';
import Notifications from './icons/Notifications.vue';
import OpenReview from './icons/OpenReview.vue';
import Orcid from './icons/Orcid.vue';
import Overdue from './icons/Overdue.vue';
import Payment from './icons/Payment.vue';
import Publication from './icons/Publication.vue';
import ReadRecommendation from './icons/ReadRecommendation.vue';
import ReviewAssignments from './icons/ReviewAssignments.vue';
import ReviewRequestDeclined from './icons/ReviewRequestDeclined.vue';
import ReviewSent from './icons/ReviewSent.vue';
import Ror from './icons/Ror.vue';
import Search from './icons/Search.vue';
import Settings from './icons/Settings.vue';
import Sort from './icons/Sort.vue';
import Statistics from './icons/Statistics.vue';
import Tools from './icons/Tools.vue';
import Underline from './icons/Underline.vue';
import Url from './icons/Url.vue';
import UsefulTips from './icons/UsefulTips.vue';
import View from './icons/View.vue';
import Workflow from './icons/Workflow.vue';

const svgIcons = {
	Add,
	Announcements,
	AnonymousReview,
	ArrowLeft,
	ArrowRight,
	AttachFile,
	Attention,
	BackButton,
	Bold,
	Book,
	Bullets,
	Calendar,
	Cancel,
	Catalog,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	Complete,
	Dashboard,
	DefaultDocument,
	DecreaseTextSize,
	DisableUser,
	Dropdown,
	Dropup,
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
	History,
	InProgress,
	IncreaseTextSize,
	InsertContent,
	Institutes,
	Issues,
	Italics,
	LoginAs,
	MergeUser,
	MoreOptions,
	MySubmissions,
	NavDoi,
	NavAdmin,
	New,
	Notifications,
	OpenReview,
	Orcid,
	Overdue,
	Payment,
	Publication,
	ReadRecommendation,
	ReviewAssignments,
	ReviewRequestDeclined,
	ReviewSent,
	Ror,
	Search,
	Settings,
	Sort,
	Statistics,
	Tools,
	Underline,
	Url,
	UsefulTips,
	View,
	Workflow,
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
	let nonFontAwesomeIcons = ['orcid', 'ror'];
	if (!nonFontAwesomeIcons.includes(props.icon)) {
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

/**
 * Ror icon
 */
.pkpIcon--ror {
	display: inline-block;
	width: 1.5em;
	height: 1.5em;
	vertical-align: middle;
}
</style>
