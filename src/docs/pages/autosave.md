# autosave

This mixin helps to add an autosave feature to a component. It implements a pattern to queue autosaves, process them, and handle loss of connection events. When there is no connection to the server, autosaves will be stored in local storage and replayed when the connection is restored. Autosaves can be restored even after the user has closed the browser and returned later.

## Required Properties

Every component that uses the autosave mixin must implement the following properties.

| Key | Description |
| --- | --- |
| `autosavesKey` | A unique key to store autosaves in local storage. The key must be unique to the action being saved. For example, the submission wizard uses an autosave key that includes the submission id to prevent collisions between autosaves for different submissions. |
| `i18nDiscardChanges` | A localized string for the button to discard changes when unsaved changes are found. |
| `i18nUnsavedChanges` | A localized string for the title of the dialog that appears when unsaved changes are found in local storage. |
| `i18nUnsavedChangesMessage` | A localized string for the message of the dialog that appears when unsaved changes are found in local storage. |

## Required Methods

Every component that uses this mixin must implement the following methods.

| Name | Description |
| --- | --- |
| `addAutosaves()` | This method is called whenever the autosave mixin thinks that stale data may need to be autosaved. It should check for any stale data and use `addAutosave()` to add any data that needs to be saved. See usage guidance below. |
| `restoreStoredAutosave(payload)` | This method is called whenever autosaves stored in local storage are replayed. Use this method to update the UI with the data from the stored autosaves. For example, if a stored autosave included a change to the title that was never saved, you may need to apply this change to a title field in a form on the page. |

## Optional Methods

Every component that uses this mixin may add the following methods used by this mixin.

| Name | Description |
| --- | --- |
| `autosaveSucceeded(payload, response)` | This method is called whenever an autosave succeeds. Use this method to sync response data from the server with state data. |
| `autosaveErrored(payload, xhr, status)` | This method is called whenever an autosave fails. Use this method to display a warning or handle authentication errors, for example if a user has been logged out. Not all errors need an action. For example, this method will be called when connection is lost. But the mixin should handle such scenarios by itself. |



## Usage

Import the mixin and add an autosave whenever data changes.

```js
import autosave from '@/mixins/autosave';

export default {
    mixins: [autosave],
    props: ['name', 'email'],
    data() {
        return {
            autosavesKey: 'example',
            i18nDiscardChanges: 'Discard Changes',
            i18nUnsavedChanges: 'Unsaved Changes',
            i18nUnsavedChangesMessage: 'We found unsaved changes from {$when}. Would you like to restore those changes now?',
        };
    },
    methods: {
        addAutosaves() {
            if (/* data is stale */) {
                this.formChanged();
            }
        },
        restoreStoredAutosave(payload) {
            this.name = payload.data.name ?? this.name;
            this.email = payload.data.email ?? this.email;
        },
        formChanged() {
            this.addAutosave(
                'nameChanged',
                'https://example.org/api/v1/users/1,
                {
                    name: this.name,
                    email: this.email,
                }
            );
        }
    }
}
```

Usually, you don't want to autosave as soon as data changes. Someone typing a name with 20 characters will send 20 HTTP requests. Use `debounce` to only send an autosave after the user stops changing the data.

```js
import autosave from '@/mixins/autosave';
import debounce from 'debounce';

export default {
    mixins: [autosave],

    ...

    methods: {

        formChanged: debounce(
            function() {
                this.addAutosave(
                    'nameChanged',
                    'https://example.org/api/v1/users/1,
                    {
                        name: this.name,
                        email: this.email,
                    }
                );
            },
            5000 // Wait until input has stopped for 5 seconds
        )
    }
}
```



