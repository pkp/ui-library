<template>
	<li class="pkpListPanelItem pkpListPanelItem--select pkpListPanelItem--selectSubmission" :class="{'-hasFocus': isFocused}">
		<div class="pkpListPanelItem__selectItem" @click.prevent="toggleSelection">
			<input type="checkbox" :id="inputId" :name="inputName" :value="inputValue" v-model="selected" @click.stop @focus="focusItem" @blur="blurItem">
		</div>
		<label :for="inputId" class="pkpListPanelItem__item">
			<div v-if="item.author" class="pkpListPanelItem--submission__author">
				{{ item.author.authorString }}
			</div>
			<div class="pkpListPanelItem--submission__title">
				{{ item.title }}
			</div>
		</label>
		<a :href="item.urlWorkflow" class="pkpListPanelItem--submission__link" target="_blank" @focus="focusItem" @blur="blurItem">
			<span class="fa fa-external-link-square" aria-hidden="true"></span>
			<span class="-screenReader">{{ __('viewSubmission', {title: item.title}) }}</span>
		</a>
	</li>
</template>

<script>
import SelectListPanelItem from '@/components/SelectListPanel/SelectListPanelItem.vue';

export default {
	extends: SelectListPanelItem,
	name: 'SelectSubmissionsListItem',
	props: ['i18n'],
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpListPanelItem--select {

	.pkpListPanelItem--submission__author {
		font-weight: @bold;
	}

	.pkpListPanelItem--submission__link {
		position: absolute;
		top: 0;
		right: 0;
		width: 4rem;
		height: 100%;
		border-left: @grid-border;

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
}
</style>
