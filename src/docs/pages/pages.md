# Pages

The [Page](#/component/Page) component is the root component of every page in the application. It supports the main navigation menus and implements the default layout of the editorial backend. Every `Page` component can use the utilities and global components without importing them.

```html
<template>
    <pkp-button @click="saveForm">
        {{ __('common.save') }}
    <pkp-button>
</template>
```

In order to use other components on a page, create a new component that extends the `Page` component.

```html
<template>
    <button-row>
        <pkp-button :is-warning="true" @click="cancel">
            {{ __('common.cancel') }}
        <pkp-button>
        <pkp-button @click="saveForm">
            {{ __('common.save') }}
        <pkp-button>
    </button-row>
</template>

<script>
import ButtonRow from '../components/ButtonRow/ButtonRow.vue';
import Page from '../components/Page/Page.vue';

export default {
    extends: Page,
    components: {
        ButtonRow
    }
}
</script>
```

In practice, `Page` components are usually written without templates. Instead, the application provides the template and the `Page` component is mounted onto the template at run-time. This supports [hydration](https://en.wikipedia.org/wiki/Hydration_(web_development)) and allows plugins to modify the server-side templates. Learn more in the [frontend documentation](https://docs.pkp.sfu.ca/dev/documentation/en/frontend-pages).

Because the template is not built into the `Page` component, it can be difficult to work with pages in the UI Library. Use a [demo component](#/pages/contributing) to build and test `Page` components in the UI Library with a template. First, create the `Page` component without a template.

```html
<script>
import ButtonRow from '../components/ButtonRow/ButtonRow.vue';
import Page from '../components/Page/Page.vue';

export default {
    name: 'ActionsPage',
    extends: Page,
    components: {
        ButtonRow
    },
    methods: {
        cancel() {
            // ...
        },
        saveForm() {
            // ...
        }
    }
}
</script>

<style lang="less">
@import '../../styles/_import';

.actions__example-button-row {
    margin-top: 4rem;
}
```

Then create a demo component that uses that `Page` component along with the template and data.

```html
<template>
	<div class="app__page">
        <h1>Example Page Title</h1>
        <button-row class="actions__example-button-row">
            <pkp-button :is-warning="true" @click="cancel">Cancel<pkp-button>
            <pkp-button @click="saveForm">Save<pkp-button>
        </button-row>
    </div>
</template>

<script>
import ActionsPage from '@/components/Container/ActionsPage.vue';

export default {
    extends: ActionsPage,
    data() {
        return {
            // example data for the root component
        }
    }
}
</script>
```

Learn about how to work with [multilingual data](#/pages/localization).
