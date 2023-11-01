<template>
	<div class="submissions__views">
		<h1 class="submissions__views__title">
			{{ t('navigation.submissions') }}
		</h1>
		<ul class="submissions__views__list">
			<li
				v-for="view in submissionsStore.views"
				:key="view.id"
				class="submissions__view"
			>
				<button
					class="submissions__view__button"
					:class="
						submissionsStore.currentView.id === view.id
							? 'submissions__view__button--current'
							: ''
					"
					@click="submissionsStore.loadView(view)"
				>
					<span class="submissions__view__count">
						{{ view.count }}
					</span>
					<span class="submissions__view__name">
						{{ view.name }}
					</span>
				</button>
			</li>
		</ul>
	</div>
</template>
<script>
import {mapStores} from 'pinia';
import {useSubmissionsStore} from '@/pages/submissions/submissionsStore';

export default {
	computed: {...mapStores(useSubmissionsStore)},
};
</script>
