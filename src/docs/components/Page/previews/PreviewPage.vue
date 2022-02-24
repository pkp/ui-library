<template>
	<div class="app" :class="classes">
		<header class="app__header" role="banner">
			<dropdown v-if="contexts.length" class="app__headerAction app__contexts">
				<template slot="button">
					<icon icon="sitemap" />
					<span class="-screenReader">Journals</span>
				</template>
				<ul>
					<li v-for="context in contexts" :key="context.id">
						<a :href="context.url" class="pkpDropdown__action">
							{{ context.title }}
						</a>
					</li>
				</ul>
			</dropdown>
			<div class="app__contextTitle">
				Journal of Public Knowledge
			</div>
			<div class="app__headerActions">
				<div class="app__headerAction app__tasks">
					<button
						ref="tasksButton"
						@click="alert('Opens the tasks grid in a modal')"
					>
						<icon icon="bell-o"></icon>
						<span class="-screenReader">Tasks</span>
						<span v-if="unreadTasksCount" class="app__tasksCount">
							{{ unreadTasksCount }}
						</span>
					</button>
				</div>
				<dropdown class="app__headerAction app__userNav">
					<template slot="button">
						<icon icon="user-circle-o" />
						<icon
							v-if="isLoggedInAs"
							icon="user-circle"
							class="app__userNav__isLoggedInAsWarning"
						/>
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
									<icon
										v-if="locale.key === 'en_US'"
										icon="check"
										:inline="true"
									/>
									{{ locale.name }}
								</a>
							</li>
						</ul>
					</div>
				</dropdown>
			</div>
		</header>

		<div class="app__body">
			<nav
				v-if="!!menu && Object.keys(menu).length > 1"
				class="app__nav"
				aria-label="Site Navigation"
			>
				<ul>
					<li
						v-for="(menuItem, key) in menu"
						:key="key"
						:class="!!menuItem.submenu ? 'app__navGroup' : ''"
					>
						<div
							v-if="!!menuItem.submenu"
							class="app__navItem app__navItem--hasSubmenu"
						>
							{{ menuItem.name }}
						</div>
						<a
							v-else
							class="app__navItem"
							:class="menuItem.isCurrent ? 'app__navItem--isCurrent' : ''"
							:href="menuItem.url"
						>
							{{ menuItem.name }}
						</a>
						<ul v-if="!!menuItem.submenu">
							<li
								v-for="(submenuItem, submenuKey) in menuItem.submenu"
								:key="submenuKey"
							>
								<a
									class="app__navItem"
									:class="
										submenuItem.isCurrent ? 'app__navItem--isCurrent' : ''
									"
									:href="submenuItem.url"
								>
									{{ submenuItem.name }}
								</a>
							</li>
						</ul>
					</li>
				</ul>
			</nav>
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
						<h1 class="app__pageHeading">
							Page Title Here
						</h1>
						<div class="app__contentPanel">
							<div style="min-height: 50rem;"></div>
						</div>
					</div>
				</div>
			</main>
		</div>
		<div
			aria-live="polite"
			aria-atomic="true"
			class="app__notifications"
			ref="notifications"
			role="status"
		>
			<transition-group name="app__notification">
				<notification
					v-for="notification in notifications"
					:key="notification.key"
					:type="notification.type"
					:can-dismiss="true"
					@dismiss="dismissNotification(notification.key)"
				>
					{{ notification.message }}
				</notification>
			</transition-group>
		</div>
		<transition name="app__loading">
			<div v-if="isLoading" class="app__loading" role="alert">
				<div class="app__loading__content">
					<spinner></spinner>
					Loading
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import Page from '@/components/Container/Page.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';

export default {
	extends: Page,
	components: {
		Dropdown
	},
	data() {
		return {
			breadcrumbs: [
				{
					id: 'settings',
					name: 'Settings',
					url: 'http://example.org'
				},
				{
					id: 'website',
					name: 'Website'
				}
			],
			contexts: [
				{
					id: 1,
					title: 'Journal of Public Knowledge',
					url: 'http://example.org'
				},
				{
					id: 2,
					title: 'Recherche Bactériologique',
					url: 'http://example.org'
				},
				{
					id: 3,
					title: 'الطب والأنثروبولوجيا',
					url: 'http://example.org'
				}
			],
			currentLocale: 'en_US',
			hasMultipleContexts: true,
			isLoggedInAs: 'ccorino',
			locales: [
				{
					key: 'en_US',
					name: 'English'
				},
				{
					key: 'fr_CA',
					name: 'Français (Canada)'
				},
				{
					key: 'ar_AR',
					name: 'العربية'
				}
			],
			menu: {
				submissions: {
					name: 'Submissions',
					url: '#/component/Page',
					isCurrent: false
				},
				issues: {
					name: 'Issues',
					url: '#/component/Page',
					isCurrent: false
				},
				announcements: {
					name: 'Announcements',
					url: '#/component/Page',
					isCurrent: false
				},
				subscriptions: {
					name: 'Subscriptions',
					url: '#/component/Page',
					isCurrent: false
				},
				settings: {
					name: 'Settings',
					isCurrent: false,
					submenu: {
						context: {
							name: 'Journal',
							url: '#/component/Page',
							isCurrent: false
						},
						website: {
							name: 'Website',
							url: '#/component/Page',
							isCurrent: false
						},
						workflow: {
							name: 'Workflow',
							url: '#/component/Page',
							isCurrent: false
						},
						distribution: {
							name: 'Distribution',
							url: '#/component/Page',
							isCurrent: false
						},
						access: {
							name: 'Users & Roles',
							url: '#/component/Page',
							isCurrent: false
						}
					}
				},
				stats: {
					name: 'Stats',
					isCurrent: false,
					submenu: {
						editorial: {
							name: 'Editorial',
							url: '#/component/Page',
							isCurrent: false
						},
						publications: {
							name: 'Publications',
							url: '#/component/Page',
							isCurrent: false
						},
						users: {
							name: 'Users',
							url: '#/component/Page',
							isCurrent: false
						}
					}
				},
				tools: {
					name: 'Tools',
					url: '#/component/Page',
					isCurrent: false
				},
				admin: {
					name: 'Administration',
					url: '#/component/Page',
					isCurrent: false
				}
			},
			tasksUrl: '',
			unreadTasksCount: 3
		};
	},
	computed: {
		classes() {
			let classes = [];
			if (this.isLoggedInAs) {
				classes.push('app--isLoggedInAs');
			}
			return classes;
		},
		currentUsername() {
			return this.isLoggedInAs ? this.isLoggedInAs : pkp.currentUser.username;
		}
	},
	methods: {
		alert(msg) {
			alert(msg);
		}
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.component--Container {
	.component__exampleWrapper {
		max-width: none;
		background: transparent;
	}

	.previewApp__content {
		background: #fff;
	}
}
</style>
