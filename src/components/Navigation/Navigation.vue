<template>
	<div class="flex h-screen">
		<nav
			class="border-l border-r border-light pl-4 pr-4 pt-4"
			:aria-label="ariaLabel"
		>
			<ul>
				<li>
					<PkpButton
						:size-variant="collapsed ? 'iconOnly' : 'default'"
						:icon="collapsed ? 'Expand' : 'BackButton'"
						@click="toggleNav"
					>
						{{ collapsed ? 'Expand Main Menu' : 'Collapse Main Menu' }}
					</PkpButton>
				</li>
				<li
					v-for="(link, index) in links"
					:key="index"
					:class="link.addMargin ? 'mt-8' : 'mt-2'"
					@click="handleClick(index)"
				>
					<PkpButton
						element="a"
						:href="link.url"
						:is-active="link.isCurrent"
						:size-variant="collapsed ? 'iconOnly' : 'default'"
						:icon="link.icon"
					>
						{{ link.name }}
					</PkpButton>
				</li>
			</ul>
		</nav>
		<nav
			v-if="currentLink.submenu && !collapsed"
			class="w-60 border-r border-light pt-4 leading-6"
			:aria-label="currentLink.name"
		>
			<div class="mb-10 p-3 font-bold uppercase text-heading">
				<Icon
					v-if="currentLink.icon"
					class="h-9 w-9"
					:icon="currentLink.icon"
				/>
				<div>
					<span>{{ currentLink.name }}</span>
				</div>
			</div>
			<ul>
				<li
					v-for="(link, key) in currentLink.submenu"
					:key="key"
					@click="handleSecondNav(currentLink.submenu, key)"
				>
					<PkpButton
						element="a"
						:href="link.url"
						:is-active="link.isCurrent"
						:icon="link.icon"
						size-variant="fullWidth"
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
const currentLink = ref({});

function toggleNav() {
	collapsed.value = !collapsed.value;
}

function handleSecondNav(submenu = [], smKey) {
	Object.keys(submenu).forEach((key) => {
		submenu[key].isCurrent = key === smKey;
	});
}

function handleClick(index) {
	props.links.forEach((link, i) => {
		link.isCurrent = i === index;
	});
	currentLink.value = props.links[index];
	const submenu = props.links[index]?.submenu || [];
	handleSecondNav(submenu, Object.keys(submenu)[0]);
}
</script>
