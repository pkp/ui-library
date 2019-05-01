# Container

The `Container` is the root component. Whenever mounting Vue apps in OJS or OMP, you must use a `Container` or one of the other `Container` elements.

The `Container` element does not have a preset template. It will render whatever template it is mounted to.

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

In this example, the `Container` component treats the content of the `#example-container-{$uuid}` DOM element as the template. It creates a `<pkp-form>` component and passes the value of `this.components.masthead` as props.

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

A `Container` is typically used to compose components together into a working app. However, they must also be used when injecting a single Vue.js component into an existing template in the legacy UI system, such as a modal.

## Data Management

`Container` components exist to manage data for child components. Read about [organizing components in Vue.js](https://vuejs.org/v2/guide/components.html#Organizing-Components).

A child component can update data in the `Container` by emitting a `set` event:

```js
this.$emit('set', this.id, {items: newItems});
```
