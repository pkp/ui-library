
A special field for selecting keywords, subjects and other controlled vocabulary. This field extends [FieldAutosuggest](#/component/Form/fields/FieldAutosuggest).

It overrides the `getSuggestions()` method in order to pass a unique `locale` param with each locale-specific instance of the multilingual fields.