# Contributing

This library provides documentation and a development sandbox for building and maintaining components. If you contribute you may be asked to document your changes. This document describes how to add and edit documentation for a component.

## File Structure

The following directories contain code that is run by our applications.

| Directory | Description |
| --- | --- |
| `/src/components` | All of the Vue.js component source files. |
| `/src/mixins` | [Mixins](https://vuejs.org/v2/guide/mixins.html) used in components. |
| `/src/styles` | LESS styles that are imported into global stylesheets and components. |

The rest of the files in this library are used to run the component demos.

| Directory | Description |
| --- | --- |
| `/public` | Static site files. |
| `/src/docs` | Document and preview components. |
| `/src/docs/components` | Document individual components in the UI Library. |
| `/src/docs/pages` | Markdown files for pages that are not related to a component, such as the page you are reading now. |
| `/src/App.vue` | The main component that runs the UI Library. |
| `/src/main.js` | Loads dependencies and initializes the UI Library. |
| `/src/router.js` | The router for the UI Library. |

## Create a Component Demo

Each component demo should include an example of the component in action, documentation describing the props accepted and events emitted by the component, and guidance on when and how the component should be used.

Create a single-file Vue component that loads an example of the component you wish to document:

```html
<!-- /src/docs/components/Notification/previews/PreviewNotification.vue -->
<template>
	<div class="previewNotification">
		<notification type="warning">
			This submission does not have an editor assigned.
		</notification>
	</div>
</template>

<script>
import Notification from '@/components/Notification/Notification.vue';

export default {
	components: {
		Notification
	}
};
</script>
```

Create a `readme.md` file that documents how the component works.

```md
##  Props

| Key | Description |
| --- | --- |
| `type` | The type of notification. Pass `warning` for notifications about errors or serious problems. |

## Events

This component does not emit any events.

## Usage

Use the `Notification` component to draw the user's attention to new information. Do not overuse notifications. If they become too common, they will no longer draw the user's attention.
```

Create the documentation component which will load the example and readme:

```html
<!-- /src/docs/components/Notification/ComponentNotification.vue -->
<script>
import Component from '@/docs/Component.vue';
import PreviewNotification from './previews/PreviewNotification.vue';
import PreviewNotificationTemplate from '!raw-loader!./previews/PreviewNotification.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Notification',
			readme: readme,
			examples: [
				{
					component: PreviewNotification,
					name: 'Base',
					template: this.extractTemplate(PreviewNotificationTemplate)
				}
			]
		};
	}
};
</script>
```

Import more `Preview*` components and add them to the `examples` array if you want more than one example.

Add a route to the component in `/src/router.js`:

```js
...
import ComponentNotification from "./docs/components/Notification/ComponentNotification.vue";

...
	{
		path: "/component/Notification/:example?",
		name: "Notification",
		component: ComponentNotification,
	},
...
```

Add a link to the navigation menu in `/src/App.vue`:

```html
...
	<li><router-link to="/component/Notification">Notification</router-link></li>
...
```

## ESLint and Prettier

This library runs ESLint and Prettier to maintain code formatting. When you are running `npm run serve`, any file changes will be linted and errors will be reported in the console.

When you commit, ESLint and Prettier will run. You will not be able to commit if there are ESLint errors.

## Issues

Issues for for this library should be opened on the [pkp/pkp-lib](https://github.com/pkp/pkp-lib/issues/) repository. All issues related to OJS and OMP are managed there, including issues with this UI Library.

## Pull Requests

Pull Requests for this library should be opened on the [pkp/ui-library](https://github.com/pkp/ui-library/pulls) repository.
