# Working with multiple languages

PKP's applications support multiple languages. This means that the application itself can be localized and that data can be entered in more than one language at a time.

## Localize text

Messages in the application which have been localized to the current user's language are available globally at `pkp.localeKeys`. Use the following to display a localized phrase in a component's template.

```js
{{ __('common.cancel') }}
```

This can be accessed from component methods by using the following.

```js
const cancel = this.__('common.cancel');
```

Pass parameters to the localized keys by using the following.

```js
{{ __('list.viewMore', {name: 'Daniel Barnes'}) }}
```

The application should provide all of the localized phrases necessary from the server. On the server side, a locale key can be added to a page with the following PHP code.

```php
$templateMgr = TemplateManager::getManager($request);
$templateMgr->setLocaleKeys([
	'common.cancel',
]);
```

## Multilingual content

Multilingual fields are provided as a JSON object with keys specifying the locale codes. The following response shows the name property of a journal in English and Canadian French.

```js
{
	"name": {
		"en_US": "Journal of Public Knowledge",
		"fr_CA": "Journal de la connaissance du public"
	},
	...
}
```

The following helper method is available for all components to help you retrieve a value in the correct language.

```js
var name = this.localize(this.name);
```

This will return the value in the user's current language or the primary language of the site. If it doesn't exist in either of these locales, it will return the first locale it finds.

You can also request a specific locale.

```js
var name = this.localize(this.name, 'fr_CA');
```

When working with submissions, a component should use the `localizeSubmission` mixin to localize submission data. This provides a method that will fallback to the submission's primary language rather than the primary language of the site.

```js
import localizeSubmission from '@/mixins/localizeSubmission';

export default {
	mixins: [localizeSubmission]
	props: ['submission', 'publication']
	computed: {
		title() {
			return this.localizeSubmission(publication.title, submission.locale);
		}
	}
}
```
