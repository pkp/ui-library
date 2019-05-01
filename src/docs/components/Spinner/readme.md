
Use this component to display a loading animation when the user is waiting for a request to finish.

When the DOM changes, there must be some way for a screen reader to receive that information. Usually, this requires the use of the `aria-live` attribute.

The following sections describe typical use-cases and how updates should be reported for each case.

### Updating a list

A `Spinner` may be used when a list is being searched, filtered or moved to the next page. When the request is finished the list is updated with a different set of items.

In this case, the list should use the `aria-live` attribute to ensure that changes to the list are reported to a screen reader when the request is finished.

If the request was not initiated at the user's direction, the loading status must be indicated when the request begins so that the user knows what is happening.

### Editing an item

A `Spinner` may be used when an edit action is being completed. When the request is finished the item details will change.

In this case, the item should use the `aria-live` attribute to ensure that the changes are reported to a screen reader when the request is finished.

If the item is in a list with the `aria-live` attribute, the item itself does not need to be wrapped in a `aria-live` attribute.

### Deleting an item

A `Spinner` may be used when something is being deleted. When the request is finished the item will be removed from view.

In this case, the item should exist within an element that includes the `aria-live` attribute (such as a list).

If the deleted item is not within an element that includes the `aria-live` attribute, the deletion should be reported in some part of the UI that includes an `aria-live` attribute to ensure that the request success is accessible to a screen reader.

### Loading something

A `Spinner` may be used when some part of the UI is being loaded for the first time. When the request is finished, an "empty" area of the UI will be filled with content.

In this case, the spinner should be accompanied by text which describes what is loading, such as "Loading submissions".

The parent element should be have an `aria-live` attribute to ensure that the updates are reported to a screen reader when the request is finished.