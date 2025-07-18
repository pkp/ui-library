import {deepMerge} from './mockHelpers';

const CommonDefaults = {
	id: 1,
	name: 'Plagiarism Check',
	content: `
        <p><strong>Task:</strong> <strong>Run plagiarism check for draft article</strong></p>
        
        <p><strong>Description:</strong><br>
        Please review the latest draft of the article titled <em>The Impact of AI on Education</em> and ensure it passes a plagiarism check. Use the department’s preferred tool (Grammarly or Turnitin).</p>

        <p><strong>Steps to Complete:</strong></p>
        <ul>
        <li>Download the draft from the shared Google Drive folder.</li>
        <li>Upload the document to the plagiarism checker.</li>
        <li>Review the report and highlight any flagged sections.</li>
        <li>Add comments or suggestions to the document if revisions are needed.</li>
        <li>Mark the task complete once everything is verified.</li>
        </ul>
    `,
	type: 'Task',
	taskDetails: {
		participantRoles: [16, 1],
		dueDate: 'P1W',
	},
};

export function getTemplates(overrides = {}) {
	const discussions = deepMerge({...CommonDefaults}, overrides);
	return discussions;
}

export const TemplatesDataMock = [
	{...CommonDefaults},
	{
		id: 2,
		name: 'Authorship Criteria',
		content: `
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
	},
	{
		id: 3,
		name: 'Ethical Approval',
		content: `
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
		taskDetails: {
			participantRoles: [65536],
			dueDate: 'P3M',
		},
	},
];
