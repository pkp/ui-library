<template>
	<div v-if="locales.length" class="pkpFormLocales">
		<button v-for="locale in additionalLocales"
			class="pkpFormLocales__locale"
			:key="locale.key"
			:label="locale.label"
			:class="{'pkpFormLocales__locale--isActive': visible.includes(locale.key)}"
			@click.prevent="toggleLocale(locale.key)"
		>
			{{ locale.label }}
		</button>
		<span class="pkpFormLocales__locale pkpFormLocales__locale--isPrimary">
			{{ this.primaryLocale.label }}
		</span>
	</div>
</template>

<script>
export default {
	name: 'FormLocales',
	props: {
		locales: {
			type: Array,
			required: true
		},
		visible: {
			type: Array,
			required: true
		},
		primaryLocaleKey: {
			type: String,
			required: true
		}
	},
	computed: {
		/**
		 * The site's primary locale
		 *
		 * @return Object
		 */
		primaryLocale: function() {
			return this.locales.find(locale => locale.key === this.primaryLocaleKey);
		},

		/**
		 * All locales except the primary locale
		 *
		 * @return Array
		 */
		additionalLocales: function() {
			return this.locales.filter(
				locale => locale.key !== this.primaryLocaleKey
			);
		}
	},
	methods: {
		/**
		 * Toggle the visible locale when clicked
		 *
		 * If a locale is already selected, it will be removed from the visible
		 * locales. If a locale is not already selected, it will be displayed with
		 * the primary locale and any other visible locale will be removed. The
		 * primary locale is always visible.
		 *
		 * @param string localeKey "en_US"
		 */
		toggleLocale: function(localeKey) {
			let selected = [this.primaryLocaleKey];
			if (!this.visible.includes(localeKey)) {
				selected.push(localeKey);
			}
			this.updateLocales(selected);
		},

		/**
		 * Emit an event with updated locales
		 *
		 * @param array selected Locales which should be visible
		 */
		updateLocales: function(selected) {
			this.$emit('updateLocales', selected);
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFormLocales {
	position: relative;
	padding: 0 @base;
	border-bottom: @bg-border-light;
	background: @lift;
	text-align: right;
	z-index: 1;
}

.pkpFormLocales__locale {
	position: relative;
	display: inline-block;
	padding: @half;
	background: #fff;
	border: none;
	font-size: @font-tiny;
	line-height: @double;
	color: @primary;
}

button.pkpFormLocales__locale {
	cursor: pointer;
}

.pkpFormLocales__locale--isPrimary {
	padding-right: 0;
	padding-left: @base;
	border-left: @bg-border-light;
	font-weight: @bold;
	color: @text-light;
}

.pkpFormLocales__locale--isActive {
	font-weight: @bold;
}

.pkpFormLocales__locale + .pkpFormLocales__locale {
	margin-left: 0.5em;
}

.pkpFormLocales__locale:not(.pkpFormLocales__locale--isPrimary):after,
.pkpFormLocales__locale--isActive:after {
	position: absolute;
	content: '';
	bottom: 0;
	left: 50%;
	width: 25%;
	height: 2px;
	background: transparent;
	transform: translateX(-50%);
	transition: all 0.2s;
}

.pkpFormLocales__locale:not(.pkpFormLocales__locale--isPrimary):hover,
.pkpFormLocales__locale:not(.pkpFormLocales__locale--isPrimary):focus,
.pkpFormLocales__locale--isActive:not(.pkpFormLocales__locale--isPrimary) {
	outline: 0;

	&:after {
		width: 100%;
		background: @primary;
	}
}
</style>
