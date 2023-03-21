# localStorage

This mixin provides helper functions to read and write to the browser's [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Check whether the local storage is enabled in the browser before you read or write to it.

```js
import localStorage from '@/mixins/localStorage';

export default {
    mixins: [localStorage],
    data() {
        return {
            preferences: null,
        };
    },
    methods: {
        set(preferences) {
            if (this.isLocalStorageEnabled) {
                this.setLocalStorage('user-preferences', preferences);
            }
        },
        reset() {
            if (this.isLocalStorageEnabled) {
                this.removeLocaleStorage('user-preferences');
            }
        }
    },
    mounted() {
        if (this.isLocalStorageEnabled) {
            this.preferences = this.getLocalStorage('user-preferences');
        }
    }
}
```
