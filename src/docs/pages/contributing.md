# Contributing

This library provides documentation and a development sandbox for building and maintaining components. If you contribute you may be asked to document your changes. This document describes how to add and edit documentation for a component.

## File Structure

All of the files loaded by OJS or OMP can be found in `/src/components`, `/src/mixins`, and `/src/styles`. Everything else in this repository is only used to run this library.

- `/public` Global files that help run the UI Library app. Not used in OJS and OMP.
- `/src/components` The component source files. All imports from OJS and OMP should be here.
- `/src/docs` The files used to document and preview components. Not used in OJS and OMP.
- `/src/docs/components` Files for displaying and documenting individual components in the UI Library. Not used in OJS and OMP.
- `/src/docs/pages` Markdown files for description pages that are not specific to a component, such as this page you are reading now.
- `/src/mixins` [Mixins](https://vuejs.org/v2/guide/mixins.html) used in components. Used in OJS and OMP.
- `/src/styles` LESS styles that are imported into global stylesheets and components. Some files used in OJS and OMP.
- `/src/App.vue` The main component that runs the UI Library. Not used in OJS and OMP.
- `/src/main.js` Loads dependencies and initializes the UI Library. Not used in OJS and OMP, but often dependencies must be synced with `js/load.js` and `/lib/pkp/js/load.js` in those applications.
- `/src/router.js` The router for the UI Library. Not used in OJS and OMP.

## Creating a Component Demo

Each documented component requires the following:

- documented props, data and events,
- an example of the component in action
- usage guidance

This section will describe the files that are used to document the [HelpButton](#/component/HelpButton) component. You can use this as a guide to documenting your own components.

Create a basic preview of the component:

```html
<!-- /src/docs/components/HelpButton/previews/PreviewHelpButton.vue -->
<template>
	<help-button
		topic="settings"
		section="workflow-library"
		label="Learn more about the Publisher Library"
	/>
</template>

<script>
import HelpButton from '@/components/HelpButton/HelpButton.vue';

export default {
	components: {
		HelpButton,
	}
};
</script>
```

Create a `config.js` file that exports default props and describes every prop accepted by the component:

```js
// /src/docs/components/HelpButton/config.js
export let props = {
	topic: 'settings',
	section: 'workflow-library',
	label: 'Learn more about the Publisher Library'
}

export const propDocs = [
	{
		key: 'topic',
		description: 'Which topic to open in the help panel. This will correspond with one of the `.md` files used in the help panel. Do not include the `.md` extension.'
	},
	{
		key: 'section',
		description: 'Open the help panel to a particular section of the topic. This must match one of the named anchors in the topic page, such as `<a name="workflow-library"></a>`.'
	},
	{
		key: 'label',
		description: 'A localized label for screen readers. In English this should be "Help".'
	}
]

export default {
	props,
	propDocs
}
```

If your component accepts data or emits events, those should be documented and exported as `data`, `dataDocs`, and `events`.

Create an example of the component:

```html
<!-- /src/docs/components/HelpButton/ExampleHelpButton.vue -->
<script>
import Example from '@/docs/Example.vue';
import PreviewHelpButton from './previews/PreviewHelpButton.vue';
// !raw-loader helps us extract the pre-compiled template from the preview
import fileContent from '!raw-loader!./previews/PreviewHelpButton.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewHelpButton
	},
	data() {
		return {
			...config,
			component: 'preview-help-button',
			props: config.props,
			template: this.extractTemplate(fileContent),
		}
	}
}
</script>
```

Notice how the `config` object is passed to the data. This is used to provide consistent starting props, data, and documentation for all examples of a component.

Create the parent documentation component and pass each example:

```html
<!-- /src/docs/components/HelpButton/ComponentHelpButton.vue -->
<script>
import Component from '@/docs/Component.vue';
import ExampleHelpButton from './ExampleHelpButton.vue';

export default {
	extends: Component,
	components: {
		ExampleHelpButton,
	},
	data() {
		return {
			name: 'Help Button',
			examples: {
				'ExampleHelpButton': 'Base'
			}
		}
	}
}
</script>
```

To create multiple examples for a component, import additional `Example*` components and add them to the `examples` data object.

Create a `readme.md` file to provide usage guidance for the component:

```md
<!--- /src/docs/components/HelpButton/readme.md --->
Use this component to display an icon that will open the help panel when clicked.

...
```

Add a route to `/src/router.js`:

```js
...
import ComponentHelpButton from "./docs/components/HelpButton/ComponentHelpButton.vue";

...
	{
		path: "/component/HelpButton/:example?",
		name: "HelpButton",
		component: ComponentHelpButton,
	},
...
```

Finally, add a link to the library's list of documented components:

```html
...
	<li><router-link to="/component/HelpButton">HelpButton</router-link></li>
...
```

## Linked Components

Some components can only be used with a specific parent component. For example, `ListPanelLoadMore` is only used in `ListPanel` components.

When documenting such components, add an example that demonstrates this relationship and label it "With <name-of-child-component>".

See [ListPanel/ListPanelLoadMore](http://localhost:8080/component/ListPanel/ListPanelLoadMore).

## ESLint and Prettier

This library runs ESLint and Prettier to maintain code formatting. When you are running `npm run serve`, any file changes will be linted and errors will be reported in the console.

When you commit, ESLint and Prettier will run. You will not be able to commit if there are ESLint errors.

## Issues

Issues for for this library should be opened on the [pkp/pkp-lib](https://github.com/pkp/pkp-lib/issues/) repository. All issues related to OJS and OMP are managed there, including issues with this UI Library.

## Pull Requests

Pull Requests for this library should be opened on the [pkp/ui-library](https://github.com/pkp/ui-library/pulls) repository.
