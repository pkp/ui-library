# localizeMoment

This mixin provides a single helper function to map PKP's application locale codes to those used in [moment.js](https://momentjs.com/). When using moment, you should always use this method to localize the date.

```js
import moment from 'moment';
import localizeMoment from '@/mixins/localizeMoment';

export default {
    mixins: [localizeMoment],
    created() {
        const timeSince = moment(timestamp)
            .locale(
                this.getMomentLocale($.pkp.app.currentLocale)
            )
            .fromNow();
    }
}
```
