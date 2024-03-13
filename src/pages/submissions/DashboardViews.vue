<template>
	<div class="border-l border-r border-light">
		<h1 class="mx-4 my-5 text-3xl-bold uppercase">
			{{ title }}
		</h1>
		<ul class="text-base-normal">
			<li v-for="view in views" :key="view.id" class="border-t border-light">
				<PkpButton
					:is-active="currentView.id === view.id"
					:is-secondary="currentView.id !== view.id"
					is-full-width
					@click="$emit('loadView', view)"
				>
					<span>
						<Badge :is-on-dark-background="currentView.id === view.id">
							<span :class="currentView.id === view.id && 'text-base-bold'">
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
		<div class="mx-3 my-6">
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

import {useUrl} from '@/composables/useUrl';

defineProps({
	title: {type: String, required: true},
	views: {type: Array, required: true},
	currentView: {type: Object, required: true},
});

const {pageUrl: newSubmissionUrl} = useUrl('submission');

defineEmits(['loadView']);
</script>
