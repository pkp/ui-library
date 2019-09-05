
Use this component to display content in tabs.

## Accessible label

Pass a `label` to the `Tabs` component to improve the experience for assistive technology. For example, a group of settings tabs might be labeled like this:

```
<tabs label="Website Settings Sections">
	<tab>...</tab>
	<tab>...</tab>
</tabs>
```

A `label` is not needed when the tabs immediately follow a heading which describes the tabs. Otherwise a `label` should be used.

## Icon-only Tab Buttons

Avoid using icon-only tabs except in rare cases. A text label is almost always easier to understand.

You must still pass a `label` to a `Tab` when using the `icon` property. It will be read out by assistive technology.

## Deep Nesting

Avoid deeply nesting tabs. The deeper content is nested in tabs, the more work it takes to return to that content when the page is refreshed. Also, it is very difficult to navigate to deeply nested content programmatically.

Consider two levels a maximum. If you want to use more than two levels of tabs, discuss this with colleagues before proceeding.
