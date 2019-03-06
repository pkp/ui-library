<template>
	<div class="pkpSearch">
		<label>
			<span class="-screenReader">{{ searchLabel }}</span>
			<input type="search" class="pkpSearch__input"
				@keyup="searchPhraseKeyUp"
				:id="inputId"
				:value="searchPhrase"
				:placeholder="searchLabel"
			>
			<span class="pkpSearch__icons">
				<icon icon="search" :inline="true" class="pkpSearch__icons--search" />
			</span>
		</label>
		<button class="pkpSearch__clear"
			v-if="searchPhrase"
			@click.prevent="clearSearchPhrase"
			:aria-controls="inputId"
		>
			<icon icon="times" />
			<span class="-screenReader">{{ clearSearchLabel }}</span>
		</button>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import debounce from 'debounce';

export default {
	components: {
		Icon
	},
	props: {
		searchPhrase: {
			type: String,
			default() {
				return '';
			}
		},
		searchLabel: {
			type: String,
			required: true
		},
		clearSearchLabel: {
			type: String,
			required: true
		}
	},
	computed: {
		inputId: function() {
			return this._uid;
		}
	},
	methods: {
		/**
		 * Emit an event when the search phrase changes in response to a keyup
		 * event in the input field.
		 *
		 * @param object data A DOM event (object) or the new search
		 *  phrase (string)
		 */
		searchPhraseKeyUp: debounce(function(el) {
			this.$emit('searchPhraseChanged', el.target.value);
		}, 250),

		/**
		 * Clear the search phrase
		 */
		clearSearchPhrase: function() {
			this.$emit('searchPhraseChanged', '');
			this.$nextTick(function() {
				this.$el.querySelector('input[type="search"]').focus();
			});
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpSearch {
	position: relative;
	max-width: 100%;
}

.pkpSearch__input,
/* Override legacy form styles for: .pkp_form input[type="search"] */
.pkp_form .pkpSearch .pkpSearch__input {
	display: block;
	box-sizing: border-box;
	padding: 0 0.5em 0 3.5em;
	width: 20em;
	height: auto;
	max-width: 100%;
	border: @bg-border-light;
	border-radius: @radius;
	font-size: @font-sml;
	line-height: @double;
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
	width: @double;
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

.pkpListPanel__actions + .pkpSearch {
	margin-right: 0.5em;
}

.pkpSearch__icons {
	position: absolute;
	top: 0;
	left: 0;
	width: 2.5em;
	height: 100%;
	border-right: @bg-border-light;
	border-top-left-radius: @radius;
	border-bottom-left-radius: @radius;
}

.pkpSearch__icons--search {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: @primary;
}
</style>
