<template>
	<div class="pkpListPanel__search" :class="classSearching">
		<label>
			<span class="pkpListPanel__searchLabel">{{ i18n.search }}</span>
			<input type="search"
				@keyup="searchPhraseChanged"
				:value="searchPhrase"
				:placeholder="i18n.search"
			>
			<span class="pkpListPanel__searchIcons">
				<span class="pkpListPanel__searchIcons--search fa fa-search"></span>
				<span class="pkpListPanel__searchIcons--searching"></span>
			</span>
		</label>
	</div>
</template>

<script>
export default {
	name: 'ListPanelSearch',
	props: ['isSearching', 'searchPhrase', 'i18n'],
	computed: {
		classSearching: function () {
			return { searching: this.isSearching };
		},
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
		searchPhraseChanged: _.debounce(function (data) {
			var newVal = typeof data === 'string' ? data : data.target.value;
			this.$emit('searchPhraseChanged', newVal);
		}, 250),
	},
};
</script>

<style lang="less">
@import '../../styles/_config';

.pkpListPanel__search {
	position: relative;
	float: right;
	margin-top: 0.5em;
	max-width: 100%;

	input {
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

				.pkpListPanel__searchIcons--searching:before {
					border-top-color: rgba(255,255,255,0.5);
					border-left-color: rgba(255,255,255,0.5);
				}
			}
		}
	}

	&.searching {

		.pkpListPanel__searchIcons--search {
			opacity: 0;
		}

		.pkpListPanel__searchIcons--searching:before {
			opacity: 1;
		}
	}
}

.pkpListPanel__actions + .pkpListPanel__search {
	margin-right: 0.5em;
}

.pkpListPanel__searchLabel {
	.pkp_screen_reader();
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
	transition: opacity 0.3s;
	opacity: 1;
}

.pkpListPanel__searchIcons--searching:before {
	&:extend(.pkp_spinner:after);
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -10px;
	margin-left: -10px;
	opacity: 0;
	transition: opacity 0.3s;
}
</style>
