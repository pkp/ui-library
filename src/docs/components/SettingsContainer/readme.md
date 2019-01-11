
A wrapper component that manages `data` for nested [Form](#/component/Form) components. This component will display any components nested inside of it's outer element, such as this example from the OJS and OMP settings.

```html
{assign var="uuid" value=""|uniqid|escape}
<div id="settings-context-{$uuid}">
	<tabs>
		<tab name="Masthead">
			<pkp-form
				v-bind="forms.{$smarty.const.FORM_MASTHEAD}"
				@set-fields="setFormFields"
				@set-errors="setFormErrors"
				@set-visible-locales="setFormVisibleLocales"
			/>
		</tab>
		<tab name="Contact">
			<pkp-form
				v-bind="forms.{$smarty.const.FORM_CONTACT}"
				@set-fields="setFormFields"
				@set-errors="setFormErrors"
				@set-visible-locales="setFormVisibleLocales"
			/>
		</tab>
	</tabs>
</div>
<script type="text/javascript">
	pkp.registry.init('settings-context-{$uuid}', 'Container', {$settingsData|json_encode});
</script>
```
