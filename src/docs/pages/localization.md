# Localization

Each application can be run in more than one language. This means that UI components must be localized. It also means that data used by the UI components may exist in more than one language.

## Locale Keys

Some common localized strings are available in the `pkp.localeKeys` global. Use the `__()` method in any component template.

<div class="inlinePreview">
	<button>
		Cancel
	</button>
</div>

```html
<template>
	<button>
		{{ __('common.cancel') }}
	</button>
</template>
```

Pass parameters to the localized keys by using the following.

<div class="inlinePreview">
	<button>
		Edit Daniel Barnes
	</button>
</div>

```html
<template>
	<button>
		{{ __('common.editItem', {item: 'Daniel Barnes'}) }}
	</button>
</template>
```

This method can be used in scripts too.

<div class="inlinePreview">
	<button>
		Edit
	</button>
	<button>
		Edit Daniel Barnes
	</button>
</div>

```html
<template>
	<button>
		{{ cancelLabel }}
	</button>
	<button>
		{{ editItemLabel }}
	</button>
</template>

<script>
export default {
	data() {
		return {
			name: 'Daniel Barnes'
		};
	},
	computed: {
		cancelLabel() {
			return this.__('common.cancel')
		},
		editItemLabel() {
			return this.__('common.editItem', {item: this.name})
		}
	}
}
</script>
```

This works for a few common strings that have been defined in `pkp.localeKeys`. This comes from the server and is configured in  `PKPTemplateManager`. For other localized strings, a component should accept them as a `prop`.

```html
<script>
export default {
	props: {
		i18nNewSubmission: String,
	}
}
</script>

<template>
	<button>
		{{ i18nNewSubmission }}
	</button>
</template>
```

## Multilingual Data

Multilingual data is usually provided as a JSON object. Each key holds the locale code. The following response shows the name property of a journal in English and Canadian French.

```js
{
	"name": {
		"en": "Journal of Public Knowledge",
		"fr_CA": "Journal de la connaissance du public"
	}
}
```

All components can use the following helper method to get a value in the current language of the UI or, as a fallback, the primary language of the journal, press or preprint server.

```js
var name = this.localize(this.name);
```

If the data doesn't exist in either of these locales, it will return the first locale it finds. Pass a second argument to ask for the value in a specific locale.

```js
var name = this.localize(this.name, 'fr_CA');
```

When working with submissions, a component should use the `localizeSubmission` mixin to localize submission data. This method will use the submission's primary language as the default value.

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

Learn more about how to write [accessible components](#/pages/accessibility).
