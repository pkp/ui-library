<script type="text/javascript">
import Container from '@/components/Container/Container.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import Notification from '@/components/Notification/Notification.vue';
import PkpHeader from '@/components/Header/Header.vue';

export default {
	extends: Container,
	name: 'Page',
	components: {
		Dropdown,
		Notification,
		PkpHeader
	},
	data() {
		return {
			breadcrumbs: [],
			isLoading: false,
			menu: [],
			notifications: [],
			notificationInterval: null,
			tasksUrl: '',
			unreadTasksCount: 0
		};
	},
	computed: {
		/**
		 * The menu item entry for a back-to-dashboard link
		 *
		 * @return {Object|null}
		 */
		backToDashboardLink() {
			if (this.useBackToDashboard) {
				return this.menu[Object.keys(this.menu)[0]];
			}
			return null;
		},

		/**
		 * The new label for the back-to-dashboard link
		 *
		 * Converts "Submissions" to "Back to Submissions"
		 *
		 * @return {String}
		 */
		backToDashboardLabel() {
			if (this.backToDashboardLink) {
				return this.__('navigation.backTo', {
					page: this.backToDashboardLink.name
				});
			}
			return null;
		},

		/**
		 * Should a back-to-dashboard link be shown instead of a
		 * full navigation menu?
		 *
		 * This is the case when the nav menu contains only one link.
		 *
		 * @return {Boolean}
		 */
		useBackToDashboard() {
			return (
				!!this.menu &&
				Object.keys(this.menu).length === 1 &&
				!this.menu[Object.keys(this.menu)[0]].isCurrent
			);
		}
	},
	methods: {
		/**
		 * Dismiss a notification
		 *
		 * @param {String} key Notification key
		 */
		dismissNotification(key) {
			this.notifications = this.notifications.filter(n => {
				return n.key !== key;
			});
		},

		/**
		 * Open the requested tab when the URL includes an anchor
		 */
		openUrlTab() {
			let parts = window.location.hash.slice(1).split('/');
			while (parts.length) {
				pkp.eventBus.$emit('open-tab', parts.shift());
			}
		},

		/**
		 * Open a modal showing the user's tasks
		 */
		openTasks() {
			var opts = {
				url: this.tasksUrl,
				closeCallback: this.$refs.tasksButton.focus()
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		}
	},
	mounted() {
		/**
		 * Open tabs if the URL contains an anchor (#tabname)
		 */
		if (window.location.hash) {
			this.openUrlTab();
		}
		window.onhashchange = this.openUrlTab;

		/**
		 * Respond to notify events
		 */
		let notificationUniqueKey = 0;
		pkp.eventBus.$on('notify', (message, type) => {
			this.notifications.push({
				key: notificationUniqueKey,
				message: message,
				type: type ?? 'notice',
				expire: Date.now() + 5000 // milliseconds
			});
			notificationUniqueKey++;
		});

		// Regularly clear out expired notifications
		this.notificationInterval = setInterval(() => {
			if (!this.notifications.length) {
				return;
			}
			// Don't close notifications when mouse is hovered over one
			if (this.$refs.notifications.matches(':hover')) {
				return;
			}
			this.notifications = this.notifications.filter(notification => {
				return notification.expire > Date.now();
			});
		}, 250);

		/**
		 * Respond to an event fired to clear all notifications
		 */
		pkp.eventBus.$on('clear-all-notify', () => (this.notifications = []));

		/**
		 * Response to an event when the unread task count changes
		 */
		pkp.eventBus.$on(
			'update:unread-tasks-count',
			data => (this.unreadTasksCount = data.count)
		);
	},
	destroyed() {
		pkp.eventBus.$off('notify');
		pkp.eventBus.$off('clear-all-notify');
		clearInterval(this.notificationInterval);
		pkp.eventBus.$off('update:unread-tasks-count');
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.app__header {
	position: sticky;
	top: 0;
	display: flex;
	align-items: center;
	min-height: 3rem;
	background: @bg-anchor;
	font-size: 0.85rem;
	z-index: 10;
}

.app__contextTitle {
	margin-left: 0.5rem;
	margin-right: 0.5rem;
	padding: 0.5rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	min-width: 1px;
	font-size: 1rem;
	font-weight: @bold;
	line-height: 1;
	color: #fff;
	text-decoration: none;
	border: 1px solid transparent;
	border-radius: @radius;

	&:hover {
		color: #fff;
	}

	&:focus {
		outline: none;
		border-color: #fff;
		color: #fff;
	}
}

.app__headerActions {
	display: flex;
	margin-left: auto;
	white-space: nowrap;

	.pkpDropdown__content {
		right: 0;
		white-space: initial;
	}
}

.app__headerAction {
	> button {
		padding: 0.5rem 1rem;
		box-shadow: none;
		background: transparent;
		border: none;
		border-radius: 0;
		color: #fff;
		font-weight: @normal;
		box-shadow: 0 0 0 #fff;
		transform: translateY(0);
		transition: 0.15s all;

		.fa {
			font-size: 1.5rem;
			vertical-align: middle;
		}

		&:hover,
		&:focus {
			outline: none;
			transform: translateY(-0.25rem);
			box-shadow: 0 0.25rem 0 #fff;
			color: #fff;
		}
	}
}

.app__contexts {
	border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.app__contexts > .pkpButton .fa {
	font-size: 1.1rem;
}

.app__contexts .pkpDropdown__content {
	left: 0.25rem;
}

.app__tasks > button {
	position: relative;
	padding: 0.5rem 1rem;
	background: transparent;
	border: none;
	line-height: 2rem;
	color: #fff;
	cursor: pointer;
}

.app__tasksCount {
	position: absolute;
	top: 0.5rem;
	right: 0.75rem;
	background: @no;
	line-height: 1;
	padding: 2px;
	border-radius: @radius;
	color: #fff;
	box-shadow: 0 0 1px 1px @bg-anchor;
}

.app__userNav .pkpDropdown__content {
	right: 0.25rem;
}

.app__userNav > .pkpButton > .app__userNav__isLoggedInAsWarning {
	position: absolute;
	right: 0.5em;
	top: 0.5em;
	font-size: 1rem;
	color: #fff;
	background: @primary;
	border-radius: 50%;
}

.app__userNav .pkpDropdown__content {
	min-width: 13rem;
}

.app__userNav__loggedInAs {
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
	padding-left: 0.5rem;
	padding-right: 0.5rem;
	font-size: @font-tiny;
	line-height: 1.7em;
}

.app__userNav__changeLocale {
	padding-left: 0.5rem;
	font-weight: @bold;
	font-size: @font-tiny;
}

.app__returnHeader {
	position: sticky;
	top: 3rem;
	padding-left: 1rem;
	padding-right: 1rem;
	background: @bg-anchor;
	color: #fff;
	min-height: 3rem;
	line-height: 3rem;
	background: @bg-anchor;
	font-size: 0.85rem;
	z-index: 9;
}

.app__returnHeaderLink {
	text-decoration: none;
	color: #fff;
	line-height: 1.5em;
	border: 1px solid transparent;
	border-radius: @radius;
	margin-left: -0.5rem;
	padding: 0.25rem 0.5rem;

	&:focus {
		outline: none;
		border-color: #fff;
		color: #fff;
	}
}

.app__body {
	display: flex;
	align-items: stretch;
}

.app__nav {
	flex: 0 0 15rem;
	padding-top: 1.5rem;
	padding-left: 0.5rem;
	padding-right: 0.5rem;
	font-size: @font-sml;
	line-height: 1.5rem;

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
}

.app__navGroup {
	margin-top: 2rem;
	margin-bottom: 2rem;
}

.app__navItem {
	display: inline-block;
	padding: 0.25rem 0.5rem;
	color: @bg-anchor;

	.app__navItem {
		padding-left: 0;
		padding-right: 0;
	}
}

.app__navItem--hasSubmenu {
	font-weight: bold;
}

a.app__navItem {
	text-decoration: none;

	&:hover {
		color: @primary;
	}

	&:focus {
		box-shadow: 0 0 0 1px @primary;
		border-radius: @radius;
		outline: 0;
		color: @bg-anchor;
	}
}

a.app__navItem--isCurrent {
	background: @bg-anchor;
	border-radius: @radius;
	font-weight: bold;
	color: #fff;

	&:hover {
		color: #fff;
	}

	&:focus {
		box-shadow: none;
		background: @primary;
		color: #fff;
	}
}

.app__main {
	padding: 1rem;
	width: 100%;
	min-width: 1px;
}

.app__breadcrumbs {
	margin: -1rem -1rem 1rem;
	padding: 0.5rem 1rem;
	font-size: 0.85rem;
	color: @bg-anchor;

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: inline-block;
		font-size: 0.75rem;
	}

	a {
		text-decoration: none;

		&:hover,
		&:focus {
			text-decoration: underline;
		}
	}
}

.app__breadcrumbsSeparator {
	display: inline-block;
	margin-left: 0.5rem;
	margin-right: 0.5rem;
	color: @text-light;
}

.app__page {
	max-width: 992px;
	margin-left: auto;
	margin-right: auto;
}

.app__pageHeading {
	margin: 0 0 1rem;
	font-size: @font-lead;
	line-height: @line-lead;
}

.app__contentPanel {
	padding: 1rem;
	background: @lift;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	border-radius: @radius;
	font-size: @font-sml;
}

// Tasks dropdown
.app__tasksDropdown {
	width: 75vw;

	@media (min-width: 35rem) {
		width: 30rem;
	}

	.header {
		border: none;
	}

	.pkp_linkaction_details {
		font-size: @font-sml;
		line-height: 1.5em;
		text-decoration: none;
	}
}

// "Toast"-style notifications
.app__notifications {
	position: fixed;
	top: 3.5rem;
	right: 0.5rem;
	width: 20rem;
	z-index: 1001;

	.pkpNotification {
		transition: all 0.2s;
	}

	.pkpNotification + .pkpNotification {
		margin-top: 0.5rem;
	}
}

.app__notification-enter {
	transform: translateY(1.5rem);
	opacity: 0;
}

.app__notification-leave-to {
	transform: translateY(-1.5rem);
	opacity: 0;
}

// Full-page loading screen
.app__loading {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1999;
	transition: opacity 0.3s;
	background: rgba(255, 255, 255, 0.5);
}

.app__loading-enter,
.app__loading-leave-to {
	opacity: 0;
}

.app__loading__content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

[dir='rtl'] {
	.app__headerActions {
		margin-left: 0;
		margin-right: auto;

		.pkpDropdown__content {
			right: auto;
			left: 0;
		}
	}

	.app__contexts,
	.app__tasks {
		border-right: none;
		border-left: 1px solid rgba(255, 255, 255, 0.2);
	}

	.app__contexts .pkpDropdown__content {
		left: auto;
		right: 0.25rem;
	}

	.app__userNav .pkpDropdown__content {
		right: auto;
		left: 0.25rem;
	}

	.app__notifications {
		right: auto;
		left: 0.5rem;
	}
}

@media (min-width: 1140px) {
	.app__main {
		padding: 2rem 1rem;
	}

	.app__breadcrumbs {
		margin: -2rem -1rem 1rem;
	}
}
</style>
