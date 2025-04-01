import {onUnmounted} from 'vue';
import Page from './Page.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import SideNav from '@/components/SideNav/SideNav.vue';
import TopNavActions from '@/components/TopNavActions/TopNavActions.vue';
import InitialsAvatar from '@/components/InitialsAvatar/InitialsAvatar.vue';
import PageMock from '@/mocks/page';

export default {
	title: 'Pages/Page',
	component: Page,
};

export const Default = {
	render: (args) => ({
		components: {Page, Dropdown, SideNav, InitialsAvatar, TopNavActions},
		setup() {
			window.pkp.currentUser.isUserLoggedInAs = true;
			window.pkp.currentUser.loggedInAsUser = {
				username: 'admin',
				initials: 'AA',
			};

			onUnmounted(() => {
				window.pkp.currentUser.isUserLoggedInAs = false;
				window.pkp.currentUser.loggedInAsUser = undefined;
			});
			return args;
		},
		template: `
			<div class="app">
				<header class="app__header" role="banner">
					<Dropdown v-if="contexts.length" class="app__headerAction app__contexts">
						<template #button>
							<Icon icon="Sitemap" class="h-7 w-7" />
							<span class="-screenReader">Journals</span>
						</template>
						<ul>
							<li v-for="context in contexts" :key="context.id">
								<a :href="context.url" class="pkpDropdown__action">
									{{ context.title }}
								</a>
							</li>
						</ul>
					</Dropdown>
					<div class="app__contextTitle">Journal of Public Knowledge</div>
					<TopNavActions></TopNavActions>
				</header>

				<div class="app__body">
					<SideNav :links="menu" aria-label="Site Navigation">
					</SideNav>
					<main class="app__main">
						<div class="app__page">
							<nav
								class="app__breadcrumbs"
								role="navigation"
								aria-label="You are here:"
							>
								<ol>
									<li
										v-for="(breadcrumb, index) in breadcrumbs"
										:key="breadcrumb.name"
									>
										<template v-if="index === breadcrumbs.length - 1">
											<span aria-current="page">{{ breadcrumb.name }}</span>
										</template>
										<template v-else>
											<a :href="breadcrumb.url">
												{{ breadcrumb.name }}
											</a>
											<span class="app__breadcrumbsSeparator">/</span>
										</template>
									</li>
								</ol>
							</nav>
							<div class="page__content">
								<h1 class="app__pageHeading">Page Title Here</h1>
								<div class="app__contentPanel">
									<div style="min-height: 50rem"></div>
								</div>
							</div>
						</div>
					</main>
				</div>
				<div
					ref="notifications"
					aria-live="polite"
					aria-atomic="true"
					class="app__notifications"
					role="status"
				>
					<TransitionGroup name="app__notification">
						<Notification
							v-for="notification in notifications"
							:key="notification.key"
							:type="notification.type"
							:can-dismiss="true"
							@dismiss="dismissNotification(notification.key)"
						>
							{{ notification.message }}
						</Notification>
					</TransitionGroup>
				</div>
				<transition name="app__loading">
					<div v-if="isLoading" class="app__loading" role="alert">
						<div class="app__loading__content">
							<Spinner></Spinner>
							Loading
						</div>
					</div>
				</transition>
			</div>
		`,
	}),

	args: {...PageMock},
};
