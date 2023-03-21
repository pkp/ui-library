## Data

This is a root component. Learn about [page hydration](#/pages/pages).

| Key | Description |
| --- | --- |
| `breadcrumbs` | An array of objects defining a breadcrumb to display above main page content. |
| `components` | A key/value object with component data to manage. See [Managing Components](#/component/Page#managing-components) |
| `isLoading` | Set this to `true` to show a full-screen loading [Spinner](#/component/Spinner). |
| `menu` | An array items for the main navigation menu |
| `notifications` | An array of toast-style notifications to display. Default: `[]`. See [Notify](#/utilities/Notify) |
| `notificationInterval` | Used internally to clear notifications. Do not set this manually. |
| `tasksUrl` | The URL to load the tasks grid modal. |
| `unreadTasksCount` | The current number of unread tasks. |

## Usage

This component is a root component which is used to render a page of the editorial backend. It manages the layout architecture, including the main navigation menu, tasks and user navigation dropdown. Nothing is needed to load the `Page` component. It is initialized automatically for every page in the editorial backend. Learn more about the [application's frontend](https://docs.pkp.sfu.ca/dev/documentation/en/frontend), including how to [initialize state](https://docs.pkp.sfu.ca/dev/documentation/en/frontend-ui-library#state).

## URL Hash

When the URL's `#hash` changes, this component will fire a method, `openUrlHash()`. By default, this will emit an event to open a tab. Override this method to implement other behavior, like changing the step in a [step-by-step wizard](#/component/Steps), in other page components.

```html
<script>
import Page from '@/components/Container/Page.vue';

export default {
    extends: Page,
    methods: {
        openUrlHash() {
            const hash = window.location.hash.replace('#', '');
            // use hash to navigate somewhere
        }
    }
}
```
