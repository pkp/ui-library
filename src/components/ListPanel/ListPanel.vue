<template>
	<div class="listPanel">
		<div class="listPanel__header">
			<slot name="header">
				<pkp-header>
					<component :is="headingLevel">{{ title }}</component>
				</pkp-header>
			</slot>
		</div>
		<div class="listPanel__body">
			<transition name="listPanel__sidebar">
				<div
					v-if="!!$slots.sidebar && isSidebarVisible"
					class="listPanel__sidebar"
					ref="sidebar"
				>
					<slot name="sidebar" />
				</div>
			</transition>
			<div class="listPanel__items">
				<div v-if="!items.length" class="listPanel__empty">
					<slot name="itemsEmpty">{{ currentEmptyLabel }}</slot>
				</div>
				<ul v-else class="listPanel__itemsList">
					<li v-for="item in items" :key="item.id" class="listPanel__item">
						<slot name="item" :item="item">
							<div class="listPanel__itemSummary">
								<div class="listPanel__itemIdentity">
									<div class="listPanel__itemTitle">
										<slot name="itemTitle" :item="item">{{ item.title }}</slot>
									</div>
									<div
										class="listPanel__itemSubtitle"
										v-if="!!$scopedSlots.itemSubtitle || item.subtitle"
									>
										<slot name="itemSubtitle" :item="item">
											{{ item.subtitle }}
										</slot>
									</div>
								</div>
								<div
									v-if="!!$scopedSlots.itemActions"
									class="listPanel__itemActions"
								>
									<slot name="itemActions" :item="item" />
								</div>
							</div>
						</slot>
						<div
							v-if="expanded.includes(item.id)"
							class="listPanel__itemExpanded"
						>
							<slot name="itemExpanded" :item="item" />
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div v-if="!!$slots.footer" class="listPanel__footer">
			<slot name="footer" />
		</div>
	</div>
</template>

<script>
import Notification from '@/components/Notification/Notification.vue';
import PkpHeader from '@/components/Header/Header.vue';

export default {
	name: 'ListPanel',
	components: {
		Notification,
		PkpHeader
	},
	props: {
		description: {
			type: String,
			default() {
				return '';
			}
		},
		emptyLabel: {
			type: String,
			default() {
				return '';
			}
		},
		expanded: {
			type: Array,
			default() {
				return [];
			}
		},
		headingLevel: {
			type: String,
			default() {
				return 'h2';
			}
		},
		isSidebarVisible: {
			type: Boolean,
			default() {
				return false;
			}
		},
		items: {
			type: Array,
			required: true
		},
		title: {
			type: String,
			default() {
				return '';
			}
		}
	},
	computed: {
		currentEmptyLabel() {
			return this.emptyLabel ? this.emptyLabel : this.__('common.noItemsFound');
		}
	},
	watch: {
		/**
		 * Adjust focus when sidebar opened or closed
		 */
		isSidebarVisible: function(newVal, oldVal) {
			if (newVal) {
				this.$nextTick(() => {
					// move focus into the sidebar when it is made visible
					if (newVal) {
						if (Object.keys(this.$refs).includes('sidebar')) {
							this.setFocusIn(this.$refs.sidebar);
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.listPanel {
	position: relative;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	border-radius: @radius;
	border-top: @grid-border;
}

.listPanel__header {
	padding: 0.5rem 0.5rem 0.5rem 1rem;
	font-size: @font-sml;
	line-height: 1.5rem;

	> .pkpHeader {
		padding: 0;
	}
}

.listPanel .pkpNotification {
	border: none;
	box-shadow: none;
	padding: 1rem;
}

.listPanel__body {
	display: flex;
	align-items: top;
	border-top: @grid-border;
}

.listPanel__sidebar {
	position: relative;
	flex: 0 0 12rem;
	border-right: @grid-border;
}

.listPanel__sidebar-enter {
	margin-right: -12rem;
	opacity: 0;
}

.listPanel__sidebar-enter-active {
	transition: opacity 0.15s ease-in-out 0.15s, margin-right 0.15s ease-in-out;
}

.listPanel__sidebar-enter-to {
	margin-right: 0;
	opacity: 1;
}

.listPanel__sidebar-leave {
	margin-right: 0;
	opacity: 1;
}

.listPanel__sidebar-leave-to {
	margin-right: -12em;
	opacity: 0;
}

.listPanel__sidebar-leave-active {
	transition: opacity 0.15s ease-in-out, margin-right 0.15s ease-in-out 0.15s;
}

.listPanel__sidebar > .pkpHeader {
	padding-left: 1rem;
	padding-right: 1rem;
}

.listPanel__block {
	margin: 1rem 0.5rem 1rem 1rem;

	.pkpHeader {
		padding: 0;
	}

	.pkpFilter {
		margin-left: -1rem;
		margin-right: -0.5rem;
	}
}

.listPanel__sidebar .pkpHeader + .listPanel__block {
	margin-top: 0;
}

.listPanel__sidebar .pkpHeader__title > h1,
.listPanel__sidebar .pkpHeader__title > h2,
.listPanel__sidebar .pkpHeader__title > h3,
.listPanel__sidebar .pkpHeader__title > h4,
.listPanel__sidebar .pkpHeader__title > h5,
.listPanel__sidebar .pkpHeader__title > h6,
.listPanel__sidebar .pkpHeader__title {
	font-size: @font-sml;
	font-weight: @bold;
	line-height: 1.5em;
}

.listPanel__items {
	width: 100%; // Force full width as flexed box
	min-width: 0;
}

.listPanel__itemsList {
	margin: 0;
	padding: 0.5rem 0;
	list-style: none;
}

.listPanel__item {
	padding: 0.75rem 0.5rem 0.75rem 1rem;
}

.listPanel__itemSummary {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
}

.listPanel__itemIdentity {
	font-size: @font-sml;
	line-height: 1.5rem;
	flex: 1;
	min-width: 0;
}

.listPanel__itemTitle {
	font-weight: @bold;
}

.listPanel__itemTitle,
.listPanel__itemSubtitle {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.listPanel__empty {
	padding: 2rem;
	font-size: @font-sml;
	line-height: 1.5rem;
	text-align: center;
}

.listPanel__itemActions {
	display: flex;
	align-items: center;
	margin-left: auto;
	padding-left: 0.5rem;
	font-size: @font-tiny;
	line-height: 1.5em;

	> * {
		white-space: nowrap;
	}

	// Space between each button or action
	> * + * {
		margin-left: 0.25rem;
	}
}

.listPanel__itemExpanded {
	margin-right: 2.25rem;
}

.listPanel__itemExpanded .list {
	margin-top: 0.5rem;
}

.listPanel__itemExpandedActions {
	margin-top: 0.5rem;
	text-align: right;

	> * + * {
		margin-left: 0.25rem;
	}
}

.listPanel__footer {
	padding: 0.5rem;
}

[dir='rtl'] {
	.listPanel__itemActions {
		padding-left: 0;
		padding-right: 0.5rem;

		// Space between each button or action
		> * + * {
			margin-left: 0;
			margin-right: 0.25rem;
		}
	}

	.listPanel__itemExpanded {
		margin-right: 0;
		margin-left: 2.25rem;
	}

	.listPanel__itemExpandedActions {
		text-align: left;

		> * + * {
			margin-left: 0;
			margin-right: 0.25rem;
		}
	}
}
</style>
