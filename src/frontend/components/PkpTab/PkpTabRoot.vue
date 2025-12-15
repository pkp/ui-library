<template>
	<BaseTabRoot v-bind="$attrs">
		<slot />
	</BaseTabRoot>
</template>

<script setup>
import BaseTabRoot from './base/BaseTabRoot.vue';
</script>

<style>
/**
 * @file styles/objects/article_details.less
 *
 * Copyright (c) 2014-2021 Simon Fraser University
 * Copyright (c) 2003-2021 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @brief Styles applying to a view of an article with all details
 * @link templates/frontend/objects/article_details.tpl
 */

/* CSS Variables for Tab Styling */
:root {
	--tab-text-color: #333333;
	--tab-text-color-inactive: #666666;
	--tab-active-color: #0066cc;
	--tab-border-color: #e0e0e0;
	--tab-font-size: 16px;
	--tab-padding: 12px 20px 12px 0;
	--tab-gap: 30px;
}

/* Article Tabs Container */
.article-tabs {
	margin-top: 40px;

	/* Root container - wraps everything */
	.BaseTabRoot {
		display: block;

		/* Tab List (mislabeled as BaseTabRoot in BaseTabList.vue) */
		.BaseTabRoot {
			display: flex;
			flex-direction: row;
			gap: var(--tab-gap);
			border-bottom: 1px solid var(--tab-border-color);
			margin-bottom: 30px;
			padding-bottom: 0;
		}
	}
}

/* Tab Trigger - the clickable tab buttons */
.BaseTabTrigger {
	background: none;
	border: none;
	color: var(--tab-text-color-inactive);
	cursor: pointer;
	font-size: var(--tab-font-size);
	font-weight: 400;
	padding: var(--tab-padding);
	position: relative;
	transition: color 0.2s ease;
	display: inline-block;

	&:hover {
		color: var(--tab-text-color);
	}

	&:focus-visible {
		outline: 2px solid var(--tab-active-color);
		outline-offset: 2px;
		border-radius: 2px;
	}

	/* Active tab state */
	&[data-state='active'] {
		color: var(--tab-text-color);
		font-weight: 700;

		&::after {
			content: '';
			position: absolute;
			bottom: -1px;
			left: 0;
			right: 20px;
			height: 3px;
			background-color: var(--tab-active-color);
		}
	}
}

/* Tab Content - the content panels */
.BaseTabContent {
	display: block;

	&[data-state='inactive'] {
		display: none;
	}
}

/* =========================
   AUTHORS HEADER SECTION (below title)
   ========================= */

/* Authors section below title */
.x-authors_section {
	margin: 20px 0;
	font-size: 16px;
	line-height: 1.6;
}

/* Authors list - inline for header */
.x-authors_section .x-authors {
	list-style: none;
	padding: 0;
	margin: 0;
	display: inline;
}

.x-authors_section .x-author {
	display: inline;

	.x-author__separator {
		display: inline;
		margin-right: 4px;
	}
}

/* Author name in header */
.x-authors_section .x-author_full-name {
	display: inline;
	font-size: inherit;
	font-weight: 400;
	color: var(--tab-text-color);
}

/* ORCID icon in header */
.x-authors_section .x-author_orcid {
	display: inline;
	margin-left: 4px;

	a {
		color: var(--tab-active-color);
		text-decoration: none;
		vertical-align: middle;

		&:hover {
			text-decoration: underline;
		}
	}

	img,
	svg {
		width: 16px;
		height: 16px;
		vertical-align: middle;
	}
}

/* =========================
   AUTHORS TAB SECTION
   ========================= */

/* Authors list in tab - card layout */
.BaseTabContent .x-authors {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 30px;
}

.BaseTabContent .x-author {
	display: block;
	border: 1px solid var(--tab-border-color);
	border-radius: 8px;
	padding: 24px;
	background: #ffffff;

	/* Hide separator in tab view */
	.x-author__separator {
		display: none;
	}
}

/* Author name in tab */
.BaseTabContent .x-author_full-name {
	display: block;
	font-size: 24px;
	font-weight: 600;
	color: var(--tab-text-color);
	margin-bottom: 16px;
}

/* Author affiliations in tab */
.BaseTabContent .x-author_affiliations {
	color: #666666;
	font-size: 16px;
	line-height: 1.6;
	margin-bottom: 20px;
}

/* Author user group in tab */
.BaseTabContent .x-author_user-group {
	display: block;
	color: #666666;
	font-size: 14px;
	margin-bottom: 16px;
}

/* ORCID in tab */
.BaseTabContent .x-author_orcid {
	display: block;
	margin-bottom: 20px;

	a {
		color: var(--tab-active-color);
		text-decoration: none;
		font-size: 15px;

		&:hover {
			text-decoration: underline;
		}
	}
}

/* Credit roles in tab */
.BaseTabContent .x-author_credit-roles {
	margin-top: 20px;
	padding-top: 20px;
	border-top: 1px solid var(--tab-border-color);

	.x-author_credit-role {
		color: #666666;
		font-size: 15px;
		line-height: 1.6;
	}
}
</style>
