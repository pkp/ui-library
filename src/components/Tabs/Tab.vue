<template>
	<div
		class="pkpTab"
		:class="classes"
		role="tabpanel"
		:id="id"
		:aria-labelledby="id + '-button'"
		:hidden="!isActive"
		tabindex="0"
	>
		<slot />
	</div>
</template>

<script>
export default {
	props: {
		icon: {
			type: String,
			default() {
				return '';
			}
		},
		id: {
			type: String,
			required: true
		},
		label: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {
			isActive: false
		};
	},
	computed: {
		/**
		 * Classes to apply to root element
		 *
		 * @return {Array}
		 */
		classes() {
			let classes = [];
			if (this.isActive) {
				classes.push('pkpTab--isActive');
			}
			if (this.isDisabled) {
				classes.push('pkpTab--isDisabled');
			}
			return classes;
		}
	}
};
</script>
