
Use this component to display content in tabs.

## Accessible label

Pass a `label` to the `Tabs` component to improve the experience for assistive technology. For example, a group of settings tabs might be labeled like this:

```html
<tabs label="Website Settings Sections">
	<tab>...</tab>
	<tab>...</tab>
</tabs>
```

A `label` is not needed when the tabs immediately follow a heading which describes the tabs. Otherwise a `label` should be used.

## Open tab programmatically

Tabs listen for an `open-tab` event on the global event bus. To open a tab, fire this event and pass the tab `id`:

```js
pkp.eventBus.$emit('open-tab', 'publication')
```

This only works when the tab is visible. If the `publication` tab was nested inside of other tabs and was not visible, it would not be displayed. Consider the following code:

```html
<tabs>
	<tab id="hello" label="Hello">...</tab>
	<tab id="world" label"World">
		<tabs>
			<tab id="lorem" label="Lorem">...</tab>
			<tab id="ipsum" label="Ipsum">...</tab>
		</tabs>
	</tab>
</tabs>
```

If the `hello` tab is currently visible, firing `pkp.eventBus.$emit('open-tab', 'ipsum')` will not work, because its tab set is not currently visible.

## Icon-only Tab Buttons

Avoid using icon-only tabs except in rare cases. A text label is almost always easier to understand.

You must still pass a `label` to a `Tab` when using the `icon` property. It will be read out by assistive technology.

## Deep Nesting

Avoid deeply nesting tabs. The deeper content is nested in tabs, the more work it takes to return to that content when the page is refreshed. Also, it is very difficult to navigate to deeply nested content programmatically.

Consider two levels a maximum. If you want to use more than two levels of tabs, discuss this with colleagues before proceeding.
