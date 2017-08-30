<template>
	<li class="pkpListPanelItem pkpListPanelItem--select pkpListPanelItem--selectSubmission" :class="{'--hasFocus': isFocused}">
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
			{{ __('viewSubmission', {title: item.title}) }}
		</a>
	</li>
</template>

<script>
import SelectListPanelItem from '../SelectListPanelItem.vue';

export default {
	extends: SelectListPanelItem,
	name: 'SelectSubmissionsListItem',
	props: ['i18n'],
};
</script>

<style lang="less">
@import '../../../styles/_config';

.pkpListPanelItem--submission__author {
	font-weight: @bold;
}
</style>
