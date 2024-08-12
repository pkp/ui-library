<template>
	<div
		v-if="Object.keys(links).length"
		ref="containerNav"
		class="nav-section sticky top-12 flex h-screen flex-none"
	>
		<nav
			ref="primaryNav"
			class="w-max overflow-y-auto border-e border-s border-light bg-secondary pl-4 pr-4 pt-4"
			:aria-label="ariaLabel"
		>
			<ul>
				<li>
					<PkpButton
						v-tooltip="addLinkTooltip('Expand Main Menu')"
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
				>
					<PkpButton
						v-tooltip="addLinkTooltip(link.name)"
						element="a"
						:href="link.url"
						:is-active="link.isCurrent"
						:size-variant="collapsed ? 'iconOnly' : 'default'"
						:icon="link.icon"
						:aria-expanded="!!link.isCurrent"
						:aria-controls="link.submenu ? `nav_${key}` : null"
						@click="handleClick(key)"
					>
						{{ link.name }}
					</PkpButton>

					<div
						v-if="link?.submenu"
						v-show="link.isCurrent && showSecondNav"
						:ref="(el) => (secondaryNav[key] = el)"
						class="nav-section secondary-nav absolute top-0 w-60 overflow-y-auto border-e border-light bg-secondary pt-4 leading-6 ltr:right-0 rtl:left-0"
					>
						<div class="mb-10 p-3 font-bold uppercase text-heading">
							<Icon v-if="link.icon" class="h-9 w-9" :icon="link.icon" />
							<div>
								<span>{{ link.name }}</span>
							</div>
						</div>
						<ul :id="`nav_${key}`">
							<li
								v-for="(sLink, sKey) in link.submenu"
								:key="sKey"
								class="mt-1"
								@click="displaySecondNav(link.submenu, sKey)"
							>
								<PkpButton
									element="a"
									class="submenu-item"
									:href="sLink.url"
									:is-active="sLink.isCurrent"
									:icon="sLink.icon"
									size-variant="fullWidth"
								>
									{{ sLink.name }}
								</PkpButton>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, watch} from 'vue';
import {useStorage} from '@vueuse/core';
import PkpButton from '../Button/Button.vue';
import Icon from '../Icon/Icon.vue';

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
const currentLinkKey = ref('');
const modifiedLinks = reactive({...props.links});
const containerNav = ref(null);
const primaryNav = ref(null);
const secondaryNav = reactive({});
const showSecondNav = ref(false);

currentLinkKey.value = Object.keys(modifiedLinks).find((key) => {
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

currentLink.value = modifiedLinks[currentLinkKey.value];

onMounted(async () => {
	await nextTick();
	await document.fonts.ready;

	positionSecondaryNav();
});

function toggleNav() {
	collapsed.value = !collapsed.value;
	positionSecondaryNav();
}

function displaySecondNav(submenu = [], smKey) {
	Object.keys(submenu).forEach((key) => {
		submenu[key].isCurrent = key === smKey;
	});
	positionSecondaryNav();
}

async function positionSecondaryNav() {
	showSecondNav.value = !!currentLink.value?.submenu;
	if (!showSecondNav.value) return;

	await nextTick();

	const containerWidth = `${primaryNav.value?.offsetWidth + secondaryNav[currentLinkKey.value]?.offsetWidth}px`;

	// set the main nav container's height for both
	containerNav.value.style.width = containerWidth;
}

function handleClick(linkKey) {
	Object.keys(modifiedLinks).forEach((key) => {
		modifiedLinks[key].isCurrent = key === linkKey;
	});
	currentLink.value = modifiedLinks[linkKey];
	currentLinkKey.value = linkKey;
	const submenu = modifiedLinks[linkKey]?.submenu || [];
	displaySecondNav(submenu, Object.keys(submenu)[0]);
}

function addLinkTooltip(text) {
	return collapsed.value
		? {content: text, theme: 'pkp-tooltip', placement: 'auto-end'}
		: {};
}

watch(collapsed, () => {
	positionSecondaryNav();
});
</script>

<style lang="less" scoped>
@import '../../styles/_import';

.nav-section {
	height: calc(100vh - 3rem);
}
</style>
