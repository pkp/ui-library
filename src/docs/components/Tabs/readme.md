## Props

Props for the outer `<Tabs>` element.

| Key | Description |
| --- | --- |
| `defaultTab` | Select one of the tabs by default. Pass the tab's `id` prop. |
| `isSideTabs` | Displays the tabs on the side with content beside it when `true`. |
| `label` | Sets an `aria-label` for the tabs. Read the [accessible label](#accessible-label) section below. |
| `trackHistory` | When `true`, changes to the current tab will modify the browser history so that the back button can be used. |

Props for each `<Tab>` element.

| Key | Description |
| --- | --- |
| `badge` | Adds a [Badge](#/component/Badge) component beside the icon or text in the tab. |
| `icon` | Adds an [Icon](#/component/Icon) component beside the text in the tab. |
| `id` | A unique string for this tab. Required. |
| `label` | A text label for this tab. |

## Events

This component does not emit any events.

## Usage

Use this component to display content in tabs. This component implements the `role="tablist"` specification. Once the user has navigated to the tab headings, they should be able to change tabs by using the <kbd>←</kbd> and <kbd>→</kbd> keys. Pressing the <kbd>HOME</kbd> and <kbd>END</kbd> keys should take them to the first and last tab.

## Accessible label

Pass a `label` to the `Tabs` component to improve the experience for assistive technology. For example, a group of settings tabs might be labeled like this:

```html
<tabs label="Website Settings Sections">
	<tab>...</tab>
	<tab>...</tab>
</tabs>
```

A `label` is not needed when the tabs immediately follow a heading which describes the tabs.

```html
<h1>Website Settings</h1>
<tabs>
	<tab>...</tab>
	<tab>...</tab>
</tabs>
```

## Open tab programmatically

Tabs listen for an `open-tab` event on the global event bus. To open a tab, fire this event and pass the tab `id`:

```js
pkp.eventBus.$emit('open-tab', 'publication')
```

This only works when the tab is visible. If the `publication` tab was nested inside of other tabs and was not visible, it would not be displayed. Consider the following code:

```html
<tabs>
	<tab id="hello" label="Hello">...</tab>
	<tab id="world" label="World">
		<tabs>
			<tab id="lorem" label="Lorem">...</tab>
			<tab id="ipsum" label="Ipsum">...</tab>
		</tabs>
	</tab>
</tabs>
```

If the `hello` tab is currently visible, firing `pkp.eventBus.$emit('open-tab', 'ipsum')` will not work, because its tab set is not currently visible.

## Icon-only Tab Buttons

Avoid using icon-only tabs except in rare cases. A text label is almost always easier to understand. You must still pass a `label` to a `Tab` when using the `icon` property. It will be read out by assistive technology.

## Deep Nesting

Avoid deeply nesting tabs. The deeper content is nested in tabs, the more work it takes to return to that content when the page is refreshed. Also, it is very difficult to navigate to deeply nested content programmatically.

Consider two levels a maximum. If you want to use more than two levels of tabs, discuss this with colleagues before proceeding.
