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
	<span v-else-if="isPkpIcon" class="inline-block">
		<component :is="pkpIcons[icon]"></component>
	</span>
	<span v-else class="fa" :class="classes" aria-hidden="true"></span>
</template>

<script>
import EnvelopeClosed from './EnvelopeClosed.vue';
import QuestionmarkCircle from './QuestionmarkCircle.vue';
import ChevronLeft from './ChevronLeft.vue';
import ChevronRight from './ChevronRight.vue';
import OpenLeft from './OpenLeft.vue';
import OpenRight from './OpenRight.vue';

export default {
	name: 'Icon',
	components: {
		EnvelopeClosed,
		QuestionmarkCircle,
		ChevronLeft,
		ChevronRight,
		OpenLeft,
		OpenRight,
	},
	props: {
		/** Which <a href="https://fontawesome.com/">FontAwesome</a> icon to use. Drop the `fa-` prefix from the class name.
		 * If you want to use `fa-bug`, the value of this prop should be `bug`.  */
		icon: String,
		/** Use when an icon sits alongside text to ensure adequate spacing between the icon and text. */
		inline: Boolean,
	},
	data() {
		return {
			pkpIcons: {
				'pkp-envelope-closed': 'EnvelopeClosed',
				'pkp-questionmark-circle': 'QuestionmarkCircle',
				'pkp-chevron-left': 'ChevronLeft',
				'pkp-chevron-right': 'ChevronRight',
				'pkp-open-left': 'OpenLeft',
				'pkp-open-right': 'OpenRight',
			},
		};
	},
	computed: {
		isPkpIcon() {
			return this.icon.startsWith('pkp-');
		},
		classes() {
			let classes = [];
			if (this.icon !== 'orcid') {
				classes.push('fa-' + this.icon);
			}
			if (this.inline) {
				classes.push('pkpIcon--inline');
			}
			return classes;
		},
	},
};
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
