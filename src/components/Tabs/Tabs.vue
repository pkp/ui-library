<template>
	<div class="pkpTabs" :class="{'pkpTabs--side -pkpClearfix': isSideTabs}">
		<div class="pkpTabs__buttons" role="tablist" :aria-label="label">
			<button
				v-for="tab in tabs"
				:aria-selected="currentTab === tab.id"
				:aria-controls="tab.id"
				class="pkpTabs__button"
				:id="tab.id + '-button'"
				:key="tab.id"
				:ref="'button' + tab.id"
				role="tab"
				:tabindex="currentTab === tab.id ? '' : -1"
				@click="setCurrentTab(tab.id)"
				@keydown.35.prevent="setLastTab"
				@keydown.36.prevent="setFirstTab"
				@keydown.left.exact.prevent="setPreviousTab"
				@keydown.right.exact.prevent="setNextTab"
			>
				<template v-if="tab.icon">
					<icon :icon="tab.icon"></icon>
					<span class="-screenReader">{{ tab.label }}</span>
				</template>
				<template v-else>
					{{ tab.label }}
				</template>
				<template v-if="tab.badge">
					<badge>{{ tab.badge }}</badge>
				</template>
			</button>
		</div>
		<slot />
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import Badge from '@/components/Badge/Badge.vue';

export default {
	components: {
		Icon,
		Badge
	},
	props: {
		defaultTab: {
			type: String,
			default() {
				return '';
			}
		},
		isSideTabs: {
			type: Boolean,
			default() {
				return false;
			}
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
			currentTab: '',
			tabs: []
		};
	},
	methods: {
		/**
		 * Set the current tab
		 *
		 * @param {String} tabId
		 */
		setCurrentTab(tabId) {
			this.currentTab = tabId;
			this.$nextTick(() => $(this.$refs['button' + tabId]).focus());
		},

		/**
		 * Set the current tab to the first tab in the list
		 *
		 * Keyboard: [Home]
		 */
		setFirstTab() {
			this.setCurrentTab(this.tabs[0].id);
		},

		/**
		 * Set the current tab to the last tab in the list
		 *
		 * Keyboard: [End]
		 */
		setLastTab() {
			this.setCurrentTab(this.tabs[this.tabs.length - 1].id);
		},

		/**
		 * Set the current tab to the next tab in the list.
		 * Jump to the start if the current tab is the last one.
		 *
		 * Keyboard: →
		 */
		setNextTab() {
			const i = this.tabs.findIndex(tab => tab.id === this.currentTab);
			const tab = this.tabs[i + 1] || this.tabs[0];
			this.setCurrentTab(tab.id);
		},

		/**
		 * Set the current tab to the previous tab in the list.
		 * Jump to the end if the current tab is the first one.
		 *
		 * Keyboard: ←
		 */
		setPreviousTab() {
			const i = this.tabs.findIndex(tab => tab.id === this.currentTab);
			const tab = this.tabs[i - 1] || this.tabs[this.tabs.length - 1];
			this.setCurrentTab(tab.id);
		}
	},
	mounted() {
		/**
		 * Store the nested tabs as a data property
		 */
		this.tabs = this.$children.filter(
			child => child.$options._componentTag === 'tab'
		);

		/**
		 * Set the tab to view when loaded
		 */
		this.currentTab = this.defaultTab || this.tabs[0].id;

		/**
		 * Listen for global 'tab' events and open the correct tab when called
		 */
		pkp.eventBus.$on('open-tab', tabId => {
			this.tabs.forEach(tab => {
				if (tab.id === tabId) {
					this.setCurrentTab(tabId);
				}
			});
		});
	},
	watch: {
		/**
		 * Update the active tab when a new tab is selected
		 */
		currentTab(newVal, oldVal) {
			this.tabs.forEach(tab => (tab.isActive = tab.id === newVal));
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpTabs {
	margin: 0;
	list-style: none;
	font-size: @font-sml;
}

.pkpTabs__button {
	position: relative;
	display: inline-block;
	padding: 0.8rem 1em;
	line-height: 1.4rem;
	border: @bg-border-light;
	border-top-left-radius: @radius;
	border-top-right-radius: @radius;
	background: @lift;
	text-decoration: none;
	font-weight: @bold;
	color: @primary;

	&:before {
		content: '';
		position: absolute;
		top: -1px;
		left: 50%;
		transform: translateX(-50%);
		width: 25%;
		height: 2px;
		background: transparent;
		transition: all 0.2s;
	}

	/* Ensure focus is visible at all times */
	&:focus {
		outline: 0;

		&:after {
			content: '';
			position: absolute;
			bottom: 0.375rem;
			width: 0.25rem;
			height: 0.25rem;
			left: 50%;
			transform: translateX(-50%);
			background-color: @text-light-rgba;
			border-radius: 0.125rem;
		}
	}

	+ .pkpTabs__button {
		margin-left: 0.25rem;
	}

	.pkpBadge {
		padding-left: 0.5em;
		padding-right: 0.5em;
	}
}

.pkpTabs__button:focus:before,
.pkpTabs__button:hover:before,
.pkpTabs__button[aria-selected='true']:before {
	background: @primary-lift;
	width: 100%;
}

.pkpTabs__button[aria-selected='true'] {
	color: @text-light;
}

.pkpTab {
	position: relative;
	padding: @base;
	background: @lift;

	&:focus {
		z-index: 2;
	}
}

// Nested tabs
.pkpTabs .pkpTabs {
	margin-left: -@base;
	margin-right: -@base;
}

@media (min-width: 767px) {
	.pkpTabs__buttons {
		position: relative;
		top: 1px;
		padding-left: 1rem;
		z-index: 2;
	}

	.pkpTabs__button {
		border-color: transparent;
		background: transparent;
	}

	.pkpTabs__button[aria-selected='true'] {
		border: @bg-border-light;
		border-bottom-color: transparent;
		background: @lift;
	}

	.pkpTab {
		padding: @double;
		border: @bg-border-light;
		border-radius: @radius;
	}

	/* Nested tabs */
	.pkpTabs .pkpTabs {
		margin-left: -@double;
		margin-right: -@double;
		margin-bottom: -@double;

		.pkpTabs__buttons {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.pkpTab {
			border: none;
			border-top: @bg-border-light;
		}
	}

	/* Side-tabs */
	.pkpTabs--side {
		.pkpTabs__buttons {
			width: 192px;
			float: left;
			top: 0;
			padding-left: 0;
			padding-right: 0;
			margin-bottom: @double;
			border-right: @bg-border-light;
		}

		.pkpTabs__button {
			display: block;
			width: 100%;
			padding-right: @base;
			border-left: none;
			border-right: none;
			border-color: transparent;
			top: auto;
			right: -1px; // overlap right border
			text-align: left;

			&:before {
				content: '';
				position: absolute;
				top: 50%;
				left: -2px;
				transform: translateY(-50%);
				height: 25%;
				width: 2px;
				background: transparent;
				transition: all 0.2s;
			}

			&:focus {
				outline: 0;

				&:after {
					top: 50%;
					bottom: auto;
					left: 0.375rem;
					transform: translateY(-50%);
				}
			}

			+ .pkpTabs__button {
				margin-left: 0;
			}
		}

		.pkpTabs__button:focus:before,
		.pkpTabs__button:hover:before,
		.pkpTabs__button[aria-selected='true']:before {
			background: @primary-lift;
			height: 100%;
			width: 2px;
		}

		.pkpTabs__button[aria-selected='true'] {
			border-color: @bg-border-color-light;
			border-left: none;
			border-right: none;
		}

		.pkpTab {
			margin-left: 192px;
		}
	}

	.pkpTabs .pkpTabs--side .pkpTabs__buttons {
		padding-right: 0;
	}

	.pkpTabs .pkpTabs--side .pkpTab {
		padding-top: 0;
		border-top: none;

		.pkpForm {
			margin: 0 0 @double (-@double - 1); // overlap border
			border: @bg-border-light;
		}

		// Fix off-by-one errors with the locale and side tab border lines
		&:nth-child(2) {
			.pkpFormPages {
				margin-top: -1px;
			}
		}
	}

	/* Forms in tabs */
	.pkpTab > .pkpForm {
		margin: -@double;
	}
}
</style>
