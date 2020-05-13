# Event Bus

Use the event bus to emit and react to global events in the application. This can be useful when you want disparate parts of the application to react to a common change.

For example, when a submission is deleted you may need to remove it from more than one list of submissions and remove any tasks related to it.

Use the following to emit a global event.

```json
pkp.eventBus.$emit('updated:email-template', {...});
```

Use the following to react to a global event.

```js
// Update an email template in a list when it changes
pkp.eventBus.$on('updated:email-template', (emailTemplate) => {
	this.templates = this.templates.map(template => {
		return template.key === emailTemplate.key
			? emailTemplate
			: template;
	});
});
```

Global event names should use kebab-case (`example-name`). When appropriate, use the following naming pattern.

```js
<event>:<object>
```

Examples include the following.

```js
added:announcement
updated:announcement
deleted:announcement
unpublished:publication
```

## Common global events

Use the following to react when a form is saved successfully.

```js
pkp.eventBus.$on('form-success', (formId, object) => {
	if (formId === pkp.const.FORM_METADATA) {
		// ... use the new data in `object`
	}
});
```

Use the following to react when a new tab has been selected.

```js
pkp.eventBus.$on('open-tab', tabId => {
	// ... react to `tabId` being opened
});
```

## When to use the global event bus

Use the global event bus whenever data changes, such as when `PUT` or `POST` requests are made, or when a `GET` request updates data that may be shared between components.

The global event bus is exposed to plugins and third-party code in the global `pkp` variable at `pkp.eventBus`. For this reason, it is an important tool for plugins which want to react to events in the browser.

Even if a global event will not used in the core application, it may be a good idea to emit one.