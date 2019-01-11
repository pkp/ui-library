# Usage Guide

This UI Library uses [Vue](https://vuejs.org/), a JavaScript library for building interactive applications. If you're not familiar with Vue, read its [usage guide](https://vuejs.org/v2/guide/) before continuing.

## Working with OJS and OMP

OJS and OMP load this library as a submodule under `/lib/ui-library/`. In `/js/load.js`, each application loads the components it needs from the UI Library.

When you are using OJS or OMP from a distributed release package, you will only have a pre-compiled `/js/build.js` file. You will not have the full component library under `/lib/ui-library/`.

If you want to make changes to the components, you will need to use the development repository for [OJS](https://github.com/pkp/ojs) or [OMP](https://github.com/pkp/omp). Follow the steps described there to setup and install the application.

## Compiling for OJS and OMP

To compile the `/js/build.js` file while you are working on the library, run the following command from OJS or OMP's root directory.

```bash
npm run serve
```

When you are done, run the following command to compile an optimized `/js/build.js` for production.

```bash
npm run build
```

## Display Apps

An "App" is a Vue component that manages `data` and passes `props` to child components. Wherever you want to use a component in OJS or OMP, it must be wrapped inside of an App.

Read about [parent components, data, props and events in Vue](https://vuejs.org/v2/guide/components.html#Organizing-Components).

You can place an App into any template in OJS or OMP.

```html
{assign var="uuid" value=""|uniqid|escape}
<div id="my-submission-list-handler-{$uuid}">
	<script type="text/javascript">
		pkp.registry.init('my-submission-list-handler-{$uuid}', 'SubmissionsListPanel', {$myQueueListData|json_encode});
	</script>
</div>
```

This creates a `SubmissionsListPanel` app. Initial data is passed to the component through `$myQueueListData`, a JSON object which is merged with the component's `data` property.

This is exactly the same as mounting a Vue app to the DOM as recommended in Vue's documentation.

```js
var app = new Vue({
	...SubmissionsListPanel,
	el: '#my-submission-list-handler-<uuid>',
	data: myQueueListDataInJsonFormat
})
```

We use `pkp.registry.init` to make sure that Vue components mounted inside of our legacy JavaScript toolkit do not cause memory leaks.

## Passing events between Apps

When two Apps need to communicate with each other, you can use the global event bus. The event bus is an instance of Vue so you can use the same [events API](https://vuejs.org/v2/api/#Instance-Methods-Events) as any other component.

Send a global event.

```js
pkp.eventBus.$emit('submissionUpdated', submission);
```

Respond to a global event.

```js
pkp.eventBus.$on('submissionUpdated', function (submission) {
		this.submission = submission;
});
```

## Translations

This library uses a common prop, `i18n`, to pass translation strings from component to component. Usually the `i18n` prop is passed in from the server side when the App component is created.

When the `i18n` prop is available in any component, you can access it normally.

```js
var label = this.i18n.label
```

If you need to merge values dynamically with a translated string, you can use the `__()` helper method.

```js
// this.i18n.label = 'Decline {$submissionTitle}'
var label = this.__('label', {submissionTitle: this.title});
```

You can also use this method in component templates.

```html
<button>
	{{ __('label', {submissionTitle: title}) }}
</button>>
```

Notice that `this` is dropped when invoking the method and properties in templates.

## Multiple Languages

All PKP applications are multilingual. Multilingual fields in objects are provided as a JSON object with keys specifying the locale codes. The following response shows the title property of a submission in English and Canadian French.

```js
{
	"title": {
		"en_US": "Young people from an immigrant background and their choice of post-secondary orientation in Montreal",
		"fr_CA": "Jeunes issus de l’immigration et choix d’orientation au postsecondaire à Montréal"
	},
	...
}
```

All components include a helper method, `localize()`, which helps you retrieve a value in the correct language.

```js
var title = this.localize(this.title);
```

This will return the value in the user's current language or the primary language of the site. If it doesn't exist in either of these locales, it will return the first locale it finds.

You can also request a specific locale.

```js
var title = this.localize(this.title, 'fr_CA');
```

## CSRF Token

Any component which sends a `PUT`, `POST` or `DELETE` request to an OJS or OMP API endpoint _must_ include a [CSRF token](https://en.wikipedia.org/wiki/Cross-site_request_forgery) in the header.

You will need to generate the CSRF token on the server and pass it to your component. You can then add this to the header of a jQuery ajax request.

```js
$.ajax({
	headers: {
		'X-Csrf-Token': this.csrfToken,
	},
	...
});
```

## Global Vue Instance

You may want to modify the global Vue object. This may be necessary if you:

- Add custom components
- Use third-party plugins
- Add global mixins

You can access the global Vue object at `pkp.Vue`.

If a Vue plugin tells you it should be registered with `Vue.use(...)`, you can use `pkp.Vue.use(...)`.

*Your intervention will likely happen before Apps are instantiated and mounted, but after the global event bus is instantiated.*
