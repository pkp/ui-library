# Contributing

When creating a new component, you may be asked to document it in this library. You will need to create a component demo, document the component, and add it to the site. The following provides an outline of how the library files are structured and how to add a component demo to the library.

## Source Files

The following directories contain the source components, mixins and styles that make up the UI Library components. Files in these directories may be imported and used as components in the applications.

| Directory         | Description                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| `/src/components` | [Single-File Component](https://vuejs.org/guide/scaling-up/sfc.html) source files. |
| `/src/mixins`     | [Mixins](https://vuejs.org/v2/guide/mixins.html) used in components.               |
| `/src/styles`     | Global CSS/LESS styles, like variables and resets.                                 |

## Library Files

The following files and directories contain the UI Library itself: the documentation, demo components, and application that make up this website.

| Directory              | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `/public`              | Static files and sample data.                                |
| `/src/docs`            | All documentation and demonstration components.              |
| `/src/docs/components` | Component demo for the components in `/src/components`.      |
| `/src/docs/pages`      | Documentation not related to a component, such as this page. |
| `/src/App.vue`         | The root component of the UI Library.                        |
| `/src/main.js`         | Loads dependencies and initializes the UI Library.           |
| `/src/router.js`       | The router for the UI Library.                               |

## Add a Component Demo

A component demo is just a wrapper component that loads the source component and passes props to it. The following example shows a demo of the [Notification](#/component/Notification) component.

```html
<!-- /src/docs/components/Notification/PreviewNotification.vue -->

<template>
	<div>
		<notification type="warning">
			This submission does not have an editor assigned.
		</notification>
	</div>
</template>

<script>
import Notification from '../../components/Notification/Notification.vue';

export default {
	components: {
		Notification
	}
};
</script>
```

Place the demo into the `src/docs/components/Notification` directory and create a `readme.md` file in the same directory.

```md
##  Props

| Key    | Description                                                                                  |
| ------ | -------------------------------------------------------------------------------------------- |
| `type` | The type of notification. Pass `warning` for notifications about errors or serious problems. |

## Events

This component does not emit any events.

## Usage

Use the `Notification` component to draw the user's attention to new information. Do not overuse notifications. If they become too common, they will no longer draw the user's attention.
```

Create a new component that extends `Component`. Load the readme and demo component into this component.

```html
<!-- /src/docs/components/Notification/ComponentNotification.vue -->

<script>
import Component from '@/docs/Component.vue';
import PreviewNotification from './PreviewNotification.vue';
import PreviewNotificationTemplate from './PreviewNotification.vue?raw';
import readme from './readme.md?raw';

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
