import {computed} from 'vue';
import Page from './Page.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import SideNav from '@/components/SideNav/SideNav.vue';
import InitialsAvatar from '@/components/InitialsAvatar/InitialsAvatar.vue';
import PageMock from '@/mocks/page';

export default {
	title: 'Pages/Page',
	component: Page,
};

export const Default = {
	render: (args) => ({
		components: {Page, Dropdown, SideNav, InitialsAvatar},
		setup() {
			const classes = computed(() => {
				let _classes = [];
				if (args.isLoggedInAs) {
					_classes.push('app--isLoggedInAs');
				}
				return _classes;
			});

			const currentUsername = computed(() =>
				args.isLoggedInAs ? args.isLoggedInAs : pkp.currentUser.username,
			);

			function alertFn(msg) {
				alert(msg);
			}
			return {...args, classes, currentUsername, alert: alertFn};
		},
		template: `
			<div class="app" :class="classes">
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
					<div class="app__headerActions">
						<div class="app__headerAction app__tasks">
							<button
								ref="tasksButton"
								@click="alert('Opens the tasks grid in a modal')"
							>
								<Icon icon="Notifications" class="h-7 w-7"></Icon>
								<span class="-screenReader">Tasks</span>
								<span v-if="unreadTasksCount" class="app__tasksCount">
									{{ unreadTasksCount }}
								</span>
							</button>
						</div>
						<Dropdown class="app__headerAction app__userNav">
							<template #button>
								<InitialsAvatar :is-secondary="true" given-name="Test" family-name="User"></InitialsAvatar>
								<InitialsAvatar
									v-if="isLoggedInAs"
									class="absolute right-2 top-2 rounded-full h-5 w-5"
									:is-warnable="true"
									:shrink="true"
								></InitialsAvatar>
								<span class="-screenReader">Options for {{ currentUsername }}</span>
							</template>
							<div v-if="isLoggedInAs" class="pkpDropdown__section">
								<div class="app__userNav__loggedInAs">
									You are currently logged in as {{ currentUsername }}.
									<a href="#" class="app__userNav__logOutAs">
										Logout as {{ currentUsername }}
									</a>
									.
								</div>
							</div>
							<div class="pkpDropdown__section">
								<ul>
									<li>
										<a href="#" class="pkpDropdown__action">View Profile</a>
									</li>
									<li>
										<a href="#" class="pkpDropdown__action">Logout</a>
									</li>
								</ul>
							</div>
							<div class="pkpDropdown__section">
								<div class="app__userNav__changeLocale">Change Language</div>
								<ul>
									<li v-for="locale in locales" :key="locale.key">
										<a :href="locale.key" class="pkpDropdown__action">
											<Icon
												v-if="locale.key === 'en'"
												icon="Complete"
												class="h-5 w-5"
												:inline="true"
											/>
											{{ locale.name }}
										</a>
									</li>
								</ul>
							</div>
						</Dropdown>
					</div>
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
