# CSRF Token

Any component which sends a `PUT`, `POST` or `DELETE` request to an application's REST API _must_ include a [CSRF token](https://en.wikipedia.org/wiki/Cross-site_request_forgery) in the header.

Whenever a user is logged in, you can access their CSRF token at `pkp.currentUser.csrfToken`. The code below demonstrates how to add this to the header of a jQuery ajax request.

```js
$.ajax({
	headers: {
		'X-Csrf-Token': pkp.currentUser.csrfToken
	},
	...
});
```