
A wrapper component that manages `data` for nested components. It will display any components nested inside of it's outer element, such as this example from the OJS and OMP settings.

```html
{assign var="uuid" value=""|uniqid|escape}
<div id="settings-context-{$uuid}">
	<tabs>
		<tab name="Masthead">
			<pkp-form
				v-bind="components.{$smarty.const.FORM_MASTHEAD}"
				@set="set"
			/>
		</tab>
		<tab name="Contact">
			<pkp-form
				v-bind="components.{$smarty.const.FORM_CONTACT}"
				@set="set"
			/>
		</tab>
	</tabs>
</div>
<script type="text/javascript">
	pkp.registry.init('settings-context-{$uuid}', 'Container', {$settingsData|json_encode});
</script>
```

Components nested inside of a `Container` can update their `data` by emitting a `set` event with the `data` that would like to change. An example usage from `ListPanel` is below.

```js
this.$emit('set', this.id, {items: newItems});
```
