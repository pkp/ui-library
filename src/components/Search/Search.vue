<template>
	<div class="pkpSearch">
		<label>
			<span class="-screenReader">{{ currentSearchLabel }}</span>
			<input
				:id="inputId"
				type="search"
				class="pkpSearch__input"
				:value="searchPhrase"
				:placeholder="currentSearchLabel"
				@keydown.enter.prevent="submitSearchPhrase"
			/>
			<span class="pkpSearch__icons">
				<Icon
					icon="Search"
					class="absolute left-2/4 top-2/4 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform text-primary"
				/>
			</span>
		</label>
		<button
			v-if="searchPhrase"
			class="absolute top-0 h-full w-8 text-negative hover:bg-negative hover:text-on-dark focus:bg-negative focus:text-on-dark ltr:right-0 rtl:left-0 rtl:right-auto"
			:aria-controls="inputId"
			@click.prevent="clearSearchPhrase"
		>
			<Icon icon="Cancel" class="relative bottom-[2px] h-4 w-4" />
			<span class="-screenReader">{{ t('common.clearSearch') }}</span>
		</button>
	</div>
</template>

<script>
import {useId} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
export default {
	components: {Icon},
	props: {
		/** An optional label for the search field. Default: `Search` */
		searchLabel: {
			type: String,
			default() {
				return '';
			},
		},
		/** The current search phrase. */
		searchPhrase: {
			type: String,
			default() {
				return '';
			},
		},
	},
	emits: [
		/** This event will be emitted when the user submits the search phrase with Enter, or clears it. */
		'search-phrase-changed',
	],
	computed: {
		inputId() {
			return useId();
		},
		currentSearchLabel() {
			return this.searchLabel ? this.searchLabel : this.t('common.search');
		},
	},
	methods: {
		/**
		 * Emit the search phrase once the user presses Enter. Searching as they type moves
		 * the results out from under a screen reader, so we wait until they say they're done.
		 * Enter is caught on keydown so it can't submit a form the search sits inside.
		 *
		 * @param {Object} el A DOM event
		 */
		submitSearchPhrase(el) {
			this.$emit('search-phrase-changed', el.target.value);
		},

		/**
		 * Clear the search phrase
		 */
		clearSearchPhrase() {
			this.$emit('search-phrase-changed', '');
			this.$nextTick(function () {
				this.$el.querySelector('input[type="search"]').focus();
			});
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpSearch {
	position: relative;
	width: 18rem;
	max-width: 100%;
}

.pkpSearch__input,
/* Override legacy form styles for: .pkp_form input[type="search"] */
.pkp_form .pkpSearch .pkpSearch__input {
	display: block;
	box-sizing: border-box;
	padding: 0 0.5em;
	padding-inline-start: 3.5em;
	width: 100%;
	height: auto;
	border: 1px solid #777;
	border-radius: @radius;
	font-size: @font-sml;
	line-height: 2rem;
	-webkit-appearance: none; /* Override Safari search input styles */

	&:hover {
		border-color: @primary;

		+ .pkpSearch__icons {
			border-color: @primary;
		}
	}

	&:focus {
		outline: 0;
		border-color: @primary;

		+ .pkpSearch__icons {
			border-color: @primary;
			background: @primary;

			span {
				@apply text-on-dark;
			}
		}
	}
}

.pkpSearch__input::-webkit-search-cancel-button {
	-webkit-appearance: none;
	appearance: none;
}

.pkpSearch__icons {
	position: absolute;
	top: 0;
	left: 0;
	width: 2.5em;
	height: 100%;
	border-inline-end: 1px solid #777;
}

[dir='rtl'] {
	.pkpSearch__icons {
		left: auto;
		right: 0;
	}
}
</style>
