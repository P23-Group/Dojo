Contributing to DOJO

Guidelines for contributing to the DOJO habit-tracking project.

Repository: P23-Group/Dojo  
Main branch: main  
Task tracking: Trello

Branch Naming

Create a separate branch for each task. Use lowercase names and hyphens.

- feature/ - new features (example: feature/login-page)
- fix/ - bug fixes (example: fix/login-validation)
- docs/ - documentation (example: docs/readme)
- refactor/ - code improvements (example: refactor/habit-service)

Do not push directly to main. Use a Pull Request instead.

Commit Messages

Use the following format:

<type>: <short description>


- feat - add functionality
- fix: - fix a bug
- docs: - update documentation
- refactor: - improve code structure
- test: - add or update tests
- chore: - project setup or maintenance


Examples:


feat: add registration form
fix: correct habit progress calculation
docs: add project README
refactor: simplify user model


Write commit messages in English and keep them short and descriptive.

Pull Request Rules

1. Create a branch for your Trello task.
2. Make and test your changes, then push the branch to GitHub.
3. Open a Pull Request targeting main.
4. Describe what changed and link the related Trello task, if available.
5. Request a review and address any feedback.
6. At least one approving review from a reviewer with write access is required before merging, as currently configured in GitHub.
7. A repository maintainer with the necessary permissions merges the PR after approval. Contributors without merge access must not bypass this process.


Keep each PR focused on one task. Never commit passwords, tokens, or .env secrets.


Before Marking a Task Done


- The changes work as intended.
- The relevant functionality has been tested.
- UI changes follow the DOJO mockups when applicable.
- The Pull Request has been reviewed and merged.
- The Trello card has been moved to Done.