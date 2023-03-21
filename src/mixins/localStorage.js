/**
 * Local Storage mixin
 *
 * This mixin helps components work with the browser's local
 * storage data. It sets and re-uses a unique client id for
 * each browser, and checks whether local storage is disabled,
 * for example by user privacy settings.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * @see https://vuejs.org/v2/guide/mixins.html
 */
import {v4 as uuidv4} from 'uuid';

export default {
	data() {
		return {
			clientId: null,
			isLocalStorageEnabled: false,
		};
	},
	methods: {
		/**
		 * Set data in local storage
		 *
		 * @param {String} key Any key to store and retrieve data
		 * @param {mixed} value The data to store
		 */
		setLocalStorage(key, value) {
			localStorage.setItem(key, JSON.stringify(value));
		},

		/**
		 * Get data from local storage
		 *
		 * @param {String} key Any key to store and retrieve data
		 */
		getLocalStorage(key) {
			const value = localStorage.getItem(key);
			if (value !== null) {
				return JSON.parse(value);
			}
		},

		/**
		 * Remove data from local storage
		 *
		 * @param {String} key Any key to store and retrieve data
		 */
		removeLocaleStorage(key) {
			localStorage.removeItem(key);
		},

		/**
		 * Set the client id from local storage or create
		 * and save a new client id
		 */
		_setClientId() {
			const existingClientId = localStorage.getItem('clientId');
			this.clientId = existingClientId ?? uuidv4();
			if (!existingClientId) {
				localStorage.setItem('clientId', this.clientId);
			}
		},

		/**
		 * Test if local storage is supported by the user's browser
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
		 * @return {Boolean}
		 */
		_test() {
			try {
				const storage = window['localStorage'];
				const x = '__storage_test__';
				storage.setItem(x, x);
				storage.removeItem(x);
				return true;
			} catch (e) {
				return false;
			}
		},
	},
	created() {
		this.isLocalStorageEnabled = this._test();
		if (this.isLocalStorageEnabled) {
			this._setClientId();
		}
	},
};
