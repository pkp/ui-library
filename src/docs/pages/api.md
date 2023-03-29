# API

The UI Library makes use of the application's [REST API](https://docs.pkp.sfu.ca/dev/api/) to read and write data. Usually, components in the library will use cookie-based authentication and make requests to URLs provided as state data to the [Page](#/pages/pages). In addition, please consider the following when working with the API.

## CSRF Token

Any component which sends a `PUT`, `POST` or `DELETE` request to the application's REST API _must_ include a [CSRF token](https://en.wikipedia.org/wiki/Cross-site_request_forgery) in the header.

Whenever a user is logged in, you can access their CSRF token at `pkp.currentUser.csrfToken`. The code below demonstrates how to add this to the header of a jQuery ajax request.

```js
$.ajax({
	headers: {
		'X-Csrf-Token': pkp.currentUser.csrfToken
	},
	...
});
```

The code below demonstrates how to add this head to [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

```js
fetch(
	'https://...',
	{
		method: 'POST',
		headers: {
			'X-Csrf-Token': pkp.currentUser.csrfToken
		}
	}
);
```

## PUT and DELETE requests

Certain server configurations do not allow `PUT` and `DELETE` requests. To ensure the application can be used in these environments, use the `X-Http-Method-Override` header in all `PUT` and `DELETE` ajax requests. The code below demonstrates how to add this header to a jQuery ajax request.

```js
$.ajax({
    method: 'POST',
	headers: {
		'X-Csrf-Token': pkp.currentUser.csrfToken,
        'X-Http-Method-Override': 'PUT',
	},
	...
});
```

The code below demonstrates how to add this head to [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

```js
fetch(
	'https://...',
	{
		method: 'POST',
		headers: {
			'X-Csrf-Token': pkp.currentUser.csrfToken
            'X-Http-Method-Override': 'PUT',
		}
	}
);
```

Learn more about how to [contribute new components](#/pages/contributing).
