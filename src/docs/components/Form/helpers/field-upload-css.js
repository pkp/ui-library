export default {
	name: 'css',
	component: 'field-upload',
	label: 'CSS',
	description:
		'Upload a custom CSS file to change the look and feel of your site.',
	options: {
		url: 'https://httpbin.org/post',
		acceptedFiles: '.css',
		dropzoneDictDefaultMessage: 'Drop files here to upload',
		dropzoneDictFallbackMessage:
			"Your browser does not support drag'n'drop file uploads.",
		dropzoneDictFallbackText:
			'Please use the fallback form below to upload your files.',
		dropzoneDictFileTooBig:
			'File is too big ({{filesize}}mb). Files larger than {{maxFilesize}}mb can not be uploaded.',
		dropzoneDictInvalidFileType: 'Files of this type can not be uploaded.',
		dropzoneDictResponseError:
			'Server responded with {{statusCode}} code. Please contact the system administrator if this problem persists.',
		dropzoneDictCancelUpload: 'Cancel upload',
		dropzoneDictUploadCanceled: 'Upload canceled',
		dropzoneDictCancelUploadConfirmation:
			'Are you sure you want to cancel this upload?',
		dropzoneDictRemoveFile: 'Remove file',
		dropzoneDictMaxFilesExceeded: 'You can not upload any more files.'
	},
	value: ''
};
