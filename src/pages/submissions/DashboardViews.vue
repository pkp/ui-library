<template>
	<div class="justify-stretch border-r border-light bg-lightest pt-8">
		<h1 class="mx-4 text-3xl-bold uppercase">
			{{ title }}
		</h1>
		<ul class="mt-8 text-base-normal">
			<li
				v-for="view in views"
				:key="view.id"
				class="border-t border-light last:border-b"
			>
				<button
					class="flex w-full items-center gap-3 px-3 py-4 hover:bg-medium/30 focus-visible:outline focus-visible:outline-primary"
					:class="
						currentView.id === view.id
							? 'bg-primary text-base-bold text-lightest hover:bg-primary'
							: ''
					"
					@click="$emit('loadView', view)"
				>
					<span>
						<Badge :on-dark-background="currentView.id === view.id">
							<span :class="currentView.id === view.id && 'text-base-bold'">
								{{ view.count }}
							</span>
						</Badge>
					</span>
					<span>
						{{ view.name }}
					</span>
				</button>
			</li>
		</ul>
	</div>
</template>
<script setup>
import {defineProps} from 'vue';

import Badge from '@/components/Badge/Badge.vue';

defineProps({
	title: {type: String, required: true},
	views: {type: Array, required: true},
	currentView: {type: Object, required: true},
});

defineEmits(['loadView']);
</script>
