
Use this component to display content in tabs.

Full details about this component can be found in the [vue-tabs-component](https://github.com/spatie/vue-tabs-component).

## Nested Tabs

When nesting tabs, be sure to use the `useUrlFragment` option to prevent the `#tabName` anchor from being added. The URL anchor only works for top-level tabs. Consider the following:

```html
<tabs>
	<tab name="first">
		First tab content
	</tab>
	<tab name="second">
		<tabs>
			<tab name="second-a">
				Tab A Content
			</tab>
			<tab name="second-b">
				Tab B content
			</tab>
		</tabs>
	</tab>
</tabs>
```

When the `second-b` tab is visited at the URL `https://example.org`, the URL will be `https://example.org#second-b`. If this URL is copied, shared or refreshed, it will not return the visitor to the correct tab. It can only open the correct tab when the anchor points to a top-level tab.

Use the following to turn off the anchor for nested tabs.

```html
<tabs>
	<tab name="first">
		First tab content
	</tab>
	<tab name="second">
		<tabs :options="{ useUrlFragment: false }">
			<tab name="second-a">
				Tab A Content
			</tab>
			<tab name="second-b">
				Tab B content
			</tab>
		</tabs>
	</tab>
</tabs>
```

## Deep Nesting

Avoid deep nesting. The deeper content is nested, the more work it takes to return to that content when the page is refreshed. Also, it is very difficult to navigate to deeply nested content programmatically.

Consider two levels a maximum. If you need more, discuss this with others before proceeding.
