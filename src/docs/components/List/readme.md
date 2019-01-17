
Use this component to display simple lists of content that should be grouped together.

Lists use [component slots](https://vuejs.org/v2/guide/components.html#Content-Distribution-with-Slots) which allow you to compose lists directly in the template. Wrap any content in a `<list>` and `<list-item>` like this:

```html
<list>
	<list-item>
		Anything <em>goes</em> here.
	</list-item>
</list>
```

You can also use other components inside a `<list-item>`.

```html
<list>
	<list-item>
		<pkp-button @click="click">Submit</pkp-button>
	</list-item>
</list>
```

Pass a short piece of information to the `value` slot and it will appear in a consistent style.

```html
<list>
	<list-item>
		<template slot="value">
			<icon icon="comment-o" :inline="true" /> 32
		</template>
		Number of active discussions in this journal.
	</list-item>
</list>
```


## Usage Recommendations

If one `value` slot includes an icon, all `value` slots should include icons. The user should be able to scan from top to bottom with all text aligned vertically on the left.
