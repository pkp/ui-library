<template>
	<li class="pkpListPanelItem pkpListPanelItem--select pkpListPanelItem--selectSubmission -clearFix" :class="{'-hasFocus': isFocused}">
		<div class="pkpListPanelItem__selectItem" @click.self="toggle">
			<input
				type="checkbox"
				:id="inputId"
				:name="inputName"
				:value="inputValue"
				v-model="isSelected"
				@change="toggle"
				@focus="focusItem"
				@blur="blurItem"
			/>
		</div>
		<label :for="inputId" class="pkpListPanelItem__item">
			<div v-if="item.authorString" class="pkpListPanelItem--submission__author">
				{{ item.authorString }}
			</div>
			<div class="pkpListPanelItem--submission__title">
				{{ localize(item.fullTitle) }}
			</div>
		</label>
		<a :href="item.urlWorkflow" class="pkpListPanelItem--submission__link" target="_blank" @focus="focusItem" @blur="blurItem">
			<icon icon="external-link-square" />
			<span class="-screenReader">{{ __('viewSubmission', {title: item.title}) }}</span>
		</a>
	</li>
</template>

<script>
import SelectListPanelItem from '@/components/SelectListPanel/SelectListPanelItem.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	extends: SelectListPanelItem,
	name: 'SelectSubmissionsListItem',
	components: {
		Icon
	},
	props: ['i18n']
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpListPanelItem--selectSubmission {
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
