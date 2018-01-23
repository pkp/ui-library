<template>
	<span class="fa" :class="classes"	aria-hidden="true"></span>
</template>

<script>
export default {
	name: 'Icon',
	props: {
		icon: String,
		inline: Boolean,
	},
	computed: {
		classes: function () {
			let classes = ['fa-' + this.icon];
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
	margin-right: 0.25em;
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
