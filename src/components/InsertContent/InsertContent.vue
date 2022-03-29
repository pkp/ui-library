<template>
	<div class="insertContent">
		<search
			:searchLabel="searchLabel"
			:searchPhrase="searchPhrase"
			@search-phrase-changed="newVal => (this.searchPhrase = newVal)"
		/>
		<ol class="insertContent__items" :aria-label="itemsLabel">
			<li
				v-for="item in current"
				:key="item.key"
				class="insertContent__item"
				:id="'insert-content-' + item.key"
			>
				<div class="insertContent__item__header">
					<div class="insertContent__item__value">
						{{ item.value }}
					</div>
					<pkp-button
						class="insertContent__item__button"
						:aria-describedby="'insert-content-' + item.key"
						@click="$emit('insert', item.value)"
					>
						{{ insertLabel }}
					</pkp-button>
				</div>
				<div class="insertContent__item__description">
					{{ item.description }}
				</div>
			</li>
		</ol>
	</div>
</template>

<script>
import Search from '@/components/Search/Search.vue';

export default {
	name: 'InsertContent',
	components: {
		Search
	},
	props: {
		/**
		 * The insert button label
		 */
		insertLabel: {
			type: String,
			required: true
		},

		/**
		 * An array of prepared content values
		 *
		 * Example:
		 *
		 * [
		 * 	{
		 *    key: 'journalName',
		 *    value: 'Journal of Public Knowledge',
		 *    description: 'The name of the journal'
		 *   }
		 * ]
		 */
		items: {
			type: Array,
			default() {
				return [];
			}
		},

		/**
		 * Accessible label for the items list
		 */
		itemsLabel: {
			type: String,
			required: true
		},

		/**
		 * Accessible label for the search input
		 */
		searchLabel: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {
			searchPhrase: ''
		};
	},
	computed: {
		/**
		 * A list of prepared content that matches the search phrase
		 *
		 * @returns {Array}
		 */
		current() {
			if (!this.searchPhrase) {
				return this.items;
			}
			const regex = new RegExp(this.searchPhrase, 'i');
			return this.items.filter(item => {
				return (
					regex.test(item.key) ||
					regex.test(item.value) ||
					regex.test(item.description)
				);
			});
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.insertContent__items {
	margin: 1rem 0 0;
	padding: 0;
	list-style: none;
}

.insertContent__item {
	padding: 0.5rem;
	border: @bg-border-light;
	border-radius: @radius;

	+ .insertContent__item {
		margin-top: 0.25rem;
	}
}

.insertContent__item__header {
	display: flex;
	align-items: center;
}

.insertContent__item__value {
	font-weight: @bold;
	padding-right: 1rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.insertContent__item__button {
	margin-left: auto;
	flex-shrink: 0;
}
</style>
