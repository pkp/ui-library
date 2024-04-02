<template>
	<div class="">
		<div class="px-4 py-8 text-heading">
			<Icon :icon="icon" class="h-8 w-8"></Icon>
			<h1 class="mt-1 text-3xl-bold uppercase">
				{{ title }}
			</h1>
		</div>
		<ul class="text-base-normal">
			<li v-for="view in views" :key="view.id" class="border-t border-light">
				<PkpButton
					:is-active="currentView.id === view.id"
					:is-secondary="currentView.id !== view.id"
					size-variant="fullWidth"
					@click="$emit('loadView', view)"
				>
					<span>
						<Badge
							:color-variant="
								currentView.id === view.id ? 'default-on-dark' : 'primary'
							"
						>
							<span>
								{{ view.count }}
							</span>
						</Badge>
					</span>
					<span class="ms-1">
						{{ view.name }}
					</span>
				</PkpButton>
			</li>
		</ul>
		<div v-if="dashboardPage !== 'MY_REVIEW_ASSIGNMENTS'" class="mx-3 my-6">
			<PkpButton is-primary element="a" :href="newSubmissionUrl">
				Start A New Submission
			</PkpButton>
		</div>
	</div>
</template>
<script setup>
import {defineProps} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import Badge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';

import {useUrl} from '@/composables/useUrl';

defineProps({
	title: {type: String, required: true},
	icon: {type: String, required: true},
	dashboardPage: {type: String, required: true},
	views: {type: Array, required: true},
	currentView: {type: Object, required: true},
});

const {pageUrl: newSubmissionUrl} = useUrl('submission');

defineEmits(['loadView']);
</script>
