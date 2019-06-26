<template>
	<component
		:is="tag"
		:class="classes"
		:scope="tag === 'th' ? 'row' : false"
		:tabindex="tabindex"
	>
		<template v-if="hasSlot">
			<slot :column="column" :row="row" />
		</template>
		<template v-else>
			<span v-html="value" />
		</template>
	</component>
</template>

<script>
export default {
	props: {
		column: Object,
		row: Object,
		tabindex: [Number, Boolean]
	},
	computed: {
		/**
		 * Determine what kind of tag to use for the root element
		 */
		tag() {
			return this.column.isRowHeader ? 'th' : 'td';
		},

		/**
		 * Compile classes for the root element
		 */
		classes() {
			let classes = ['pkpTable__cell'];

			if (this.column.truncate) {
				classes.push('-truncate');
				classes.push('-truncate-' + this.column.truncate);
			}

			return classes;
		},

		/**
		 * Is there slot content in the default position?
		 */
		hasSlot() {
			return this.$slots.default;
		},

		/**
		 * The value retrieved from the row
		 */
		value() {
			if (typeof this.column.value === 'function') {
				return this.column.value(this.row);
			} else if (typeof this.row[this.column.value] !== 'undefined') {
				return this.row[this.column.value];
			}
			return '';
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpTable__cell.-truncate {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
	max-width: 20em;
}

.pkpTable__cell.-truncate-small {
	max-width: 10em;
}

.pkpTable__cell.-truncate-large {
	max-width: 40em;
}
</style>
