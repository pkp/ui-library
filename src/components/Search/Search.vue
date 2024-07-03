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
				<Icon icon="search" class="pkpSearch__icons--search" />
			</span>
		</label>
		<button
			v-if="searchPhrase"
			class="pkpSearch__clear"
			:aria-controls="inputId"
			@click.prevent="clearSearchPhrase"
		>
			<Icon icon="times" />
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

			.pkpSearch__icons--search:before {
				color: #fff;
			}
		}
	}
}

.pkpSearch__clear {
	position: absolute;
	top: 0;
	right: 0;
	width: 2rem;
	height: 100%;
	background: transparent;
	border: none;
	border-top-right-radius: @radius;
	border-bottom-right-radius: @radius;
	vertical-align: middle;
	text-align: center;
	color: @offset;
	cursor: pointer;

	&:hover,
	&:focus {
		outline: 0;
		background: @offset;
		color: #fff;
	}
}

.pkpSearch__icons {
	position: absolute;
	top: 0;
	left: 0;
	width: 2.5em;
	height: 100%;
	border-inline-end: 1px solid #777;
}

.pkpSearch__icons--search {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: @primary;
}

[dir='rtl'] {
	.pkpSearch__clear {
		right: auto;
		left: 0;
	}

	.pkpSearch__icons {
		left: auto;
		right: 0;
	}
}
</style>
