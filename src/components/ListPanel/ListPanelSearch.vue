<template>
	<div class="pkpListPanel__search">
		<label>
			<span class="-screenReader">{{ i18n.search }}</span>
			<input type="search" class="pkpListPanel__searchInput"
				@keyup="searchPhraseChanged"
				:id="inputId"
				:value="searchPhrase"
				:placeholder="i18n.search"
			>
			<span class="pkpListPanel__searchIcons">
				<icon icon="search" :inline="true" class="pkpListPanel__searchIcons--search" />
			</span>
		</label>
		<button class="pkpListPanel__searchClear"
			v-if="searchPhrase"
			@click.prevent="clearSearchPhrase"
			:aria-controls="inputId"
		>
			<icon icon="times" />
			<span class="-screenReader">{{ i18n.clearSearch }}</span>
		</button>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import debounce from 'debounce';

export default {
	name: 'ListPanelSearch',
	components: {
		Icon
	},
	props: ['searchPhrase', 'i18n'],
	computed: {
		inputId: function() {
			return 'list-panel-search-' + this._uid;
		}
	},
	methods: {
		/**
		 * A throttled function to signal to the parent element that the
		 * searchPhrase should be updated. It's throttled to allow it to be
		 * fired by frequent events, like keyup.
		 *
		 * @param string|object data A DOM event (object) or the new search
		 *  phrase (string)
		 */
		searchPhraseChanged: debounce(function(data) {
			var newVal = typeof data === 'string' ? data : data.target.value;
			this.$emit('searchPhraseChanged', newVal);
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

.pkpListPanel__search {
	position: relative;
	float: right;
	margin-top: 0.5em;
	max-width: 100%;
}

.pkpListPanel__searchInput,
/* Override legacy form styles for: .pkp_form input[type="search"] */
.pkp_form .pkpListPanel__search .pkpListPanel__searchInput {
	display: block;
	box-sizing: border-box;
	padding: 0 0.5em 0 3.5em;
	width: 25em;
	height: auto;
	max-width: 100%;
	border: @bg-border-light;
	border-radius: @radius;
	font-size: @font-sml;
	line-height: @double;
	-webkit-appearance: none; /* Override Safari search input styles */

	&:hover {
		border-color: @primary;

		+ .pkpListPanel__searchIcons {
			border-color: @primary;
		}
	}

	&:focus {
		outline: 0;
		border-color: @primary;

		+ .pkpListPanel__searchIcons {
			border-color: @primary;
			background: @primary;

			.pkpListPanel__searchIcons--search:before {
				color: #fff;
			}
		}
	}
}

.pkpListPanel__searchClear {
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

.pkpListPanel__actions + .pkpListPanel__search {
	margin-right: 0.5em;
}

.pkpListPanel__searchIcons {
	position: absolute;
	top: 0;
	left: 0;
	width: 2.5em;
	height: 100%;
	border-right: @bg-border-light;
	border-top-left-radius: @radius;
	border-bottom-left-radius: @radius;
}

.pkpListPanel__searchIcons--search {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: @primary;
}
</style>
