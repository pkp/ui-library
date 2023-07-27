<template>
	<div>
		<div class="section" id="author_container">
			<h3>{{ components.selectReviewer.submissionAuthorList }}</h3>
			<div :class="authorContainerclasses">
				<div
					class="author_row"
					v-for="(affiliations, author) in components.selectReviewer.authors"
					:key="author"
				>
					<span>{{ author }}</span>
					<span v-if="affiliations"> - </span>
					<span>{{ affiliations }}</span>
				</div>
			</div>
			<div v-if="Object.keys(components.selectReviewer.authors).length > 4">
				<button
					v-if="!showAllAuthors"
					@click="toggleShowAllAuthors"
					class="pkpButton pkp_helpers_align_right"
				>
					{{ components.selectReviewer.showMore }}
				</button>
				<button
					v-if="showAllAuthors"
					@click="toggleShowAllAuthors"
					class="pkpButton pkp_helpers_align_right"
				>
					{{ components.selectReviewer.showLess }}
				</button>
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
			let statics = 'pkp_list_box pkpFormField__description';
			return this.showAllAuthors ? statics : `${statics} expandable`;
		}
	}
};
</script>
