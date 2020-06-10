# Container

A `Container` is a root component to initialize Vue.js in a template. In most cases this is not needed. Instead, a `Page` component is automatically initialized on every page in the editorial backend. Learn more about [Pages](#/component/Page).

However, it may be necessary to initialize Vue.js in a template that doesn't yet support the `Page` component. This is the case when content is loaded into a modal in the older JS framework.

## Integration with legacy JavaScript framework

The following describes how to use the `Container` directly when integrating with an old modal.

In the example below, the `Container` component treats the content of the `#example-container-{$uuid}` DOM element as the template. It creates a `<pkp-form>` component and passes the value of `this.components.masthead` as props.

```html
{assign var="uuid" value=""|uniqid|escape}
<div id="example-container-{$uuid}">
	<pkp-form
		v-bind="components.masthead"
		@set="set"
	/>
</div>
<script type="text/javascript">
	pkp.registry.init('example-container-{$uuid}', 'Container', {$exampleData|json_encode});
</script>
```

This is the same as mounting a Vue app to the DOM as recommended in Vue's documentation.

```js
var app = new Vue({
	...Container,
	el: '#example-container-<uuid>',
	data: exampleContainerDataInJsonFormat
})
```

We mount Vue apps using `pkp.registry.init` to make sure that Vue components mounted inside of our legacy JavaScript toolkit do not cause memory leaks.

## Child Components

Attach as many components to a `Container` as you would like, by passing a `components` array with the initial data.

```php
$templateMgr->assign('exampleData', [
	'components' => [
		'masthead' => [...],
		'submissions' => [...],
	]
]);
```
```html
{assign var="uuid" value=""|uniqid|escape}
<div id="example-container-{$uuid}">
	<pkp-form
		v-bind="components.masthead"
		@set="set"
	/>
	<submissions-list-panel
		v-bind="components.submissions"
		@set="set"
	/>
</div>
<script type="text/javascript">
	pkp.registry.init('example-container-{$uuid}', 'Container', {$exampleData|json_encode});
</script>
```