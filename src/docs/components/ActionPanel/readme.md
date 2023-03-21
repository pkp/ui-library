## Props

This component does not accept any props.

## Events

This component does not emit any events.

## Usage

Use this component to pair an action, like a button or link, with a title and description. Often, the action will be a button or link with a truncated label. Consider the following example.

```html
<action-panel>
	<h2>Delete Item</h2>
	<p>
		Delete the item and remove it from the user's list of pending items.
		This action can not be undone.
	</p>
	<template slot="actions">
		<pkp-button @click="delete">Delete</pkp-button>
	</template>
</action-panel>
```

Someone using assistive technology may use a shortcut to jump straight to the button and miss the description of the action. Use the `aria-describedby` attribute to make sure relate descriptions to action buttons or links.

```html
<action-panel>
	<h2>Delete Item</h2>
	<p id="delete-item-description">
		Delete the item and remove it from the user's list of pending items.
		This action can not be undone.
	</p>
	<template slot="actions">
		<pkp-button aria-describedby="delete-item-description">Delete</pkp-button>
	</template>
</action-panel>
```
