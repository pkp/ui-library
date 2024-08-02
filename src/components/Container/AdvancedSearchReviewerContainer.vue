<template>
	<div>
		<div class="section pkpAdvancedSearchReviewerContainer">
			<h3>{{ labels.submissionAuthorList }}</h3>
			<div class="list_outline">
				<ol class="list_box">
					<li
						v-for="(affiliations, author) in displayedItems"
						:key="author"
						class="author_row"
					>
						<strong>{{ author }}</strong>
						<span v-if="affiliations">{{ ' - ' }}</span>
						<span>{{ affiliations }}</span>
					</li>
				</ol>
				<div v-if="authorCount > 4" class="action_container">
					<span
						v-if="!showAllAuthors"
						class="show_authors_action"
						@click="toggleShowAllAuthors"
					>
						{{ `${labels.showAll} ${authorCount} ${labels.authorsLabel}` }}
					</span>
					<span
						v-if="showAllAuthors"
						class="show_authors_action"
						@click="toggleShowAllAuthors"
					>
						{{ labels.showLess }}
					</span>
				</div>
			</div>
		</div>
		<SelectReviewerListPanel v-bind="components.selectReviewer" @set="set" />
	</div>
</template>

<script>
import Container from '@/components/Container/Container.vue';
import SelectReviewerListPanel from '@/components/ListPanel/users/SelectReviewerListPanel.vue';

export default {
	name: 'AdvancedSearchReviewerContainer',
	components: {
		SelectReviewerListPanel,
	},
	extends: Container,
	data() {
		return {
			showAllAuthors: false,
		};
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
	methods: {
		toggleShowAllAuthors() {
			this.showAllAuthors = !this.showAllAuthors;
		},
	},
};
</script>
<style lang="less">
@import '../../styles/_import';

.pkpAdvancedSearchReviewerContainer {
	.action_container {
		padding-left: 1rem;
		padding-bottom: 0.9rem;
	}

	.list_outline {
		border: 1px solid @grid-border-color;
		border-radius: 2px;
		margin-bottom: 1.3rem;
	}

	.list_box {
		padding-left: 1.9rem;
		overflow-y: scroll;
		max-height: 17em;
	}

	.show_authors_action {
		color: @primary;
		text-decoration: none;
		cursor: pointer;
	}
}
</style>
