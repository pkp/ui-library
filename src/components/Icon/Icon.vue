<template>
	<span :class="classes">
		<component :is="svgIcons[icon]"></component>
	</span>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import Add from './icons/Add.vue';
import AlignCenter from './icons/AlignCenter.vue';
import AlignLeft from './icons/AlignLeft.vue';
import AlignRight from './icons/AlignRight.vue';
import Announcements from './icons/Announcements.vue';
import AnonymousReview from './icons/AnonymousReview.vue';
import ArchivedFile from './icons/ArchivedFile.vue';
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
import Checkbox from './icons/Checkbox.vue';
import CheckboxTicked from './icons/CheckboxTicked.vue';
import ChevronDown from './icons/ChevronDown.vue';
import ChevronLeft from './icons/ChevronLeft.vue';
import ChevronRight from './icons/ChevronRight.vue';
import ChevronUp from './icons/ChevronUp.vue';
import Clock from './icons/Clock.vue';
import Comment from './icons/Comment.vue';
import Complete from './icons/Complete.vue';
import Dashboard from './icons/Dashboard.vue';
import Declined from './icons/Declined.vue';
import DecreaseTextSize from './icons/DecreaseTextSize.vue';
import Desktop from './icons/Desktop.vue';
import DisableUser from './icons/DisableUser.vue';
import Download from './icons/Download.vue';
import Dropdown from './icons/Dropdown.vue';
import Dropup from './icons/Dropup.vue';
import Edit from './icons/Edit.vue';
import Email from './icons/Email.vue';
import EmailOpened from './icons/EmailOpened.vue';
import Error from './icons/Error.vue';
import Expand from './icons/Expand.vue';
import DefaultDocument from './icons/DefaultDocument.vue';
import FileAudio from './icons/FileAudio.vue';
import FileCode from './icons/FileCode.vue';
import FileDoc from './icons/FileDoc.vue';
import FileEpub from './icons/FileEpub.vue';
import FileExcel from './icons/FileExcel.vue';
import FileHtml from './icons/FileHtml.vue';
import FileImage from './icons/FileImage.vue';
import FilePdf from './icons/FilePdf.vue';
import FilePowerpoint from './icons/FilePowerpoint.vue';
import FileText from './icons/FileText.vue';
import FileVideo from './icons/FileVideo.vue';
import FileZip from './icons/FileZip.vue';
import Filter from './icons/Filter.vue';
import Globe from './icons/Globe.vue';
import Hdd from './icons/Hdd.vue';
import Help from './icons/Help.vue';
import History from './icons/History.vue';
import InProgress from './icons/InProgress.vue';
import IncreaseTextSize from './icons/IncreaseTextSize.vue';
import InsertContent from './icons/InsertContent.vue';
import Institutes from './icons/Institutes.vue';
import Issues from './icons/Issues.vue';
import Italics from './icons/Italics.vue';
import Lock from './icons/Lock.vue';
import LoginAs from './icons/LoginAs.vue';
import MergeUser from './icons/MergeUser.vue';
import Minus from './icons/Minus.vue';
import Money from './icons/Money.vue';
import MoreOptions from './icons/MoreOptions.vue';
import MySubmissions from './icons/MySubmissions.vue';
import NavDoi from './icons/NavDoi.vue';
import NavAdmin from './icons/NavAdmin.vue';
import New from './icons/New.vue';
import OpenNewTab from './icons/OpenNewTab.vue';
import Notifications from './icons/Notifications.vue';
import NotVisible from './icons/NotVisible.vue';
import OpenReview from './icons/OpenReview.vue';
import Orcid from './icons/Orcid.vue';
import OrcidUnauthenticated from './icons/OrcidUnauthenticated.vue';
import Overdue from './icons/Overdue.vue';
import Paste from './icons/Paste.vue';
import Payment from './icons/Payment.vue';
import Photo from './icons/Photo.vue';
import Pin from './icons/Pin.vue';
import Print from './icons/Print.vue';
import Publication from './icons/Publication.vue';
import Question from './icons/Question.vue';
import ReadRecommendation from './icons/ReadRecommendation.vue';
import ReinstateReviewer from './icons/ReinstateReviewer.vue';
import ReviewAssignments from './icons/ReviewAssignments.vue';
import ReviewRequestDeclined from './icons/ReviewRequestDeclined.vue';
import ReviewSent from './icons/ReviewSent.vue';
import ROR from './icons/ROR.vue';
import Search from './icons/Search.vue';
import Settings from './icons/Settings.vue';
import Sitemap from './icons/Sitemap.vue';
import Sort from './icons/Sort.vue';
import Star from './icons/Star.vue';
import StarTicked from './icons/StarTicked.vue';
import Statistics from './icons/Statistics.vue';
import Tools from './icons/Tools.vue';
import Underline from './icons/Underline.vue';
import Unlock from './icons/Unlock.vue';
import Upload from './icons/Upload.vue';
import Url from './icons/Url.vue';
import UsefulTips from './icons/UsefulTips.vue';
import UsefulTipsPrimary from './icons/UsefulTipsPrimary.vue';
import User from './icons/User.vue';
import View from './icons/View.vue';
import Workflow from './icons/Workflow.vue';

const svgIcons = {
	Add,
	AlignCenter,
	AlignLeft,
	AlignRight,
	Announcements,
	AnonymousReview,
	ArchivedFile,
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
	Checkbox,
	CheckboxTicked,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	Comment,
	Complete,
	Dashboard,
	Declined,
	DefaultDocument,
	DecreaseTextSize,
	Desktop,
	DisableUser,
	Download,
	Dropdown,
	Dropup,
	Edit,
	Email,
	EmailOpened,
	Error,
	Expand,
	FileAudio,
	FileDoc,
	FileCode,
	FileEpub,
	FileExcel,
	FileHtml,
	FileImage,
	FilePdf,
	FilePowerpoint,
	FileText,
	FileVideo,
	FileZip,
	Filter,
	Globe,
	Hdd,
	Help,
	History,
	InProgress,
	IncreaseTextSize,
	InsertContent,
	Institutes,
	Issues,
	Italics,
	Lock,
	LoginAs,
	MergeUser,
	Minus,
	Money,
	MoreOptions,
	MySubmissions,
	NavDoi,
	NavAdmin,
	New,
	OpenNewTab,
	Notifications,
	NotVisible,
	OpenReview,
	Orcid,
	Overdue,
	Paste,
	Payment,
	Photo,
	Pin,
	Print,
	Publication,
	Question,
	ReadRecommendation,
	ReinstateReviewer,
	ReviewAssignments,
	ReviewRequestDeclined,
	ReviewSent,
	ROR,
	Search,
	Settings,
	Sitemap,
	Sort,
	Star,
	StarTicked,
	Statistics,
	Tools,
	Underline,
	Unlock,
	Upload,
	Url,
	UsefulTips,
	UsefulTipsPrimary,
	User,
	View,
	Workflow,
	OrcidUnauthenticated,
};

const props = defineProps({
	/** Which icon to use from our [Icon Gallery](?path=/story/components-icon--icon-gallery) */
	icon: {type: String, required: true},
	/** Use when an icon sits alongside text to ensure adequate spacing between the icon and text. */
	inline: Boolean,
});

const classes = computed(() => {
	return {
		'inline-block align-middle rtl:scale-x-[-1]': true,
		'text-negative': props.icon === 'Error',
		'pkpIcon--inline': props.inline,
	};
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
</style>
