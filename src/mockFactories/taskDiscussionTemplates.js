import {deepMerge} from './mockHelpers';

const CommonDefaults = {
	id: 1,
	stageId: 1,
	title: 'Plagiarism Check',
	include: true,
	userGroups: [
		{
			id: 16,
			name: 'Reviewer',
		},
		{
			id: 1,
			name: 'Site Admin',
		},
	],

	dueInterval: 'P1W',
	type: 'Task',
	description: `
        <p><strong>Task:</strong> <strong>Complete Prepublication Plagiarism and Originality Checklist</strong></p>

        <p><strong>Description:</strong><br>
        Review the submitted manuscript to ensure it meets F1000Research’s requirements for originality and passes prepublication plagiarism screening.</p>

        <p><strong>Checklist:</strong></p>
        <ul>
        <li>Confirm the manuscript is <strong>original</strong> and not published or under consideration elsewhere (preprints allowed).</li>
        <li>Submit the document to <strong>Similarity Check (iThenticate)</strong> via Crossref.</li>
        <li>Review the similarity report:
            <ul>
            <li>Check for any signs of <strong>plagiarism</strong> or <strong>self-plagiarism</strong>.</li>
            <li>Highlight flagged sections and suggest revisions as needed.</li>
            </ul>
        </li>
        <li>Ensure the manuscript includes a clear <strong>statement of originality</strong>.</li>
        <li>Verify other prepublication criteria:
            <ul>
            <li>Author affiliations are valid and verifiable (e.g., institutional email or profile).</li>
            <li>The correct <strong>article type</strong> is selected and formatting aligns with guidelines.</li>
            <li>Manuscript is written in <strong>clear, professional language</strong>.</li>
            <li><strong>Methods section</strong> is sufficiently detailed for reproducibility.</li>
            <li>All required <strong>ethical policies</strong> are addressed (e.g., conflicts of interest).</li>
            <li>Includes a proper <strong>data availability statement</strong>.</li>
            </ul>
        </li>
        </ul>

        <p><strong>Notes:</strong><br>
        F1000Research will not accept submissions that fail originality checks. Ensure all compliance issues are resolved before final submission.</p>

    `,
};

function getTemplate(overrides = {}) {
	const discussions = deepMerge({...CommonDefaults}, overrides);
	return discussions;
}

export const TemplatesDataMock = [
	{...CommonDefaults},
	{
		id: 2,
		title: 'Authorship Criteria',
		description: `
            <p><strong>Discussion Topic:</strong> <strong>Authorship Criteria for Manuscript Submission</strong></p>

            <p><strong>Context:</strong><br>
            As we prepare to submit the manuscript titled <em>“Trends in Online Learning Post-Pandemic”</em>, it's important to ensure that all listed contributors meet the required authorship criteria.</p>

            <p><strong>Discussion Points:</strong></p>
            <ul>
            <li>Have all listed authors made substantial contributions to the research (e.g., conception, methodology, analysis, or interpretation)?</li>
            <li>Did each author participate in drafting or critically revising the manuscript?</li>
            <li>Has every author reviewed and approved the final version?</li>
            <li>Is everyone willing to take accountability for their part in the work?</li>
            <li>Are there any contributors who should be acknowledged but not listed as authors?</li>
            </ul>

            <p><strong>Action:</strong><br>
            Please share your thoughts by July 15. Any concerns about authorship should be raised before we finalize the submission.</p>
        `,
		type: 'Discussion',
		stageId: 1,
		userGroups: [{id: 65536}],
	},
	{
		id: 3,
		title: 'Ethical Approval',
		description: `
            <p><strong>Task:</strong> <strong>Secure ethical approval for research study</strong></p>    

            <p><strong>Description:</strong><br>
            Obtain ethical approval for the upcoming research study titled <em>“Digital Habits of University Students in Remote Learning Environments.”</em> Approval is required before any data collection can begin.</p>

            <p><strong>Steps to Complete:</strong></p>
            <ul>
            <li>Review institutional ethics policy and guidelines.</li>
            <li>Complete the ethics application form with study details, methodology, consent process, and data protection measures.</li>
            <li>Attach supporting documents (participant information sheet, consent form, survey instrument).</li>
            <li>Submit the application to the university’s Research Ethics Board (REB).</li>
            <li>Track the approval status and follow up if necessary.</li>
            </ul>

            <p><strong>Notes:</strong><br>
            Ensure all documents are consistent and up to date. Reach out to the ethics coordinator if clarification is needed.</p>
        `,
		type: 'Task',
		userGroups: [{id: 65536}],
		dueInterval: 'P3M',
	},
	getTemplate({
		id: 4,
		title: 'Ethical Approval',
		stageId: 1,
		userGroups: [{id: 65536}],
		dueInterval: 'P3M',
	}),
	getTemplate({
		id: 5,
		title: 'Adherence to Policy and Guidelines',
		stageId: 1,
		include: false,
	}),
	getTemplate({id: 6, title: 'Language Review', stageId: 1}),
	getTemplate({
		id: 7,
		title: 'Analysis of the Method',
		stageId: 1,
		include: false,
	}),
	getTemplate({
		id: 8,
		title: 'Lorem ipsum dolor sit amet',
		stageId: 3,
	}),
	getTemplate({
		id: 9,
		title: 'Consectetur adipiscing elit',
		stageId: 3,
		include: false,
	}),
	getTemplate({
		id: 10,
		title: 'Sed do eiusmod tempor incididunt ut',
		stageId: 4,
		include: false,
	}),
	getTemplate({
		id: 11,
		title: 'labore et dolore magna aliqua',
		stageId: 5,
	}),
	getTemplate({
		id: 12,
		title: 'Ut enim ad minim veniam',
		stageId: 5,
		include: false,
	}),
	getTemplate({
		id: 13,
		title: 'Quis nostrud exercitation ullamco',
		stageId: 5,
		include: false,
	}),
];
