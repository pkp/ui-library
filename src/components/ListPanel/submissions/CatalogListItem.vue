<template>
	<div class="pkpListPanelItem pkpListPanelItem--submission pkpListPanelItem--catalog -pkpClearfix" :class="{'--hasFocus': isFocused, '-isLoading': isSaving, '-isFeatured': isFeatured}">
		<orderer
			v-if="isOrdering"
			@up="orderUp"
			@down="orderDown"
			:itemId="item.id"
			:itemTitle="item.title"
			:i18n="i18n"
		/>
		<div class="pkpListPanelItem--submission__item pkpListPanelItem--catalog__item">
			<div class="pkpListPanelItem--submission__id">
				<span class="-screenReader">{{ i18n.id }}</span>
				{{ item.id }}
			</div>
			<a :href="item.urlPublished" class="pkpListPanelItem--submission__link">
				<div v-if="item.authorString" class="pkpListPanelItem--submission__author">
					{{ item.authorString }}
				</div>
				<div class="pkpListPanelItem--submission__title" :tabindex="-1">
					{{ localize(item.fullTitle) }}
				</div>
			</a>
			<div class="pkpListPanelItem__actions">
				<pkp-button
					ref="viewEntryButton"
					:label="i18n.editCatalogEntry"
					:isLink="true"
					@click="viewCatalogEntry"
				/>
				<pkp-button
					element="a"
					:href="item.urlWorkflow"
					:label="i18n.viewSubmission"
					:isLink="true"
				/>
			</div>
		</div>
		<button class="pkpListPanelItem--catalog__select" @click.prevent="toggleFeatured">
			<icon v-if="isFeatured" icon="check-square-o" />
			<icon v-else icon="square-o" />
			<span class="-screenReader">
				<template v-if="isFeatured">
					{{ i18n.isFeatured }}
				</template>
				<template v-else>
					{{ i18n.isNotFeatured }}
				</template>
			</span>
		</button>
		<button class="pkpListPanelItem--catalog__select" @click.prevent="toggleNewRelease">
			<icon v-if="isNewRelease" icon="check-square-o" />
			<icon v-else icon="square-o" />
			<span class="-screenReader">
				<template v-if="isNewRelease">
					{{ i18n.isNewRelease }}
				</template>
				<template v-else>
					{{ i18n.isNotNewRelease }}
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
	</div>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import Orderer from '@/components/Orderer/Orderer.vue';

export default {
	extends: ListPanelItem,
	name: 'CatalogListItem',
	props: [
		'csrfToken',
		'item',
		'i18n',
		'filterAssocType',
		'filterAssocId',
		'catalogEntryUrl',
		'isOrdering',
		'apiUrl'
	],
	components: {
		PkpButton,
		Icon,
		Orderer
	},
	data() {
		return {
			isSaving: false
		};
	},
	computed: {
		/**
		 * Map the submission id to the list item id
		 */
		id() {
			return this.item.id;
		},

		/**
		 * Is the submission featured in the current filtered view?
		 * press, category or series
		 *
		 * @return bool
		 */
		isFeatured() {
			if (!this.item.hasOwnProperty('featured')) {
				return false;
			}
			const feature = this.item.featured.find(feature => {
				return (
					feature.assoc_type === this.filterAssocType &&
					feature.assoc_id === this.filterAssocId
				);
			});
			return typeof feature !== 'undefined';
		},

		/**
		 * Is the submission a new release in the current filtered view?
		 * press, category or series
		 *
		 * @return bool
		 */
		isNewRelease() {
			if (!this.item.hasOwnProperty('newRelease')) {
				return false;
			}
			const newRelease = this.item.newRelease.find(newRelease => {
				return (
					newRelease.assoc_type === this.filterAssocType &&
					newRelease.assoc_id === this.filterAssocId
				);
			});
			return typeof newRelease !== 'undefined';
		}
	},
	methods: {
		/**
		 * Toggle the checkbox when clicked
		 */
		toggleFeatured() {
			const isFeatured = this.item.featured.find(feature => {
				return feature.assoc_type === this.filterAssocType;
			});
			if (isFeatured) {
				this.item.featured = this.item.featured.filter(feature => {
					return feature.assoc_type !== this.filterAssocType;
				});
			} else {
				this.item.featured.push({
					assoc_type: this.filterAssocType,
					assoc_id: this.filterAssocId,
					seq: 1
				});
			}
			this.saveDisplayFlags();
		},

		/**
		 * Toggle the checkbox when clicked
		 */
		toggleNewRelease() {
			const matchingNewReleases = this.item.newRelease.find(newRelease => {
				return newRelease.assoc_type === this.filterAssocType;
			});
			const isNewRelease = typeof matchingNewReleases !== 'undefined';
			if (isNewRelease) {
				this.item.newRelease = this.item.newRelease.filter(newRelease => {
					return newRelease.assoc_type !== this.filterAssocType;
				});
			} else {
				this.item.newRelease.push({
					assoc_type: this.filterAssocType,
					assoc_id: this.filterAssocId,
					seq: 1
				});
			}
			this.saveDisplayFlags();
		},

		/**
		 * Post updates to the featured or new release status of a submission
		 */
		saveDisplayFlags() {
			this.isLoading = true;

			const self = this;
			$.ajax({
				url: this.apiUrl + '/saveDisplayFlags',
				type: 'POST',
				headers: {
					'X-Csrf-Token': this.csrfToken
				},
				data: {
					submissionId: this.item.id,
					featured: this.item.featured,
					newRelease: this.item.newRelease
				},
				error: function(r) {
					self.ajaxErrorCallback(r);
				},
				success: function(r) {
					if (typeof r.featured !== 'undefined') {
						self.$emit('update:item', {...self.item, featured: r.featured});
					}
					if (typeof r.newRelease !== 'undefined') {
						self.$emit('update:item', {...self.item, newRelease: r.newRelease});
					}
				},
				complete() {
					self.isLoading = false;
				}
			});
		},

		/**
		 * Launch a modal to view the catalog entry for this item
		 */
		viewCatalogEntry() {
			var opts = {
				title: this.i18n.catalogEntry,
				url: this.catalogEntryUrl.replace('__id__', this.item.id),
				closeCallback: () => this.$refs.viewEntryButton.$el.focus()
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

// Shift padding to the catalog item so that focus indicator
// takes up full height
.pkpListPanelItem--catalog {
	padding: 0;

	.pkpListPanelItem--submission__id {
		top: 1rem;
		left: 1rem;
	}
}

.pkpListPanelItem--catalog__item {
	display: block;
	float: none;
	width: 100%;
	padding: 1rem 17rem 1rem 4rem;

	a {
		text-decoration: none;
	}
}

.pkpListPanelItem--catalog .pkpListPanelItem--submission__author,
.pkpListPanelItem--catalog .pkpListPanelItem--submission__title {
	padding-right: 0;
}

.pkpListPanelItem--catalog__select {
	position: absolute;
	top: 0;
	right: @base * 8;
	bottom: 0;
	width: @base * 8;
	border: 1px solid transparent;
	border-left-color: @grid-border-color;
	background: transparent;

	&:focus {
		outline: 0;
		border-color: @primary;
	}

	+ .pkpListPanelItem--catalog__select {
		right: 0;
	}
}

.pkpListPanelItem__actions .pkpButton--isLink:first-child {
	margin-left: -0.5em;
}

.pkpListPanelItem--catalog {
	.orderer__dragDrop,
	.orderer__up,
	.orderer__down {
		width: 4em;
	}

	.orderer__up {
		right: 4em;
	}
}
</style>
