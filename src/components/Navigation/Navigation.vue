<template>
	<div class="flex h-screen">
		<nav
			class="text-xs border-l border-r border-light pl-4 pr-4 pt-4 leading-6"
			:aria-label="ariaLabel"
		>
			<ul>
				<li>
					<PkpButton
						:size-variant="collapsed ? 'default' : 'iconOnly'"
						:icon="collapsed ? 'BackButton' : 'Expand'"
						:inline="true"
						@click="toggleNav"
					>
						Collapse Main Menu
					</PkpButton>
				</li>
				<li
					v-for="(link, index) in links"
					:key="index"
					class="mt-2"
					:class="link.addMargin ? 'mt-8' : ''"
					@click="handleClick(index)"
				>
					<PkpButton
						element="a"
						:href="link.url"
						:is-active="link.isCurrent"
						:is-secondary="!link.isCurrent"
						:size-variant="collapsed ? 'default' : 'iconOnly'"
						:icon="link.icon"
						:inline-icon="true"
					>
						{{ link.name }}
					</PkpButton>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script setup>
import {defineProps, ref} from 'vue';

const props = defineProps({
	links: {
		type: Array,
		required: true,
		validator: (value) => {
			return value.every((item) => 'name' in item);
		},
	},
	ariaLabel: {
		type: String,
		default: 'Site Navigation',
	},
});

const collapsed = ref(false);

function toggleNav() {
	collapsed.value = !collapsed.value;
}

function handleClick(index) {
	props.links.forEach((link, i) => {
		link.isCurrent = i === index;
	});
}
</script>
