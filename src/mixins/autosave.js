/**
 * Autosave mixin
 *
 * This mixin helps components implement an autosave feature. It
 * provides a task runner that will look for data waiting to be
 * autosaved and process those autosaves. When connection with
 * the server is lost, it will store autosaves in LocalStorage
 * and replay those autosaves once reconnected.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * @see https://vuejs.org/v2/guide/mixins.html
 */
import dialog from './dialog';
import localizeMoment from './localizeMoment';
import localStorage from './localStorage';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

/**
 * The timer (setInterval) that calls _runAutosaveJobs
 */
let autosaveTimer = null;

/**
 * How often to check for a restored connnection when
 * the connection is dropped.
 *
 * This is increased with each failed attempt
 *
 * A number in milliseconds
 */
let connectionTimerInterval = 4000;

/**
 * Whether or not an autosave HTTP request has been
 * sent and we are waiting for a response
 */
let isAutosaveRequestPending = false;

export default {
	mixins: [dialog, localizeMoment, localStorage],
	data() {
		return {
			/**
			 * Is an autosave in progress?
			 */
			isAutosaving: false,

			/**
			 * Is the client disconnected from the server?
			 */
			isDisconnected: false,

			/**
			 * A timestamp when the last autosave occured
			 */
			lastSavedTimestamp: Date.now(),

			/**
			 * Autosave payloads that are in the queue waiting to be saved
			 */
			pendingAutosaves: [],
		};
	},
	methods: {
		/**
		 * Add an autosave to the pending autosaves
		 *
		 * @param {String} id Id of the payload. This can be anything but
		 *  is often the id of the form being saved.
		 * @param {String} url The URL to submit the autosave.
		 * @param {Object} data A key/value map of data to save.
		 */
		addAutosave(id, url, data) {
			this.pendingAutosaves.push({
				id: id,
				url: url,
				timestamp: Date.now(),
				data: data,
			});
		},

		/**
		 * Start the timer to check for autosaves
		 */
		startAutosaveTimer() {
			autosaveTimer = setInterval(this._runAutosaveJobs, 500);
		},

		/**
		 * Stop the timer to check for autosaves
		 */
		stopAutosaveTimer() {
			clearTimeout(autosaveTimer);
		},

		/**
		 * Get the next payload to autosave
		 */
		_getNextAutosave() {
			if (this.isLocalStorageEnabled) {
				let autosaves = this.getLocalStorage(this.autosavesKey) ?? [];
				if (autosaves.length) {
					const payload = autosaves.splice(0, 1)[0];
					this.setLocalStorage(this.autosavesKey, autosaves);
					return payload;
				}
			}

			if (this.pendingAutosaves.length) {
				return this.pendingAutosaves.splice(0, 1)[0];
			}
		},

		/**
		 * Initialize the autosave feature
		 *
		 * This method will check if unsaved autosaves exist
		 * in localStorage and apply them before starting the
		 * timer that processes autosave.
		 *
		 * This method should only be run once when the page
		 * loads.
		 */
		_initAutosave() {
			const storedAutosaves = this.getLocalStorage(this.autosavesKey) ?? [];
			if (!storedAutosaves.length) {
				this.startAutosaveTimer();
				return;
			}

			this.$nextTick(() => {
				this.openDialog({
					name: 'loadAutosave',
					title: this.i18nUnsavedChanges,
					message: this.i18nUnsavedChangesMessage.replace(
						'{$when}',
						moment(storedAutosaves[0].timestamp)
							.locale(this.getMomentLocale($.pkp.app.currentLocale))
							.fromNow()
					),
					actions: [
						{
							label: this.__('common.yes'),
							isPrimary: true,
							callback: (close) => {
								storedAutosaves.forEach(this.restoreStoredAutosave);
								this.removeLocaleStorage(this.autosavesKey);
								this.$nextTick(() => {
									this.addAutosaves();
									this.startAutosaveTimer();
									const waitForAutosaves = setInterval(() => {
										if (this.isAutosaving) {
											return;
										}
										clearInterval(waitForAutosaves);
										close();
									}, 2000); // 2 seconds so that autosaving can start before first check
								});
							},
						},
						{
							label: this.i18nDiscardChanges,
							isWarnable: true,
							callback: (close) => {
								this.removeLocaleStorage(this.autosavesKey);
								this.startAutosaveTimer();
								close();
							},
						},
					],
				});
			});
		},

		/**
		 * Process pending autosaves
		 *
		 * This method is run on a timer () and will
		 * only make a save request if there is a pending autosave
		 * and autosaving is not already in progress
		 */
		_runAutosaveJobs() {
			if (this.isDisconnected) {
				this._storePendingAutosaves();
			}

			if (this.isDisconnected || isAutosaveRequestPending) {
				return;
			}

			const payload = this._getNextAutosave();

			if (!payload) {
				// If the last autosave was more than a minute ago,
				// save their progress
				if (Date.now() - this.lastSavedTimestamp > 60000) {
					this.addAutosaves();
				}
				return;
			}

			this._sendAutosave(payload, {});
		},

		/**
		 * A callback method fired at regular intervals when
		 * connection to the server has been lost.
		 *
		 * It retries the last autosave until successful.
		 *
		 * The interval between checks is increased with every
		 * failure. So it checks after 4 seconds, then after 8
		 * seconds, then after 16 seconds, etc. The interval
		 * is never longer than 30 seconds
		 */
		_runReconnect() {
			if (!this.isDisconnected) {
				return;
			}
			setTimeout(() => {
				this._sendAutosave(this._getNextAutosave(), {
					success: (r) => {
						connectionTimerInterval = 4000;
						this.isDisconnected = false;
					},
					error: () => {
						if (connectionTimerInterval < 30000) {
							connectionTimerInterval = connectionTimerInterval * 2;
						}
						this._runReconnect();
					},
				});
			}, connectionTimerInterval);
		},

		/**
		 * Send an autosave request
		 *
		 * @param {Object} payload The autosave record
		 * @param {Object} config Config options for $.ajax()
		 */
		_sendAutosave(payload, config) {
			isAutosaveRequestPending = true;
			this.isAutosaving = true;

			const onSuccess = (r) => {
				if (typeof this.autosaveSucceeded === 'function') {
					this.autosaveSucceeded(payload, r);
				}
				this.lastSavedTimestamp = payload.timestamp;
			};

			const onError = (xhr, status) => {
				this.isDisconnected = true;
				this.isAutosaving = false;
				let autosaves = this.getLocalStorage(this.autosavesKey) ?? [];
				if (autosaves.length) {
					autosaves.unshift(payload);
				} else {
					autosaves = [payload];
				}
				this.setLocalStorage(this.autosavesKey, autosaves);
				if (typeof this.autosaveErrored === 'function') {
					this.autosaveErrored(payload, xhr, status);
				}
			};

			const onComplete = (r) => {
				isAutosaveRequestPending = false;
				let moreAutosaves = this.getLocalStorage(this.autosavesKey) ?? [];
				if (!moreAutosaves.length && !this.pendingAutosaves.length) {
					this.isAutosaving = false;
				}
			};

			config.success = config.success ? [onSuccess, config.success] : onSuccess;
			config.error = config.error ? [onError, config.error] : onError;
			config.complete = config.complete
				? [onComplete, config.complete]
				: onComplete;

			$.ajax({
				context: this,
				url: payload.url,
				method: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				data: payload.data,
				...config,
			});
		},

		/**
		 * Store any pending autosaves in local storage
		 */
		_storePendingAutosaves() {
			if (!this.isLocalStorageEnabled || !this.pendingAutosaves.length) {
				return;
			}
			let existingAutosaves = this.getLocalStorage(this.autosavesKey) ?? [];
			this.setLocalStorage(this.autosavesKey, [
				...existingAutosaves,
				...this.pendingAutosaves,
			]);
			this.pendingAutosaves = [];
		},
	},
	watch: {
		/**
		 * Run the reconnect handler when a lost connection is restored
		 */
		isDisconnected(newVal, oldVal) {
			if (newVal && newVal !== oldVal) {
				this._runReconnect();
			}
		},
	},
	created() {
		/**
		 * Throw an error if requirements are not implemented
		 * in the component using this mixin
		 */
		const err =
			'Missing required `{$prop}` property or callback function. See docs for autosave.js';
		[
			'autosavesKey',
			'i18nDiscardChanges',
			'i18nUnsavedChanges',
			'i18nUnsavedChangesMessage',
		].forEach((prop) => {
			if (typeof this[prop] === 'undefined') {
				throw new Error(err.replace('{$prop}', prop));
			}
		});
		['addAutosaves', 'restoreStoredAutosave'].forEach((method) => {
			if (typeof this[method] !== 'function') {
				throw new Error(err.replace('{$prop}', method));
			}
		});

		/**
		 * Set a client id even when LocalStorage is disabled
		 */
		if (!this.isLocalStorageEnabled) {
			this.clientId = uuidv4();
		}

		/**
		 * Initialize the autosave feature
		 */
		this._initAutosave();
	},
	destroyed() {
		this.stopAutosaveTimer();
	},
};
