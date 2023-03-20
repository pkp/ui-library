<template>
	<div class="previewFetch">
		<form class="previewFetch__form">
			<fieldset class="previewFetch__field">
				<legend>Show items in:</legend>
				<label v-for="(name, id) in sections" :key="id">
					<input type="checkbox" v-model="sectionsSelected" :value="id" />
					{{ name }}
				</label>
			</fieldset>
			<div class="previewFetch__field">
				<label>
					Search:
					<input type="search" v-model="searchPhrase" />
				</label>
			</div>
		</form>
		<ul>
			<li v-for="submission in submissions" :key="submission.id">
				{{ sections[submission.sectionId] }}
				—
				{{ submission.publications[0].authorsStringShort }}
				—
				{{ submission.publications[0].fullTitle.en }}
			</li>
		</ul>
	</div>
</template>

<script>
import fetch from '@/mixins/fetch';
import submissions from '../../../data/submissions';

export default {
	mixins: [fetch],
	data() {
		return {
			searchPhrase: '',
			sections: {
				1: 'Articles',
				2: 'Reviews',
			},
			sectionsSelected: [],
			submissions: [...submissions],
		};
	},
	methods: {
		/**
		 * Overwrite the `get()` method of the
		 * fetch mixin to filter the submissions
		 * locally
		 */
		get() {
			const searchPhrase = (
				this.activeFilters.searchPhrase ?? ''
			).toLowerCase();
			const sectionIds = this.activeFilters.sectionIds ?? [];
			this.submissions = [...submissions]
				.filter((s) => {
					return (
						!searchPhrase ||
						s.publications[0].fullTitle.en.toLowerCase().match(searchPhrase) ||
						s.publications[0].authorsStringShort
							.toLowerCase()
							.match(searchPhrase)
					);
				})
				.filter((s) => {
					return !sectionIds.length || sectionIds.includes(s.sectionId);
				});
		},
	},
	watch: {
		searchPhrase(newVal, oldVal) {
			this.activeFilters = {
				...this.activeFilters,
				searchPhrase: newVal,
			};
		},
		sectionsSelected(newVal, oldVal) {
			this.activeFilters = {
				...this.activeFilters,
				sectionIds: newVal.map((id) => parseInt(id, 10)),
			};
		},
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';
</style>
