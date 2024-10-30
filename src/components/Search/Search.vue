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
				@keyup="searchPhraseKeyUp"
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
import debounce from 'debounce';
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
		/** This event will be emitted when the search phrase changes. The event is debounced so that it will only be emitted when the user stops typing for 250ms. */
		'search-phrase-changed',
	],
	computed: {
		inputId() {
			return this._uid;
		},
		currentSearchLabel() {
			return this.searchLabel ? this.searchLabel : this.t('common.search');
		},
	},
	methods: {
		/**
		 * Emit an event when the search phrase changes in response to a keyup
		 * event in the input field.
		 *
		 * @param {Object} data A DOM event (object) or the new search
		 *  phrase (string)
		 */
		searchPhraseKeyUp: debounce(function (el) {
			this.$emit('search-phrase-changed', el.target.value);
		}, 250),

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
