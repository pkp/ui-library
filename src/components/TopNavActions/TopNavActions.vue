<template>
	<div class="ms-auto flex h-full whitespace-nowrap">
		<div v-if="helpUrl">
			<a
				:href="helpUrl"
				target="_blank"
				:class="getAnimationStyle()"
				class="flex h-full items-center p-2"
			>
				<Icon icon="HelpTopNav" class="h-7 w-7"></Icon>
				<span class="-screenReader">{{ t('common.help') }}</span>
			</a>
		</div>
		<div>
			<button
				ref="tasksButton"
				:class="getAnimationStyle('notif-button')"
				:disabled="isTasksModalOpened"
				class="border-none p-2"
				@click="openTasks"
			>
				<Icon icon="Notifications" class="h-7 w-7"></Icon>
				<span class="-screenReader">{{ t('common.tasks') }}</span>
				<span
					v-if="unreadTasksCount && !isTasksModalOpened"
					class="absolute right-3 top-2 rounded-[2px] bg-negative p-[2px] text-lg-normal leading-none text-on-dark shadow"
				>
					{{ unreadTasksCount }}
				</span>
			</button>
		</div>
		<div>
			<Dropdown class="app-user-nav flex h-full" data-cy="app-user-nav">
				<template #button>
					<InitialsAvatar
						:initials="activeUser.initials"
						:is-secondary="true"
						:is-disabled="_isUserLoggedInAs"
					></InitialsAvatar>
					<span class="-screenReader">{{ activeUser.username }}</span>

					<InitialsAvatar
						v-if="_isUserLoggedInAs"
						:initials="currentUser.initials"
						class="absolute top-1 h-6 w-6 rounded-full shadow ltr:right-1 rtl:left-1"
						:is-warnable="true"
						:shrink="true"
					></InitialsAvatar>
					<span class="-screenReader">{{ currentUser.username }}</span>
				</template>
				<nav
					:aria-label="t('common.navigation.user')"
					class="mb-2 min-w-52 max-w-[20em]"
				>
					<div
						v-if="supportedLocales.length > 1"
						class="-ml-2 -mr-2 border-b border-b-light pb-2 pl-2 pr-2"
					>
						<div class="ps-2 text-base-bold leading-6 text-secondary">
							Change Language
						</div>
						<ul>
							<li
								v-for="locale in supportedLocales"
								:key="locale.key"
								:class="actionLinkStyle"
							>
								<a :href="locale.href" class="block w-full no-underline">
									<Icon
										v-if="locale.key === currentLocale"
										icon="Complete"
										class="h-5 w-5"
										:inline="true"
									></Icon>
									{{ locale.value }}
								</a>
							</li>
						</ul>
					</div>
					<div
						v-if="_isUserLoggedInAs"
						class="-ml-2 -mr-2 text-wrap border-b border-b-light p-2"
					>
						<div
							class="mb-1 mt-1 pl-2 pr-2 text-base-normal leading-5 text-secondary"
						>
							{{
								t('manager.people.signedInAs', {username: currentUser.username})
							}}

							<a :href="signOutLink">
								{{ t('user.logOutAs', {username: currentUser.username}) }}
							</a>
							.
						</div>
					</div>
					<div class="-ml-2 -mr-2 text-wrap px-2 pt-2">
						<ul>
							<li :class="actionLinkStyle">
								<a :href="editProfileLink" class="w-full">
									{{ t('user.profile.editProfile') }}
								</a>
							</li>
							<li :class="actionLinkStyle">
								<a :href="signOutLink" class="w-full">
									{{
										_isUserLoggedInAs
											? t('user.logOutAs', {username: currentUser.username})
											: t('user.logOut')
									}}
								</a>
							</li>
						</ul>
					</div>
				</nav>
			</Dropdown>
		</div>
	</div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import InitialsAvatar from '@/components/InitialsAvatar/InitialsAvatar.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useCurrentUser} from '@/composables/useCurrentUser';
import {useApp} from '@/composables/useApp';
import {useUrl} from '@/composables/useUrl';
import {useAppStore} from '@/stores/appStore';
import {useUserAuth} from '@/composables/useUserAuth';

const {t} = useLocalize();
const {updateIsTasksModalOpened, isTasksModalOpened} = useAppStore();

const {
	getUnreadNotifications,
	setUnreadNotifications,
	isUserLoggedInAs,
	getCurrentUserName,
	getCurrentUserInitials,
	getUserLoggedInAsUserName,
	getUserLoggedInAsInitials,
} = useCurrentUser();

let updateUnreadTasks;
const unreadTasksCount = ref(getUnreadNotifications());
const _isUserLoggedInAs = isUserLoggedInAs();
const currentUser = {
	username: getCurrentUserName(),
	initials: getCurrentUserInitials(),
};
const activeUser = _isUserLoggedInAs
	? {
			username: getUserLoggedInAsUserName(),
			initials: getUserLoggedInAsInitials(),
		}
	: currentUser;

const {getLogoutUrl} = useUserAuth();
const logoutUrl = getLogoutUrl();
const {pageUrl: signOutLink} = useUrl(logoutUrl);
const {pageUrl: editProfileLink} = useUrl('user/profile');

const {getSupportedLocales, getCurrentLocale, getHelpUrl} = useApp();

const supportedLocales = Object.entries(getSupportedLocales() || {}).map(
	([key, value]) => {
		const {pageUrl} = useUrl(`user/setLocale/${key}`);
		return {key, value, href: pageUrl.value};
	},
);

const currentLocale = getCurrentLocale();
const helpUrl = getHelpUrl();

const getAnimationStyle = (buttonType) => {
	const isAnimationEnabled =
		buttonType !== 'notif-button' || !isTasksModalOpened;

	return {
		'relative bg-transparent leading-8 outline-none': true,
		'!text-on-dark': isAnimationEnabled,
		'!text-disabled': !isAnimationEnabled,
		'hover:-translate-y-1 hover:text-on-dark hover:shadow-[0_0.25rem_#fff]':
			isAnimationEnabled,
		'focus:-translate-y-1 focus:text-on-dark focus:shadow-[0_0.25rem_#fff]':
			isAnimationEnabled,
	};
};

const actionLinkStyle = [
	'max-w-full cursor-pointer overflow-hidden truncate whitespace-nowrap',
	'rounded border border-transparent bg-transparent hover:!border-primary',
	'px-2 py-1 leading-6 text-primary',
];

/**
 * Open a modal showing the user's tasks
 */
function openTasks() {
	const {openLegacyModal} = useLegacyGridUrl({
		component: 'grid.notifications.taskNotificationsGridHandler',
		op: 'fetchGrid',
	});

	openLegacyModal({title: t('common.tasks')}, () => {
		updateIsTasksModalOpened(false);
	});

	updateIsTasksModalOpened(true);
}

onMounted(() => {
	if (updateUnreadTasks) {
		pkp.eventBus.$off('update:unread-tasks-count', updateUnreadTasks);
	}

	updateUnreadTasks = (data) => {
		unreadTasksCount.value = setUnreadNotifications(data.count);
	};

	pkp.eventBus.$on('update:unread-tasks-count', updateUnreadTasks);
});

onUnmounted(() => {
	pkp.eventBus.$off('update:unread-tasks-count', updateUnreadTasks);
});
</script>

<style>
.app-user-nav > button {
	/* must match the animationStyle above */
	@apply relative bg-transparent leading-8 outline-none;
	@apply hover:-translate-y-1 hover:text-on-dark hover:shadow-[0_0.25rem_#fff];
	@apply focus:-translate-y-1 focus:text-on-dark focus:shadow-[0_0.25rem_#fff];

	/* other classes that need to be applied for dropdown button styling */
	@apply h-full !rounded-none border-none focus:outline-none;
}

.app-user-nav .pkpDropdown__content {
	@apply ltr:right-1 rtl:left-1;
}
</style>
