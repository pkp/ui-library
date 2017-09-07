<template>
	<li class="pkpListPanelItem pkpListPanelItem--submission pkpListPanelItem--catalog" :class="{'--hasFocus': isFocused, '-isLoading': isSaving, '-isFeatured': isFeatured}">
		<list-panel-item-orderer
			v-if="isOrdering"
			@itemOrderUp="itemOrderUp"
			@itemOrderDown="itemOrderDown"
			:itemTitle="item.title"
			:i18n="i18n"
		/>
		<div class="pkpListPanelItem--submission__item pkpListPanelItem--catalog__item">
			<div class="pkpListPanelItem--submission__id">
				<span class="-screenReader">{{ i18n.id }}</span>
				{{ item.id }}
			</div>
			<a :href="item.urlPublished" @focus="focusItem" @blur="blurItem" class="pkpListPanelItem--submission__link">
				<div v-if="item.author" class="pkpListPanelItem--submission__author">
					{{ item.author.authorString }}
				</div>
				<div class="pkpListPanelItem--submission__title">
					{{ item.title }}
				</div>
			</a>
			<div class="pkpListPanelItem__actions">
				<button @click.prevent="viewCatalogEntry" @focus="focusItem" @blur="blurItem">
					{{ i18n.editCatalogEntry }}
				</button>
				<a :href="item.urlWorkflow" @focus="focusItem" @blur="blurItem">
					{{ i18n.viewSubmission }}
				</a>
			</div>
		</div>
		<button class="pkpListPanelItem__selectItem pkpListPanelItem__selectItem--catalog" @click.prevent="toggleFeatured" @focus="focusItem" @blur="blurItem">
			<span v-if="isFeatured" class="fa fa-check-square-o"></span>
			<span v-else class="fa fa-square-o"></span>
			<span class="-screenReader">
				<template v-if="isFeatured">
					This monograph is featured. Make this monograph not featured.
				</template>
				<template v-else>
					This monograph is not featured. Make this monograph featured.
				</template>
			</span>
		</button>
		<button class="pkpListPanelItem__selectItem pkpListPanelItem__selectItem--catalog" @click.prevent="toggleNewRelease" @focus="focusItem" @blur="blurItem">
			<span v-if="isNewRelease" class="fa fa-check-square-o"></span>
			<span v-else class="fa fa-square-o"></span>
			<span class="-screenReader">
				<template v-if="isNewRelease">
					This monograph is a new release. Make this monograph not a new release.
				</template>
				<template v-else>
					This monograph is not a new release. Make this monograph a new release.
				</template>
			</span>
		</button>
		<div class="pkpListPanelItem__mask" :class="{'--active': isSaving}">
			<div class="pkpListPanelItem__maskLabel">
				<span class="pkpListPanelItem__maskLabel_loading">
					<span class="pkp_spinner"></span>
					{{ i18n.saving }}
				</span>
			</div>
		</div>
	</li>
</template>

<script>
import SubmissionsListItem from '@/components/ListPanel/submissions/SubmissionsListItem.vue';
import ListPanelItemOrderer from '@/components/ListPanel/ListPanelItemOrderer.vue';

export default {
	extends: SubmissionsListItem,
	name: 'CatalogSubmissionsListItem',
	props: ['item', 'i18n', 'filterAssocType', 'filterAssocId', 'catalogEntryUrl', 'isOrdering', 'apiPath'],
	components: {
		ListPanelItemOrderer,
	},
	data: function () {
		return {
			isSaving: false,
		};
	},
	computed: {
		/**
		 * Map the submission id to the list item id
		 */
		id: function () {
			return this.item.id;
		},

		/**
		 * Is the submission featured in the current filtered view?
		 * press, category or series
		 *
		 * @return bool
		 */
		isFeatured: function () {
			if (!this.item.hasOwnProperty('featured')) {
				return false;
			}
			const feature = this.item.featured.find((feature) => {
				return feature.assoc_type === this.filterAssocType && feature.assoc_id === this.filterAssocId;
			});
			return typeof feature !== 'undefined';
		},

		/**
		 * Is the submission a new release in the current filtered view?
		 * press, category or series
		 *
		 * @return bool
		 */
		isNewRelease: function () {
			if (!this.item.hasOwnProperty('newRelease')) {
				return false;
			}
			const newRelease = this.item.newRelease.find((newRelease) => {
				return newRelease.assoc_type === this.filterAssocType && newRelease.assoc_id === this.filterAssocId;
			});
			return typeof newRelease !== 'undefined';
		},
	},
	methods: {
		/**
		 * Toggle the checkbox when clicked
		 */
		toggleFeatured: function () {
			const isFeatured = this.item.featured.find((feature) => {
				return feature.assoc_type === this.filterAssocType;
			});
			if (isFeatured) {
				this.item.featured = this.item.featured.filter((feature) => {
					return feature.assoc_type !== this.filterAssocType;
				});
			} else {
				this.item.featured.push({
					assoc_type: this.filterAssocType,
					assoc_id: this.filterAssocId,
					seq: 1,
				});
			}
			this.saveDisplayFlags();
		},

		/**
		 * Toggle the checkbox when clicked
		 */
		toggleNewRelease: function () {
			const isNewRelease = this.item.newRelease.find((newRelease) => {
				return newRelease.assoc_type === this.filterAssocType;
			});
			if (isNewRelease) {
				this.item.newRelease = this.item.newRelease.filter((newRelease) => {
					return newRelease.assoc_type !== this.filterAssocType;
				});
			} else {
				this.item.newRelease.push({
					assoc_type: this.filterAssocType,
					assoc_id: this.filterAssocId,
					seq: 1,
				});
			}
			this.saveDisplayFlags();
		},

		/**
		 * Post updates to the featured or new release status of a submission
		 */
		saveDisplayFlags: function () {

			this.isLoading = true;

			var self = this;
			$.ajax({
				url: this.getApiUrl(this.apiPath + '/' + 'saveDisplayFlags'),
				type: 'POST',
				data: {
					submissionId: this.item.id,
					featured: this.item.featured,
					newRelease: this.item.newRelease,
					csrfToken: $.pkp.currentUser.csrfToken,
				},
				error: function (r) {
					self.ajaxErrorCallback(r);
				},
				success: function (r) {
					if (typeof r.featured !== 'undefined') {
						self.item.featured = r.featured;
						self.$emit('catalogFeatureUpdated', self.submission);
					}
					if (typeof r.newRelease !== 'undefined') {
						self.item.newRelease = r.newRelease;
					}
				},
				complete: function (r) {
					self.isLoading = false;
				},
			});
		},

		/**
		 * Launch a modal to view the catalog entry for this item
		 */
		viewCatalogEntry: function () {

			var opts = {
				title: this.i18n.catalogEntry,
				url: this.catalogEntryUrl.replace('__id__', this.item.id),
			};

			$('<div id="' + $.pkp.classes.Helper.uuid() + '" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>')
				.pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpListPanelItem--catalog__item {
	display: block;
	float: none;
	width: 100%;
	padding-right: @base * 17;

	a {
			text-decoration: none;
	}
}

.pkpListPanelItem__selectItem--catalog {
		left: auto;
		right: @base * 8;
		width: @base * 8;
		border-right: none;
		border-left: @grid-border;
		cursor: pointer;

		+ .pkpListPanelItem__selectItem--catalog {
				right: 0;
		}
}


</style>
