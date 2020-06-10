## Usage

Notify the user when something changes by emitting a `notify` event on the global event bus.

```js
pkp.eventBus.$emit('notify', 'The DOI for this submission has been scheduled for deposit.');
```

Use the `success` status to indicate an action has finished successfully.

```js
pkp.eventBus.$emit('notify', 'The submission has been published.', 'success');
```

Use the `warning` status to indicate an action that has failed or which may need to be corrected by the user.

```js
pkp.eventBus.$emit('notify', 'An ORCID is required for all authors.', 'error');
```

The notifications will disappear after a few seconds, unless the user is hovering their mouse over the notification. Pass the `clear-all-notify` event if you need to clear all the events off the screen immediately.

```js
pkp.eventBus.$emit('clear-all-notify');
```

A [Page](#/component/Page) must be present in order to receive the event and display the notification. This should be available on every page in the editorial backend.

## Accessibility

These notifications should not contain actions such as buttons or links. The notification will be read out by a screen reader, but some users will not be able to navigate to the notification to perform an action before it disappears.