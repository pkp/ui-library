<template>
	<div>
		<div class="section">
			<h3>{{ components.selectReviewer.submissionAuthorList }}</h3>
			<div class="list_outline">
				<ol :class="authorContainerclasses">
					<li
						class="author_row"
						v-for="(affiliations, author) in components.selectReviewer.authors"
						:key="author"
					>
						<strong>{{ author }}</strong>
						<span v-if="affiliations"> - </span>
						<span>{{ affiliations }}</span>
					</li>
				</ol>
				<div class="action_container" v-if="authorCount > 4">
					<span class="show_authors_action" v-if="!showAllAuthors" @click="toggleShowAllAuthors">
						{{
							`${components.selectReviewer.showAll} ${authorCount} ${components.selectReviewer.authorsLabel}`
						}}
					</span>
					<span class="show_authors_action" v-if="showAllAuthors" @click="toggleShowAllAuthors">
						{{ components.selectReviewer.showLess }}
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
		authorContainerclasses() {
			let statics = 'list_box pkpFormField__description';
			return this.showAllAuthors ? statics : `${statics} expandable`;
		},
		authorCount() {
			return Object.keys(this.components.selectReviewer.authors).length;
		},
	},
};
</script>
<style lang="less">
@import '../../styles/_import';

.action_container {
	padding: 0.9rem 1.2rem;
}

.list_box {
	margin-bottom: 0;
	&.expandable {
		max-height: 6rem;
		overflow-y: scroll;
	}
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
</style>
