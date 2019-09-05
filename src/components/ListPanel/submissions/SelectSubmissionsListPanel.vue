<template>
	<fieldset class="pkpListPanel--selectSubmissions" :class="classes">
		<!-- Header -->
		<pkp-header>
			<legend>{{ title }}</legend>
			<spinner v-if="isLoading" />
			<template slot="actions">
				<search
					:searchPhrase="searchPhrase"
					:searchLabel="i18n.search"
					:clearSearchLabel="i18n.clearSearch"
					@search-phrase-changed="setSearchPhrase"
				/>
			</template>
		</pkp-header>

		<!-- Content -->
		<div class="pkpListPanel__body">
			<div class="pkpListPanel__content" aria-live="polite">
				<!-- Optional selectAll button -->
				<label
					v-if="canSelectAll"
					class="pkpListPanel__selectAll"
					@click="toggleSelectAll"
				>
					<input type="checkbox" v-model="isSelectAllOn" />
					<span class="pkpListPanel__selectAllLabel">
						{{ i18n.selectAllLabel }}
					</span>
				</label>

				<!-- Items -->
				<template v-if="items.length">
					<div
						v-for="item in itemsPlucked"
						:key="item.id"
						class="pkpListPanel--selectSubmissions__submissionWrapper"
					>
						<list-panel-item
							:item="item"
							:canSelect="canSelect"
							:selected="selected"
							:selectorName="selectorName"
							:selectorType="selectorType"
							@update:selected="updateSelected"
						/>
						<a
							:href="item.urlWorkflow"
							class="pkpListPanel--selectSubmissions__link"
							target="_blank"
						>
							<icon icon="external-link-square" />
							<span class="-screenReader">
								{{ __('viewSubmission', {title: item.title}) }}
							</span>
						</a>
					</div>
				</template>

				<!-- Loading indicator when loading and no items exist -->
				<div v-else-if="isLoading" class="pkpListPanel__empty">
					<spinner />
					{{ i18n.loading }}
				</div>

				<!-- Indicator when no items exist -->
				<div v-else class="pkpListPanel__empty">
					{{ i18n.empty }}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div v-if="lastPage > 1" class="pkpListPanel__footer">
			<pagination
				:currentPage="currentPage"
				:isLoading="isLoading"
				:lastPage="lastPage"
				:i18n="i18n"
				@set-page="setPage"
			/>
		</div>
	</fieldset>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import Search from '@/components/Search/Search.vue';
import SubmissionsListListeners from '@/mixins/ListPanel/submissions/listeners.js';

export default {
	extends: ListPanel,
	name: 'SelectSubmissionsListPanel',
	mixins: [SubmissionsListListeners],
	components: {
		Icon,
		Pagination,
		Search
	},
	props: {
		i18n: {
			type: Object,
			required: true
		}
	},
	computed: {
		/**
		 * Convert objects in the items array for passing to a ListPanelItem
		 *
		 * @return {Array}
		 */
		itemsPlucked() {
			return this.items.map(item => {
				const currentPublication = item.publications.find(
					publication => publication.id === item.currentPublicationId
				);
				return {
					id: item.id,
					title: [
						currentPublication.authorsStringShort,
						this.localize(currentPublication.fullTitle)
					].join(this.__('listSeparator')),
					urlWorkflow: item.urlWorkflow
				};
			});
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpListPanel--selectSubmissions__submissionWrapper {
	position: relative;
}

.pkpListPanel--selectSubmissions .pkpListPanelItem {
	padding-right: 4rem;
}

.pkpListPanel--selectSubmissions__link {
	position: absolute;
	top: 0;
	right: 0;
	width: 4rem;
	height: 100%;
	border-left: @grid-border;

	&:focus {
		outline: 0;
		box-shadow: inset 0 0 0 1px;
	}

	.fa {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: @text-light;
		text-indent: 0;
	}

	&:hover .fa,
	&:focus .fa {
		color: @primary;
	}
}
</style>
