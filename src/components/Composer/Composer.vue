<template>
	<panel class="composer">
		<panel-section>
			<template slot="header">
				<slot name="description" />
				<div
					v-if="emailTemplates.length || emailTemplatesApiUrl"
					class="composer__templates"
				>
					<div class="composer__templates__heading">
						{{ loadTemplateLabel }}
					</div>
					<ul class="composer__templates__list">
						<li
							v-for="emailTemplate in emailTemplates"
							:key="emailTemplate.key"
						>
							<button
								class="-linkButton"
								@click="loadTemplate(emailTemplate.key)"
							>
								{{ localize(emailTemplate.subject) }}
							</button>
						</li>
					</ul>
					<search
						v-if="emailTemplatesApiUrl"
						:searchLabel="findTemplateLabel"
						class="composer__templates__search"
						:searchPhrase="searchPhrase"
						@search-phrase-changed="
							newSearchPhrase => (this.searchPhrase = newSearchPhrase)
						"
					/>
					<ul
						v-if="searchResults.length"
						class="composer__templates__list"
						aria-live="true"
						:aria-label="searchResultsLabel"
					>
						<li
							v-for="searchResult in limitedSearchResults"
							:key="searchResult.key"
						>
							<button
								class="-linkButton"
								@click="loadTemplate(searchResult.key)"
							>
								{{ localize(searchResult.subject) }}
							</button>
						</li>
						<li v-if="searchResults.length > showSearchResultCount">
							<button
								class="-linkButton composer__templates__moreSearchResults"
								@click="showSearchResultCount = searchResults.length"
							>
								<icon icon="plus-circle" :inline="true" />
								{{
									moreSearchResultsLabel.replace(
										'{$number}',
										searchResults.length - showSearchResultCount
									)
								}}
							</button>
						</li>
					</ul>
					<div
						v-if="isSearching"
						class="composer__templates__searching"
						role="alert"
					>
						<spinner />
						{{ searchingLabel }}
					</div>
					<div v-if="otherLocales.length" class="composer__locales">
						{{ switchToLabel }}
						<template v-for="(otherLocale, i) in otherLocales">
							<button
								v-if="locale !== otherLocale.locale"
								:key="otherLocale.locale"
								class="-linkButton"
								@click="openSwitchLocale(otherLocale.locale)"
							>
								{{ otherLocale.name }}
							</button>
							<template v-if="i < otherLocales.length - 1">
								{{ __('common.commaListSeparator') }}
							</template>
						</template>
					</div>
				</div>
			</template>
			<div class="composer__message">
				<div class="composer__recipients__wrapper">
					<field-autosuggest-preset
						class="composer__recipients"
						name="to"
						:label="recipientsLabel"
						:isLabelInline="true"
						:deselectLabel="deselectLabel"
						:all-errors="errors"
						groupId="composer"
						:formId="id"
						:selectedLabel="recipientsLabel"
						:options="localizedRecipientOptions"
						:selected="recipientsSelected"
						:value="recipients"
						:is-disabled="!canChangeRecipients"
						@change="changeRecipients"
					/>
					<button
						v-if="!ccIsEnabled"
						class="composer__ccToggle -linkButton"
						ref="ccButtons"
						@click="enableCC"
					>
						{{ addCCLabel }}
					</button>
				</div>
				<div
					v-if="ccIsEnabled"
					class="composer__text"
					:class="{'composer__text--focus': isFocused === 'cc'}"
					@click="setFocusToRef('cc')"
				>
					<label :for="id + '-cc'">{{ ccLabel }}</label>
					<input
						type="text"
						name="cc"
						:id="id + '-cc'"
						v-model="ccBinded"
						:aria-described-by="!!errors.cc ? id + '-cc-error' : ''"
						:aria-invalid="!!errors.cc"
						@focus="() => (this.isFocused = 'cc')"
						@blur="() => (this.isFocused = '')"
					/>
				</div>
				<field-error
					v-if="errors.cc"
					:id="id + '-cc-error'"
					:messages="errors.cc"
				/>
				<div
					v-if="ccIsEnabled"
					class="composer__text"
					:class="{'composer__text--focus': isFocused === 'bcc'}"
					@click="setFocusToRef('bcc')"
				>
					<label :for="id + '-bcc'">{{ bccLabel }}</label>
					<input
						type="text"
						name="bcc"
						:id="id + '-bcc'"
						v-model="bccBinded"
						:aria-described-by="!!errors.bcc ? id + '-bcc-error' : ''"
						:aria-invalid="!!errors.bcc"
						@focus="() => (this.isFocused = 'bcc')"
						@blur="() => (this.isFocused = '')"
					/>
				</div>
				<field-error
					v-if="errors.bcc"
					:id="id + '-bcc-error'"
					:messages="errors.bcc"
				/>
				<div
					class="composer__text"
					:class="{'composer__text--focus': isFocused === 'subject'}"
					@click="setFocusToRef('subject')"
				>
					<label :for="id + '-subject'">{{ subjectLabel }}</label>
					<input
						type="text"
						name="subject"
						:id="id + '-subject'"
						v-model="subjectBinded"
						:aria-described-by="!!errors.subject ? id + '-subject-error' : ''"
						:aria-invalid="!!errors.subject"
						@focus="() => (this.isFocused = 'subject')"
						@blur="() => (this.isFocused = '')"
					/>
				</div>
				<field-error
					v-if="errors.subject"
					:id="id + '-subject-error'"
					:messages="errors.subject"
				/>
				<field-prepared-content
					class="composer__body"
					name="body"
					:label="bodyLabel"
					groupId="message"
					primaryLocale="en_US"
					:all-errors="errors"
					:formId="id"
					plugins="link"
					size="large"
					toolbar="bold italic superscript subscript | link"
					:value="body"
					:preparedContent="compiledVariables"
					:insertLabel="insertLabel"
					:insertModalLabel="insertModalLabel"
					:preparedContentLabel="insertContentLabel"
					:searchLabel="insertSearchLabel"
					@change="(name, prop, value) => this.emitChange({body: value})"
				/>
				<div v-if="attachers.length" class="composer__attachmentWrapper">
					<pkp-button
						:is-link="true"
						ref="attachFiles"
						@click="$modal.show(fileAttacherModalId)"
					>
						<icon icon="paperclip" :inline="true" />
						{{ attachFilesLabel }}
					</pkp-button>
					<modal
						:closeLabel="__('common.close')"
						:name="fileAttacherModalId"
						:title="attachFilesLabel"
						@closed="resetFocusAfterAttachment"
					>
						<file-attacher
							:attachers="attachers"
							@attached:files="addAttachments"
						/>
					</modal>
					<div v-if="attachments.length" class="composer__attachments">
						<span class="-screenReader">
							{{ attachedFilesLabel }}
						</span>
						<badge
							v-for="(attachment, i) in attachments"
							:key="i"
							class="composer__attachment"
						>
							<icon
								:icon="getDocumentTypeIcon(attachment)"
								:inline="true"
								class="composer__attachment__documentType"
							/>
							{{ attachment.name }}
							<button
								class="composer__attachment__remove"
								@click="removeAttachment(i)"
							>
								<icon icon="times" />
								<span class="-screenReader">
									{{ removeItemLabel.replace('{$item}', attachment.name) }}
								</span>
							</button>
						</badge>
					</div>
				</div>
				<field-error
					v-if="errors.attachments"
					:id="id + '-attachments-error'"
					:messages="errors.attachments"
				/>
				<div
					v-if="isLoadingTemplate"
					class="composer__loadingTemplateMask"
					role="alert"
				>
					<spinner />
					<span class="-screenReader">{{ __('common.loading') }}</span>
				</div>
			</div>
		</panel-section>
	</panel>
</template>

<script>
import FieldAutosuggestPreset from '@/components/Form/fields/FieldAutosuggestPreset.vue';
import FieldError from '@/components/Form/FieldError.vue';
import FieldPreparedContent from '@/components/Form/fields/FieldPreparedContent.vue';
import FileAttacher from '@/components/FileAttacher/FileAttacher.vue';
import Modal from '@/components/Modal/Modal.vue';
import Search from '@/components/Search/Search.vue';
import ajaxErrorCallback from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog';
import preparedContent from '@/mixins/preparedContent';

export default {
	name: 'Composer',
	mixins: [ajaxErrorCallback, dialog, preparedContent],
	components: {
		FieldAutosuggestPreset,
		FieldError,
		FieldPreparedContent,
		FileAttacher,
		Modal,
		Search
	},
	props: {
		addCCLabel: {
			type: String,
			required: true
		},
		attachers: {
			type: Array,
			default() {
				return [];
			}
		},
		attachments: {
			type: Array,
			default() {
				return [];
			}
		},
		attachFilesLabel: {
			type: String,
			required: true
		},
		attachedFilesLabel: {
			type: String,
			required: true
		},
		bcc: {
			type: String,
			default() {
				return '';
			}
		},
		bccLabel: {
			type: String,
			required: true
		},
		body: {
			type: String,
			default() {
				return '';
			}
		},
		bodyLabel: {
			type: String,
			required: true
		},
		canChangeRecipients: {
			type: Boolean,
			default() {
				return true;
			}
		},
		cc: {
			type: String,
			default() {
				return '';
			}
		},
		ccLabel: {
			type: String,
			required: true
		},
		confirmSwitchLocaleLabel: {
			type: String,
			required: true
		},
		deselectLabel: {
			type: String,
			required: true
		},
		emailTemplates: {
			type: Array,
			default() {
				return [];
			}
		},
		emailTemplatesApiUrl: {
			type: String,
			default() {
				return '';
			}
		},
		errors: {
			type: Object,
			default() {
				return {};
			}
		},
		findTemplateLabel: {
			type: String,
			required: true
		},
		id: {
			type: String,
			default() {
				return 'composer';
			}
		},
		initialTemplateKey: {
			type: String,
			default() {
				return '';
			}
		},
		insertLabel: {
			type: String,
			required: true
		},
		insertModalLabel: {
			type: String,
			required: true
		},
		insertContentLabel: {
			type: String,
			required: true
		},
		insertSearchLabel: {
			type: String,
			default() {
				return '';
			}
		},
		loadTemplateLabel: {
			type: String,
			required: true
		},
		locale: {
			type: String,
			required: true
		},
		locales: {
			type: Array,
			default() {
				return [];
			}
		},
		moreSearchResultsLabel: {
			type: String,
			required: true
		},
		recipients: {
			type: Array,
			default() {
				return [];
			}
		},
		recipientsLabel: {
			type: String,
			required: true
		},
		recipientOptions: {
			type: Array,
			required: true
		},
		removeItemLabel: {
			type: String,
			required: true
		},
		searchingLabel: {
			type: String,
			required: true
		},
		searchResultsLabel: {
			type: String,
			required: true
		},
		subject: {
			type: String,
			default() {
				return '';
			}
		},
		subjectLabel: {
			type: String,
			required: true
		},
		switchToLabel: {
			type: String,
			required: true
		},
		switchToNamedLanguageLabel: {
			type: String,
			required: true
		},
		variables: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			ccIsEnabled: false,
			isFocused: '',
			isLoadingTemplate: false,
			isSearching: false,
			latestSearchRequest: '',
			searchPhrase: '',
			searchResults: [],
			showSearchResultCount: 10
		};
	},
	computed: {
		bccBinded: {
			get() {
				return this.bcc;
			},
			set(newVal) {
				this.emitChange({bcc: newVal});
			}
		},
		ccBinded: {
			get() {
				return this.cc;
			},
			set(newVal) {
				this.emitChange({cc: newVal});
			}
		},
		compiledVariables() {
			return !this.canChangeRecipients
				? this.localizedVariables
				: [
						...this.localizedVariables,
						{
							key: 'recipientName',
							value: this.recipientVariable,
							description:
								this.localizedVariables.find(v => v.key === 'recipientName')
									?.description ?? ''
						}
				  ];
		},
		fileAttacherModalId() {
			return this.id + 'fileAttacher';
		},
		limitedSearchResults() {
			return this.searchResults.slice(0, this.showSearchResultCount);
		},
		localizedRecipientOptions() {
			const locale = this.locale ?? $.pkp.app.currentLocale;
			return this.recipientOptions.map(recipient => {
				return {
					value: recipient.value,
					label: recipient.label[locale]
				};
			});
		},
		localizedVariables() {
			return this.variables[this.locale] ? this.variables[this.locale] : [];
		},
		/**
		 * A list of supported locales without the currently active locale
		 */
		otherLocales() {
			return this.locales.filter(locale => locale.locale !== this.locale);
		},
		/**
		 * The names of all the recipients separated by a comma
		 */
		recipientVariable() {
			let name = this.recipientsSelected
				.map(recipient => recipient.label)
				.join(this.__('common.commaListSeparator'));
			if (!name) {
				return '{$recipientName}';
			}
			return name;
		},
		subjectBinded: {
			get() {
				return this.subject;
			},
			set(newVal) {
				this.emitChange({subject: newVal});
			}
		},
		/**
		 * The recipient options that are currently
		 * set in the recipients array
		 */
		recipientsSelected() {
			return this.localizedRecipientOptions.filter(recipient =>
				this.recipients.includes(recipient.value)
			);
		}
	},
	methods: {
		/**
		 * Add file attachments to the email
		 */
		addAttachments(component, files) {
			const attachments = [
				...this.attachments,
				...files.map(file => {
					switch (component) {
						case 'FileAttacherUpload':
							return {
								name: file.name,
								temporaryFileId: file.id,
								documentType: file.documentType
							};
						case 'FileAttacherFileStage':
							return {
								name: this.localize(file.name, this.locale),
								submissionFileId: file.id,
								documentType: file.documentType
							};
						case 'FileAttacherLibrary':
							return {
								name: file.filename,
								libraryFileId: file.id,
								documentType: file.documentType
							};
						case 'FileAttacherReviewFiles':
							return {
								name: this.localize(file.name, this.locale),
								submissionFileId: file.id,
								documentType: file.documentType
							};
					}
				})
			];
			this.emitChange({attachments});
			this.$modal.hide(this.fileAttacherModalId);
			this.$nextTick(() => this.setFocusToRef('attachFiles'));
		},

		/**
		 * Respond to change events from the recipient autosuggest field
		 */
		changeRecipients(name, prop, value) {
			if (prop === 'value') {
				this.emitChange({recipients: value});
			}
		},

		/**
		 * Get the icon to match this document type,
		 * such as PDF, Word, spreadsheet, etc.
		 *
		 * @return {String}
		 */
		getDocumentTypeIcon(attachment) {
			return !!pkp.documentTypeIcons &&
				!!attachment.documentType &&
				!!pkp.documentTypeIcons[attachment.documentType]
				? pkp.documentTypeIcons[attachment.documentType]
				: 'file-o';
		},

		/**
		 * Emit an event to change a prop
		 */
		emitChange(data) {
			this.$emit('set', this.id, data);
		},

		/**
		 * Show the CC/BCC fields
		 */
		enableCC() {
			this.ccIsEnabled = true;
			this.$nextTick(() => {
				this.updateToPadding();
			});
		},

		/**
		 * Load an email template and update the subject/body
		 */
		loadTemplate(key) {
			this.isLoadingTemplate = true;

			const template = this.emailTemplates.find(
				template => template.key === key
			);
			if (template) {
				// Fake a small delay so that the user notices the change
				setTimeout(() => {
					this.setBody(template.body[this.locale]);
					this.setSubject(template.subject[this.locale]);
					this.isLoadingTemplate = false;
				}, 1000);
				return;
			}

			this.latestLoadRequest = $.pkp.classes.Helper.uuid();
			const self = this;
			$.ajax({
				url: this.emailTemplatesApiUrl + '/' + key,
				type: 'GET',
				_uuid: this.latestLoadRequest,
				error(r) {
					// Only process latest request response
					if (self.latestLoadRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success(r) {
					// Only process latest request response
					if (self.latestLoadRequest !== this._uuid) {
						return;
					}
					self.setBody(r.body[self.locale]);
					self.setSubject(r.subject[self.locale]);
				},
				complete() {
					// Only process latest request response
					if (self.latestLoadRequest !== this._uuid) {
						return;
					}
					self.isLoadingTemplate = false;
				}
			});
		},

		/**
		 * Open a confirmation modal to change the locale
		 */
		openSwitchLocale(locale) {
			const localeName = this.locales.find(iLocale => iLocale.locale === locale)
				.name;
			this.openDialog({
				name: 'confirmLocaleSwitch',
				title: this.switchToNamedLanguageLabel.replace('{$name}', localeName),
				message: this.confirmSwitchLocaleLabel.replace(
					'{$localeName}',
					localeName
				),
				actions: [
					{
						label: this.switchToNamedLanguageLabel.replace(
							'{$name}',
							localeName
						),
						isPrimary: true,
						callback: () => {
							this.switchLocale(locale);
							this.$modal.hide('confirmLocaleSwitch');
						}
					},
					{
						label: this.__('common.cancel'),
						isWarnable: true,
						callback: () => this.$modal.hide('confirmLocaleSwitch')
					}
				]
			});
		},

		/**
		 * Remove a file attachment
		 */
		removeAttachment(index) {
			this.emitChange({
				attachments: this.attachments.filter((attachment, i) => i !== index)
			});
		},

		/**
		 * Reset the focus when the attachment modal is closed
		 */
		resetFocusAfterAttachment() {
			this.$refs.attachFiles.$el.focus();
		},

		/**
		 * Search for email templates
		 */
		search() {
			if (!this.emailTemplatesApiUrl) {
				return;
			}
			if (!this.searchPhrase) {
				this.searchResults = [];
				return;
			}
			this.isSearching = true;
			this.latestSearchRequest = $.pkp.classes.Helper.uuid();
			this.showSearchResultCount = 10;
			var self = this;

			$.ajax({
				url: this.emailTemplatesApiUrl,
				type: 'GET',
				data: {
					searchPhrase: this.searchPhrase
				},
				_uuid: this.latestSearchRequest,
				error: function(r) {
					// Only process latest request response
					if (self.latestSearchRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success: function(r) {
					// Only process latest request response
					if (self.latestSearchRequest !== this._uuid) {
						return;
					}
					self.searchResults = r.items;
				},
				complete() {
					// Only process latest request response
					if (self.latestSearchRequest !== this._uuid) {
						return;
					}
					self.isSearching = false;
				}
			});
		},

		/**
		 * Emit an event to set the body of the email
		 */
		setBody(value) {
			this.emitChange({body: value});
		},

		/**
		 * Emit an event to set the subject of the email
		 */
		setSubject(value) {
			this.emitChange({
				subject: this.renderPreparedContent(value, this.compiledVariables)
			});
		},

		/**
		 * Switch the current locale and load the default template
		 * in the new locale
		 */
		switchLocale(locale) {
			this.emitChange({locale: locale});
			this.$nextTick(() => this.loadTemplate(this.initialTemplateKey));
		},

		/**
		 * Update the padding of the to element to account for the CC button
		 */
		updateToPadding() {
			const inputEl = this.$el.querySelector('.pkpAutosuggest__inputWrapper');
			const padding = this.$refs.ccButtons
				? this.$refs.ccButtons.offsetWidth + 'px'
				: '';
			if ($.pkp.app.rtlLocales.includes(this.locale)) {
				inputEl.style.paddingLeft = padding;
			} else {
				inputEl.style.paddingRight = padding;
			}
			// Force the autosuggest/text fields to recalculate the input width
			// by briefly resizing the object that is used by elementResizeEvent
			const resizeSensorEls = inputEl.querySelectorAll('.resize-sensor');
			[...resizeSensorEls].forEach(resizeSensorEl => {
				resizeSensorEl.style.width = '1px';
				setTimeout(() => (resizeSensorEl.style.width = 'auto'), 1000);
			});
		}
	},
	created() {
		if (this.initialTemplateKey) {
			this.loadTemplate(this.initialTemplateKey);
		}
	},
	mounted() {
		this.updateToPadding();
	},
	watch: {
		searchPhrase() {
			this.$nextTick(() => this.search());
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.composer__message {
	position: relative;
	flex: 1;
}

.composer__templates {
	margin-top: 1rem;
}

.composer__templates__heading {
	font-weight: @bold;
}

.composer__templates__list {
	margin: 0.25rem 0 0;
	padding: 0;
	list-style: none;
}

.composer__templates__search {
	margin-top: 1rem;
}

.composer__templates__searching {
	margin-top: 0.5rem;
}

.composer__templates__moreSearchResults {
	text-decoration: none;
}

.composer__locales {
	margin-top: 2rem;
}

.composer__recipients {
	display: flex;
	align-items: center;

	.pkpAutosuggest__control {
		margin-top: 0;
	}
}

.composer__recipients__wrapper {
	position: relative;
}

.composer__ccToggle {
	position: absolute;
	top: 0;
	right: 0;
	padding: 0.5rem;
	line-height: 1.5rem;
	font-size: @font-tiny;

	&:focus {
		outline: 2px solid @primary;
		outline-offset: -1px;
		border-radius: @radius;
	}
}

.composer__text {
	margin-top: 0.5rem;
	display: flex;
	height: 2.5rem;
	background-color: @lift;
	font-size: @font-sml;
	line-height: 2.5rem;
	border: @bg-border;
	border-radius: 2px;
	padding: 0 0.25rem;

	&:hover {
		border-color: @shade;
	}

	label {
		margin: 0 0.25rem;
		font-weight: @bold;
	}

	input {
		margin: 0 0.25rem;
		width: 100%;
		border: none;
		padding-top: 0.15rem; // Vertically center text with label

		&:focus {
			border: none;
			outline: none;
		}
	}
}

.composer__text--focus {
	border-color: @primary;
	box-shadow: inset 3px 0 0 @primary;
	outline: 0;
}

.composer__body {
	margin-top: 0.5rem;

	.pkpFormFieldLabel {
		clip: rect(1px, 1px, 1px, 1px);
		position: absolute !important;
		left: -2000px;
	}
}

.composer__attachmentWrapper {
	margin-top: 0.5rem;
	border: @bg-border;
	padding: 0.5rem;
}

.composer__attachments {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	margin-top: 0.5rem;
	padding-top: 0.5rem;
	border-top: @bg-border;
}

.composer__attachment {
	position: relative;
	max-width: 15rem;
	margin: 0.25rem;
	padding-right: 1.75rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.composer__attachment__documentType {
	color: @primary;
}

.composer__attachment__remove {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 2em;
	padding: 0;
	background: transparent;
	border: 1px solid transparent;
	border-left-color: @bg-border-color-light;
	border-top-right-radius: 1.2em; // matches radius on button in Badge.vue
	border-bottom-right-radius: 1.2em;
	color: @no;

	.fa {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin-left: -1px;
	}

	&:hover,
	&:focus {
		outline: 0;
		border-color: @no;
		background: @no;
		color: #fff;
	}
}

// Template loading mask
.composer__loadingTemplateMask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.5);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
