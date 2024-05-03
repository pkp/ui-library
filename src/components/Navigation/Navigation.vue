<template>
	<div v-if="Object.keys(links).length" class="flex h-screen">
		<nav
			class="w-max border-e border-s border-light pl-4 pr-4 pt-4"
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
					v-for="(link, key) in links"
					:key="key"
					:class="link.addMargin ? 'mt-8' : 'mt-2'"
					@click="handleClick(key)"
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
			v-if="currentLink?.submenu"
			class="w-60 border-e border-light pt-4 leading-6"
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
import {defineProps, ref, reactive} from 'vue';
import {useStorage} from '@vueuse/core';

const props = defineProps({
	links: {
		type: Object,
		required: true,
		validator: (value) => {
			return Object.keys(value).every((key) => 'name' in value[key]);
		},
	},
	ariaLabel: {
		type: String,
		default: 'Site Navigation',
	},
});

const collapsed = useStorage('nav-collapsed', false);
const currentLink = ref({});
const modifiedLinks = reactive({...props.links});

const currentLinkKey = Object.keys(modifiedLinks).find((key) => {
	const smCurrentLink = modifiedLinks[key]?.submenu || {};
	const activeSubmenuLink = Object.keys(smCurrentLink).find(
		(smKey) => smCurrentLink[smKey]?.isCurrent,
	);

	// if secondary (submenu) links have the isCurrent set to true,
	// then also set the isCurrent to true for its parent from primary links
	if (activeSubmenuLink) {
		modifiedLinks[key].isCurrent = true;
	}

	return modifiedLinks[key]?.isCurrent;
});

currentLink.value = modifiedLinks[currentLinkKey];

function toggleNav() {
	collapsed.value = !collapsed.value;
}

function handleSecondNav(submenu = [], smKey) {
	Object.keys(submenu).forEach((key) => {
		submenu[key].isCurrent = key === smKey;
	});
}

function handleClick(linkKey) {
	Object.keys(modifiedLinks).forEach((key) => {
		modifiedLinks[key].isCurrent = key === linkKey;
	});
	currentLink.value = modifiedLinks[linkKey];
	const submenu = modifiedLinks[linkKey]?.submenu || [];
	handleSecondNav(submenu, Object.keys(submenu)[0]);
}
</script>
