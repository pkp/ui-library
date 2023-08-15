<template>
	<div>
		<div class="section pkpAdvancedSearchReviewerContainer">
			<h3>{{ labels.submissionAuthorList }}</h3>
			<div class="list_outline">
				<ol>
					<li
						class="author_row"
						v-for="(affiliations, author) in displayedItems"
						:key="author"
					>
						<strong>{{ author }}</strong>
						<span v-if="affiliations"> - </span>
						<span>{{ affiliations }}</span>
					</li>
				</ol>
				<div class="action_container" v-if="authorCount > 4">
					<span
						class="show_authors_action"
						v-if="!showAllAuthors"
						@click="toggleShowAllAuthors"
					>
						{{ `${labels.showAll} ${authorCount} ${labels.authorsLabel}` }}
					</span>
					<span
						class="show_authors_action"
						v-if="showAllAuthors"
						@click="toggleShowAllAuthors"
					>
						{{ labels.showLess }}
					</span>
				</div>
			</div>
		</div>
		<select-reviewer-list-panel v-bind="components.selectReviewer" />
	</div>
</template>

<script>
import SelectReviewerListPanel from '@/components/ListPanel/users/SelectReviewerListPanel.vue';

export default {
	name: 'AdvancedSearchReviewerContainer',
	components: {
		SelectReviewerListPanel,
	},
	data() {
		return {
			showAllAuthors: false,
		};
	},
	methods: {
		toggleShowAllAuthors() {
			this.showAllAuthors = !this.showAllAuthors;
		},
	},
	computed: {
		displayedItems() {
			if (this.showAllAuthors) {
				return this.authors;
			}

			let firstAuthors = Object.keys(this.authors)
				.slice(0, 4)
				.reduce((acc, key) => {
					acc[key] = this.authors[key];
					return acc;
				}, {});

			return firstAuthors;
		},
		authorCount() {
			return Object.keys(this.authors).length;
		},
	},
};
</script>
<style lang="less">
@import '../../styles/_import';

.pkpAdvancedSearchReviewerContainer {
	.action_container {
		padding-left: 1.2rem;
		padding-bottom: 0.9rem;
	}

	.list_outline {
		border: 1px solid @bg-border-color-light;
		border-radius: 2px;
		margin-bottom: 1.3rem;
	}

	.show_authors_action {
		color: @primary;
		text-decoration: none;
		cursor: pointer;
	}
}
</style>
