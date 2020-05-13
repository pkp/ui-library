## Props

This is a root component. Pass data to the component using [state](#/component/Page#state).

## Data

| Key | Description |
| --- | --- |
| `breadcrumbs` | An array of objects defining a breadcrumb to display above main page content. |
| `components` | A key/value object with component data to manage. See [Managing Components](#/component/Page#managing-components) |
| `menu` | An array items for the main navigation menu |
| `notifications` | An array of toast-style notifications to display. Default: `[]`. See [Notify](/utilities/Notify) |
| `notificationInterval` | Used internally to clear notifications. Do not set this manually. |
| `tasksUrl` | The URL to retrieve the tasks grid. |
| `unreadTasksCount` | The current number of unread tasks. |

## Events

This is a root component. It does not emit any events but may fire events on the global [event bus](/#/pages/event-bus).

## Usage

This component is a root component which is used to render a page of the editorial backend. It manages the layout architecture, including the main navigation menu, tasks and user navigation dropdown.

Nothing is needed to load the `Page` component. It is initialized automatically for every page in the editorial backend.

## State

The `Page` component is responsible for managing data on its page. For example, if an action changes the number of unread tasks, the `Page` container should update the value.

```html
<button @click="markTaskRead(1)">
	...
</button>
```
```js
methods: {
	markTaskRead(id) {
		var self = this;
		$.ajax(/* API request to mark task read */)
			.success(() => {
				this.unreadTasksCount = this.unreadTasksCount - 1
			});
	}
}
```

Data that is passed to the `Page` component is called "state". Initialize state data on the server side using the Template Manager.

```php
$templateMgr = TemplateManager::getManager($request);
$templateMgr->setState([
	'unreadTasksCount' => $unreadTasksCount,
]);
```

## Managing Components

The `Page` component sometimes manages state that should be passed down to a complex component. For example, a `Page` component may manage a list panel which updates state data by making requests to the API.

In large applications, a state management library such as [Vuex](https://vuex.vuejs.org/) is typically used. Instead, we opt for a lightweight approach to manage state. State is passed down to child components, which emit events when they want to update that state.

If you are unfamiliar with how props and events are used to coordinate components, read this guide on [organizing components](https://vuejs.org/v2/guide/components.html#Organizing-Components).

The example below demonstrates how to pass state to a complex component, the `submissions-list-panel`, and update that state.

```html
<submissions-list-panel />
```

All props for the list panel are stored in the  `components` object with a unique key. These props can be passed to the component all at once with `v-bind`.

```html
<submissions-list-panel
	v-bind="components.submissions"
/>
```

When the child component needs to update the props that have been passed down, it will emit a `set` event to update state data.

```js
/* This code is used in the submissions list panel */
this.$emit('set', this.id, {items: newItems});
```

The `Page` component provides a `set` method that will listen for this event and update the component's state. Use the following to call this method when the `set` event is emitted.

```html
<submissions-list-panel
	v-bind="components.submissions"
	@set="set"
/>
```

## Extend the Page Component

It is often necessary to extend the `Page` component to provide additional functionality for a page. The example below shows the `SettingsPage` component, which adds or removes a navigation menu item when the announcements have been enabled or disabled.

```js
import Page from './Page.vue';

export default {
	name: 'SettingsPage',
	extends: Page,
	mounted() {
		pkp.eventBus.$on('form-success', (formId, context) => {
			if (formId === pkp.const.FORM_ANNOUNCEMENT_SETTINGS) {
				let menu = {...this.menu};
				if (!context.enableAnnouncements) {
					delete menu.announcements;
				} else {
					menu.announcements = {
						name: 'Announcements,
						url: 'http://example.org/announcements'
					};
				}
				this.menu = menu;
			}
		});
	},
	destroyed() {
		pkp.eventBus.$off('form-success');
	}
};
```

Once a new page component has been created, it must be imported and registered in `js/load.js`.

```js
...
import SettingsPage from '@/components/Container/SettingsPage.vue';

window.pkp = Object.assign(PkpLoad, {
	controllers: {
		...
		SettingsPage
	}
});
```

Finally, it must be declared as the `pageComponent` on the server-side.

```php
$templateMgr = TemplateManager::getManager($request);
$templateMgr->assign([
	'pageComponent' => 'SettingsPage',
]);
```

Several page components have been created:

- `AdminPage` is used on administration pages.
- `ImportExportPage` is used to support the select all functionality for the export tools.
- `SettingsPage` is used on settings pages.
- `StatsEditorialPage` is used on the editorial stats page. See [preview](#/component/StatsPage).
- `StatsPublicationsPage` is used on the publication stats page. See [preview](#/component/StatsPage/publication-stats).
- `WorkflowPage` is used on the submission workflow page. See [preview](#/component/WorkflowPage).

