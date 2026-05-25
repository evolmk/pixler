# Workflow Engine — Raw Idea (unedited)

> Original braindump from 2026-05-25. Polished version: `spec-workflow-engine.md`.

---

Here is my idea for creating/customizing workflow that the agents follow from within their terminal session.  I dunno if we need to setup a CLI like archon.diy (source in their GitHub) so like Claude code terminal session can access it, they use .yaml workflow files (1 file per workflow type)

I don't know what existing method used for the current workflow, but a customized approach would be best… almost like "presets" for based on the issue's label value is (what type of issue task it is)

I'd like you to refine/polish the idea by checking out how archon does it, they have a beta app but works, not sure if they got it working with Claude code terminal, but this is required because I need to use Claude code subscription (not agent SDK / api credits).  Click issue from app to open a terminal with Claude, to start a new task then the workflow begins based on current state of the linear issue. So likely when user clicks "+ button" next in the Repo's tasks list (current and past tasks) we're is show a modal… they can create and issue or select existing open issue (linear list), workflow is selected automatically based on issue (but user can override) then workflow begins. Here is idea:

Manage Workflows using yaml files that agent follows for a particular task.  App will most be used to create/edit/archive Linear.app tasks (all feature requests/tasks exist in their system, as well as actual issues/bugs). The task or user input context will be used as instruction in agent to update selected project repo (webapp) or most of the time create and attach a generated plan to be executed.  

For workflow step in yaml, should be able to configure which model is used.  Format and method these use, believe they also have an in-app workflow builder, but these should be stored in webapp as files (a default folder, and also a custom folder that user-defined ones save), and easily allow a user to copy + paste them into the folder to share for other setups.  Also a file to setup storage options file to save plans such as local file system folder, Google Drive, s3 bucket. 

After plan created it should be reviewed by another model (can be skipped), plan file created to selected storage option, plan linked in linear's task (issue), run plan, then perform QA on code changed / check errors (recommend & implement fix)

- ability to add/edit workflows like for working on Bugfix, Quickfix, Feature.  Some workflows require interacting with external providers
- Bugfix - simple workflow: simple workflow, use chat context/issue-provider to describe task, create/load issue, review implementation plan,  run plan, QA review
- Quickfix - simple workflow: use chat context/issue-provider to describe task, create/load issue, run implementation plan, QA review
- Feature - advanced workflow: user chat context/issue-provider to describe task, create/load issue, review implementation plan,  run plan, QA review

- Manage providers accessible in workflows: use Linear or Github to manage issues, where to store .md plan files (local, s3, Google Drive)


// VARIABLES - so I didn't have to be redundant in writing the words:
#lablel: bugfix | quickfix | feature

#plan-filename: plan-{issueid-short-title}.md

#plan-summary: display first 10 lines, collapse rest if possible in terminal

#issue-details (compact line format)
- ID - title | label | project | date time 12hr modified
- description
- {#plan-filename}
- {#plan-summary}
- Plan reviewed: No | (Claude or Codex) on Date


// WORKFLOW

Issue Review > Plan Review > Implementation Review > Implementation (PR) > QA Code Review

User submitted prompt to create an issue OR to load an issue by ID/title 
- Create Issue - Auto generate a title (keep short), description, label based on prompt
- Fetch Issue from Linear -> Review Issue

Review Issue - fetch from Linear
- display #issue-details, and if loaded or created it 
- Ask if user wants to make changes 
- If Label is bugfix or quickfix (no plan necessary) -> proceed to Review
- If Label is feature (plan required): -> proceed to Create Plan (no plan linked)- or Review Plan (if plan linked)

Create Implementation Plan - evaluate plan context
- If no plan linked to issue, allow user to add context to issue, update plan

Update Plan 
- When plan is approved, save plan to filename: docs/plans/{#plan-filename}.   Link plan's filename in issue below description (plan: {filename}
  // plan is linked
- Skip to Review Plan

Review Task - ask user to Execute Task or make changes
- display
- #issue-details
- #plan-filename

Implement - "implementing plan"
- Execute plan (subsgents if applicable) 
