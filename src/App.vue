<template>
	<div id="app">
		<nav class="nav" aria-label="Primary Navigation">
			<nav-group>
				<template slot="heading">
					Guide
				</template>
				<li>
					<router-link to="/" class="router-link-home">
						Introduction
					</router-link>
				</li>
				<li><router-link to="/pages/usage">Usage</router-link></li>
				<li>
					<router-link to="/pages/accessibility">Accessibility</router-link>
				</li>
				<li>
					<router-link to="/pages/contributing">Contributing</router-link>
				</li>
			</nav-group>
			<nav-group>
				<template slot="heading">
					Pages
				</template>
				<li>
					<router-link to="/component/Page">
						Page
					</router-link>
				</li>
				<li>
					<router-link to="/component/DecisionPage">
						DecisionPage
					</router-link>
				</li>
				<li>
					<router-link to="/component/StatsPage">
						StatsPage
					</router-link>
				</li>
				<li>
					<router-link to="/component/WorkflowPage">
						WorkflowPage
					</router-link>
				</li>
			</nav-group>
			<nav-group>
				<template slot="heading">
					Utilities
				</template>
				<li><router-link to="/pages/container">Container</router-link></li>
				<li><router-link to="/pages/csrf">CSRF Token</router-link></li>
				<li><router-link to="/utilities/Dialog">Dialog</router-link></li>
				<li><router-link to="/pages/event-bus">Event Bus</router-link></li>
				<li><router-link to="/pages/fetch">Fetch</router-link></li>
				<li>
					<router-link to="/pages/localization">Localization</router-link>
				</li>
				<li><router-link to="/utilities/Notify">Notify</router-link></li>
			</nav-group>
			<nav-group>
				<template slot="heading">
					Components
				</template>
				<li>
					<router-link to="/component/ActionPanel">ActionPanel</router-link>
				</li>
				<li><router-link to="/component/Badge">Badge</router-link></li>
				<li><router-link to="/component/Button">Button</router-link></li>
				<li><router-link to="/component/Chart">Chart</router-link></li>
				<li><router-link to="/component/Composer">Composer</router-link></li>
				<li><router-link to="/component/DateRange">DateRange</router-link></li>
				<li><router-link to="/component/Dropdown">Dropdown</router-link></li>
				<li><router-link to="/component/File">File</router-link></li>
				<li>
					<router-link to="/component/FileAttacher">FileAttacher</router-link>
				</li>
				<li>
					<router-link to="/component/FileUploader">
						FileUploader
					</router-link>
				</li>
				<li>
					<router-link to="/component/FileUploadProgress">
						FileUploadProgress
					</router-link>
				</li>
				<li><router-link to="/component/Filter">Filter</router-link></li>
				<li :class="{'-submenuOpen': displaySubmenu('Form')}">
					<router-link to="/component/Form">Form</router-link>
					<button
						v-if="!pathIncludes('Form')"
						class="nav__toggle"
						@click="toggleSubmenu('Form')"
					>
						<span v-if="displaySubmenu('Form')">-</span>
						<span v-else>+</span>
					</button>
					<ul v-if="displaySubmenu('Form')">
						<li>
							<router-link to="/component/Form/fields/FieldBase">
								FieldBase
							</router-link>
						</li>
					</ul>
					<ul v-if="displaySubmenu('Form')">
						<li>
							<router-link to="/component/Form/fields/FieldAutosuggestPreset">
								FieldAutosuggestPreset
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldBaseAutosuggest">
								FieldBaseAutosuggest
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldHtml">
								FieldHtml
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldOptions">
								FieldOptions
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldRadioInput">
								FieldRadioInput
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldRichTextarea">
								FieldRichTextarea
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldSelect">
								FieldSelect
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldText">
								FieldText
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldTextarea">
								FieldTextarea
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldUpload">
								FieldUpload
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldUploadImage">
								FieldUploadImage
							</router-link>
						</li>
					</ul>
					<ul v-if="displaySubmenu('Form')">
						<li>
							<router-link to="/component/Form/fields/FieldArchivingPn">
								FieldArchivingPn
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldColor">
								FieldColor
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldPreparedContent">
								FieldPreparedContent
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldPubId">
								FieldPubId
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldMetadataSetting">
								FieldMetadataSetting
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldSelectIssue">
								FieldSelectIssue
							</router-link>
						</li>
						<li>
							<router-link to="/component/Form/fields/FieldShowEnsuringLink">
								FieldShowEnsuringLink
							</router-link>
						</li>
					</ul>
				</li>
				<li><router-link to="/component/Header">Header</router-link></li>
				<li>
					<router-link to="/component/HelpButton">HelpButton</router-link>
				</li>
				<li><router-link to="/component/Icon">Icon</router-link></li>
				<li><router-link to="/component/List">List</router-link></li>
				<li :class="{'-submenuOpen': displaySubmenu('ListPanel')}">
					<router-link to="/component/ListPanel">ListPanel</router-link>
					<button
						v-if="!pathIncludes('ListPanel')"
						class="nav__toggle"
						@click="toggleSubmenu('ListPanel')"
					>
						<span v-if="displaySubmenu('ListPanel')">-</span>
						<span v-else>+</span>
					</button>
					<ul v-if="displaySubmenu('ListPanel')">
						<li>
							<router-link
								to="/component/ListPanel/components/AnnouncementsListPanel"
							>
								AnnouncementsListPanel
							</router-link>
						</li>
						<li>
							<router-link
								to="/component/ListPanel/components/CatalogListPanel"
							>
								CatalogListPanel
							</router-link>
						</li>
						<li>
							<router-link to="/component/ListPanel/components/DoiListPanelOJS">
								DoiListPanelOJS
							</router-link>
						</li>
						<li>
							<router-link
								to="/component/ListPanel/components/EmailTemplatesListPanel"
							>
								EmailTemplatesListPanel
							</router-link>
						</li>
						<li>
							<router-link
								to="/component/ListPanel/components/SelectReviewerListPanel"
							>
								SelectReviewerListPanel
							</router-link>
						</li>
						<li>
							<router-link
								to="/component/ListPanel/components/SubmissionFilesListPanel"
							>
								SubmissionFilesListPanel
							</router-link>
						</li>
						<li>
							<router-link
								to="/component/ListPanel/components/SubmissionsListPanel"
							>
								SubmissionsListPanel
							</router-link>
						</li>
					</ul>
				</li>

				<li>
					<router-link to="/component/Modal">
						Modal
					</router-link>
				</li>
				<li>
					<router-link to="/component/MultilingualProgress">
						MultilingualProgress
					</router-link>
				</li>
				<li>
					<router-link to="/component/Notification">Notification</router-link>
				</li>
				<li><router-link to="/component/Orderer">Orderer</router-link></li>
				<li>
					<router-link to="/component/Pagination">Pagination</router-link>
				</li>
				<li>
					<router-link to="/component/Panel">Panel</router-link>
				</li>
				<li>
					<router-link to="/component/ProgressBar">ProgressBar</router-link>
				</li>
				<li><router-link to="/component/Search">Search</router-link></li>
				<li><router-link to="/component/Spinner">Spinner</router-link></li>
				<li><router-link to="/component/Steps">Steps</router-link></li>
				<li><router-link to="/component/Table">Table</router-link></li>
				<li><router-link to="/component/Tabs">Tabs</router-link></li>
				<li><router-link to="/component/Tooltip">Tooltip</router-link></li>
			</nav-group>
		</nav>
		<div class="content" role="main">
			<router-view />
		</div>
	</div>
</template>

<script>
import NavGroup from './docs/NavGroup.vue';

export default {
	components: {
		NavGroup
	},
	data() {
		return {
			openSubmenus: []
		};
	},
	methods: {
		/**
		 * Should submenu be displayed?
		 */
		displaySubmenu(component) {
			return (
				this.openSubmenus.includes(component) || this.pathIncludes(component)
			);
		},

		/**
		 * Does the current route path include this component
		 */
		pathIncludes(component) {
			return this.$route.path.includes('/component/' + component);
		},

		/**
		 * Open/close a submenu in the nav
		 */
		toggleSubmenu(component) {
			if (this.openSubmenus.includes(component)) {
				const i = component.indexOf(component);
				this.openSubmenus.splice(i, 1);
			} else {
				this.openSubmenus.push(component);
			}
		}
	}
};
</script>

<style lang="less">
@import './styles/_import';
@import './styles/_global';

*,
*:before,
*:after {
	box-sizing: border-box;
}

body {
	display: flex;
	margin: 0;
	background: @lift;
	font-family: @font;
	font-size: @font-base;
	line-height: 2rem;
	color: @text-rgba;
}

#app {
	display: grid;
	grid-template-columns: 15rem auto;
	width: 100%;

	.nav {
		grid-column-start: 1;
		padding: 1rem 0.5rem;
	}

	.content {
		grid-column-start: 2;
	}
}

a {
	color: @primary;

	&:hover,
	&:focus {
		color: @primary-lift;
	}

	&[disabled] {
		color: @text-light-rgba;
		cursor: not-allowed;
	}
}

.nav__toggle {
	position: absolute;
	top: 0;
	right: 0;
	display: inline-block;
	background: transparent;
	border: none;
	border-radius: @radius;
	color: @primary;
	font-size: 18px;
	font-weight: @bold;
	padding: 0em 0.25em;
	line-height: 1.5em;
	min-width: 1.5em;
	text-align: center;

	&:focus {
		outline: none;
		box-shadow: 0 0 0 2px @primary;
	}
}

// Code syntax highlighting
[class^='language-'] {
	display: block;
	overflow-x: auto;
	padding: 1rem;
	color: #abb2bf;
	background: #282c34;
	line-height: 1.5em;
	font-size: @font-tiny;
	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;
}

// Styles for main body text
.bodyText {
	margin-bottom: 3rem;
	margin-left: auto;
	margin-right: auto;
	max-width: 50em;
	font-size: @font-sml;
	line-height: 1.7em;

	p {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
	}

	p > code,
	blockquote > code,
	li > code,
	p > kbd,
	blockquote > kbd,
	li > kbd {
		border: 1px solid #d3e9d8;
		background: #f9f9f9;
		border-radius: @radius;
		padding: 0.125em 0.25em;
		color: #009e2b;
		font-size: @font-tiny;
	}

	h2,
	h3,
	h4,
	h5,
	h6 {
		margin-top: 2em;
		margin-bottom: 0.5rem;
	}

	h2 + p,
	h3 + p,
	h4 + p,
	h5 + p,
	h6 + p {
		margin-top: 0;
	}

	table {
		border: @bg-border-light;
		border-bottom: none;
		border-collapse: collapse;
		width: 100%;
		font-size: @font-sml;
		line-height: 1.5em;
	}

	tr {
		border-bottom: @bg-border-light;
	}

	th:not(:last-child),
	td:not(:last-child) {
		border-right: @bg-border-light;
	}

	th,
	td {
		padding: 0.5rem 1rem;
		text-align: left;
		vertical-align: top;
	}

	th {
		font-weight: @bold;
	}

	td code {
		border: 1px solid #d3e9d8;
		background: #f9f9f9;
		border-radius: @radius;
		padding: 0.125em 0.25em;
		color: #3fab5c;
		font-size: @font-tiny;
	}
}
</style>
