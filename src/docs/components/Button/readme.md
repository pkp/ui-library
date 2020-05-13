## Props

| Key | Description |
| --- | --- |
| `element` | Whether to use a `button` or `a` HTML tag. Default: `button` |
| `href` | URL when using a link element. `element` must be set to `a` |
| `isPrimary` | Use when this button represents the default or expected action in a group of actions. A single group of actions should never have more than one primary button. |
| `isWarnable` | Use when this button represents an action such as delete, go back, revert or cancel. |
| `isActive` | Use when the button controls another element, and that element is active. Think of it like an [On Air](https://www.google.co.uk/search?q=on+air+sign&tbm=isch) button. |
| `isLink` | Use when you want the button to look more like a traditional link than a button. |

## Events

| Key | Description |
| --- | --- |
| `click` | When the button is clicked. |
| `focus` | When the button receives focus. |
| `blur` | When focus moves away from the button. |

## Usage

Use this component to display a button for an action.

## Links vs Buttons

The link element, `<a>`, should only be used for actions which navigate away from the current page. When opening modals or performing actions on the same page, use the `<button>` element.

This is a good rule of thumb: if the URL changes when the action is clicked, use `<a>`. Otherwise, use `<button>`.
