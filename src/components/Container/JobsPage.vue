<script>
import Page from './Page.vue';
import PkpHeader from '@/components/Header/Header.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import ajaxError from '@/mixins/ajaxError';
import modal from '@/mixins/modal.js';

export default {
	name: 'JobsPage',
	extends: Page,
	mixins: [ajaxError, modal],
	components: {
		PkpHeader,
		PkpTable,
		TableCell
	},
	data() {
		return {
			apiUrl: '',
			columns: [],
			rows: [],
			isSidebarVisible: false,
			isLoadingItems: false
		};
	},
	computed: {
		/**
		 * Add a class to the sidebar when it is visible
		 *
		 * @return Array
		 */
		sidebarClasses() {
			let classes = [];
			if (this.isSidebarVisible) {
				classes.push('-isVisible');
			}
			return classes;
		},

		/**
		 * Add classes to the table when it is loading
		 *
		 * @return Array
		 */
		tableClasses() {
			let classes = [];
			if (this.isLoadingItems) {
				classes.push('-isLoading');
			}
			return classes;
		}
	},
	methods: {
		/**
		 * Toggle filter visibility
		 */
		toggleSidebar() {
			this.isSidebarVisible = !this.isSidebarVisible;
			if (!this.isSidebarVisible) {
				this.activeFilters = {};
				this.get();
			}
		},

		/**
		 * Set the tabindex on items in the sidebar to allow/prevent
		 * them from accepting focus
		 *
		 * @param {Boolean} enable
		 */
		setSidebarFocus() {
			if (!this.$refs.sidebar) {
				return;
			}
			const tabIndex = this.isSidebarVisible ? 0 : -1;
			this.$refs.sidebar
				.querySelectorAll('button, [href], input, select, textarea')
				.forEach(el => (el.tabIndex = tabIndex));
		}
	},
	watch: {
		isSidebarVisible(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.setSidebarFocus();

			// move focus into the sidebar when it is made visible
			if (newVal) {
				this.$nextTick(() => {
					if (newVal && Object.keys(this.$refs).includes('sidebar')) {
						this.setFocusIn(this.$refs.sidebar);
					}
				});
			}
		}
	},
	mounted() {
		/**
		 * Set the initial tabindex attributes in the sidebar
		 */
		this.setSidebarFocus();
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpStats > .pkpHeader {
	padding: 0.5rem 0;
}

.pkpStats__graph {
	margin-bottom: 1rem;
}

.pkpStats__content {
	margin-left: 0;
	transition: margin-left 0.2s;
}

.pkpStats__sidebar {
	position: absolute;
	left: -9999px;
	opacity: 0;
	width: 0;

	+ .pkpStats__content {
		float: right;
		width: 100%;
		transition: width 0.2s;
	}

	.pkpHeader,
	.pkpFilter {
		margin-left: -1rem;
	}

	.pkpStats__filterSet:first-child .pkpHeader {
		padding-top: 0;
	}
}

.pkpStats__sidebar.-isVisible {
	float: left;
	position: relative;
	left: 0;
	width: 25%;
	opacity: 1;
	transition: opacity 0.2s ease-in-out 0.2s, left 0s ease-in-out 0.1s,
		width 0.2s ease-in-out 0s;

	+ .pkpStats__content {
		width: 75%;
	}
}

.pkpStats__sidebar .pkpHeader {
	padding: 1.5rem 0.5rem 0rem 1rem;
}

.pkpStats__sidebar > .pkpHeader:first-child {
	padding: 0.5rem 0.5rem 0.5rem 1rem;
}

.pkpStats__sidebar .pkpHeader__title > h1,
.pkpStats__sidebar .pkpHeader__title > h2,
.pkpStats__sidebar .pkpHeader__title > h3,
.pkpStats__sidebar .pkpHeader__title > h4,
.pkpStats__sidebar .pkpHeader__title > h5,
.pkpStats__sidebar .pkpHeader__title > h6,
.pkpStats__sidebar .pkpHeader__title {
	font-size: @font-sml;
	font-weight: @bold;
	line-height: 1.5em;
}

.pkpStats__filterSet {
	margin: 1rem 0;
}
.pkpStats__panel {
	padding: 1rem;
	background: #fff;
	border-radius: @radius;

	> .pkpHeader {
		margin-top: -1rem;
		padding: 0.5rem 0;
	}
}

.pkpStats__itemsOfTotal {
	font-size: @font-tiny;
}

.pkpStats__titleSearch {
	display: inline-block;
	float: none;
	margin-top: 0;
	margin-left: 1rem;
	max-width: 20em;

	.pkpSearch__input {
		font-size: @font-tiny;
		line-height: 2.5em;
		padding-left: 2.5rem;
	}
}

.pkpStats__itemLink {
	color: @text;
	text-decoration: none;

	&:hover,
	&:focus {
		color: @primary;
		text-decoration: underline;
		outline: 5px solid transparent;
	}
}

.pkpStats__itemAuthors {
	font-weight: @bold;
}

.pkpStats__noRecords {
	padding: 2rem 1rem;
	border: @grid-border;
	border-top: none;
	font-size: @font-sml;
	text-align: center;
	color: @text-light;
}

.pkpStats__graph {
	background: @bg-anchor;
	color: #fff;
	border-radius: @radius;

	.chartjs-render-monitor {
		border-radius: @radius;
	}
}

.pkpStats__graphHeader {
	padding: 1rem;
}

.pkpStats__graphSelectors {
	display: flex;
	align-items: center;
}

.pkpStats__graphSelector {
	display: flex;

	.pkpButton {
		position: relative;
		z-index: 1;
		background: transparent;
		border: 1px solid #437b96;
		box-shadow: 0 1px 0 #000;
		font-size: @font-tiny;
		line-height: 2em;
		color: #fff;

		&:before {
			content: '';
			position: relative;
			display: inline-block;
			width: 0.75em;
			height: 0.75em;
			margin-right: 0.25em;
			border: 1px solid #fff;
			border-radius: 50%;
		}

		&:first-child {
			position: relative;
			left: 1px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		&:last-child {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}

		&:hover,
		&:focus {
			color: #fff;
			border-color: #fff;
			z-index: 2;
		}

		&[aria-pressed='true'] {
			background: @primary;

			&:before {
				background: #fff;
				box-shadow: inset 0 0 0 1px @primary;
			}
		}

		&[disabled] {
			background: transparent;
			opacity: 0.5;
		}
	}
}

.pkpStats__graphSelector--timelineInterval {
	margin-left: auto;
}

// Fade the graph and table when loading
.pkpStats__graph {
	position: relative;
}

.pkpStats__loadingCover {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1;

	> .pkpSpinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		&:before {
			width: 100px;
			height: 100px;
			border-top-color: #fff;
			border-left-color: #fff;
			animation-duration: 0.8s;
		}
	}
}

.pkpStats__table .pkpTable.-isLoading tbody {
	opacity: 0.5;
}
</style>
