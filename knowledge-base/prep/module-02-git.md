## [Module 2] — Git

**Track:** Prep
**Module:** 2 of 4

---

### What you will learn

By the end of this module you will be able to turn any folder into a Git project, track changes to your files, save named snapshots of your work, and push your project to GitHub so it is accessible online and backed up.

Git is not optional. Every professional developer uses it every day. The Developer track assumes you know it.

---

### Why this matters

When you are writing code, you make changes constantly. Some changes break things. Without Git, you might accidentally delete working code, lose a day of work, or have no idea what changed between "it was working" and "it is broken now."

Git solves this by keeping a complete history of every change you deliberately save. You can always go back to any previous state.

**Kampala analogy:** Imagine you keep the financial records for a trading company in a logbook. Every day you write the date, sign your name, and record what changed — what was bought, what was sold, what the balance is. If the accountant makes an error on Wednesday, you can turn back to Tuesday's entry, which is untouched. Git is exactly this: a dated, signed logbook for your code. Every `git commit` is one day's entry in the logbook.

GitHub is the bank vault where you store a copy of that logbook. Even if your laptop is stolen, your logbook is safe.

---

### Lesson 2.1 — Installing Git and first-time setup

**Installing Git:**

- **Mac:** Open Terminal and type `git --version`. If Git is not installed, Mac will offer to install it automatically. Accept.
- **Linux (Ubuntu):** `sudo apt install git`
- **Windows:** Download from git-scm.com. Install with default options. This also installs Git Bash.

After installation:

```
$ git --version
git version 2.43.0
```

If you see a version number, Git is installed.

**First-time configuration:**

Git needs to know who you are, because every commit is signed with your name and email.

```
$ git config --global user.name "Bashir Aziz"
$ git config --global user.email "bashir@example.com"
```

Use your real name and the email you will use for GitHub. You only do this once.

Confirm:
```
$ git config --global --list
user.name=Bashir Aziz
user.email=bashir@example.com
```

---

### Lesson 2.2 — Starting a Git project: git init

`git init` tells Git to start tracking a folder.

```
$ mkdir prep_work
$ cd prep_work
$ git init
Initialized empty Git repository in /Users/bashir/prep_work/.git/
```

Git creates a hidden folder called `.git` inside `prep_work`. This folder contains the entire history of your project. Never delete it.

To see it:
```
$ ls -a
.    ..    .git
```

The `.git` folder is Git's database. You never edit it directly — all your interaction is through `git` commands.

**One project, one git init:** You run `git init` once per project, in the project's root folder. Never run `git init` inside a folder that is already inside another Git project.

---

### Lesson 2.3 — Checking status: git status

`git status` is your most used Git command. It tells you the current state of your project.

```
$ git status
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to begin tracking)
```

Now create a file:
```
$ touch market.txt
$ git status
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        market.txt

nothing added to commit but untracked files present
```

Git sees `market.txt` but it is "untracked" — Git is not saving its history yet. You need to explicitly tell Git to track it.

**Run `git status` constantly.** Any time you are unsure what state your project is in, run it. It tells you exactly what has changed and what you need to do next.

---

### Lesson 2.4 — Staging and committing: git add and git commit

Git uses a two-step process: stage, then commit.

**Why two steps?** Sometimes you change ten files but only want to save five of them in this commit. Staging lets you select exactly which changes to include.

**git add — stage a file:**

```
$ git add market.txt
$ git status
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   market.txt
```

`market.txt` is now staged (listed under "Changes to be committed").

**git add . — stage everything:**

```
$ git add .
```

The `.` means "all files in the current directory." Use this when you want to stage all your changes at once.

**git commit — save a snapshot:**

```
$ git commit -m "Add market price tracking file"
[main (root-commit) a3f9c21] Add market price tracking file
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 market.txt
```

The `-m` flag lets you write the commit message inline. A good commit message describes *what* changed and *why*, not just "update file."

Good commit messages:
- "Add market price summary function"
- "Fix CSV parsing error when price column is empty"
- "Add vendor column to prices.csv"

Bad commit messages:
- "changes"
- "fix"
- "asdf"

After committing:
```
$ git status
On branch main
nothing to commit, working tree clean
```

"Nothing to commit, working tree clean" means all your changes are saved.

---

### Lesson 2.5 — Viewing history: git log

`git log` shows your commit history.

```
$ git log
commit a3f9c21b84f6c3d9e2a1b0c7d8e4f2a9b3c5d7e (HEAD -> main)
Author: Bashir Aziz <bashir@example.com>
Date:   Thu Jun 5 10:23:14 2026 +0300

    Add market price tracking file
```

Each commit has:
- A unique ID (the long string of letters and numbers)
- Your name and email
- The date and time
- Your commit message

`git log --oneline` shows a compact version:
```
$ git log --oneline
a3f9c21 Add market price tracking file
```

---

### Lesson 2.6 — GitHub: pushing your project online

GitHub is a website that hosts Git repositories. It is the industry standard for storing and sharing code.

**Step 1: Create a GitHub account**

Go to github.com. Click "Sign up." Use the same email you configured in Git.

**Step 2: Create a new repository**

Click the `+` icon in the top right corner → "New repository."

- Repository name: `prep-work`
- Description: "Kampala Agentic AI Club prep track work"
- Visibility: Public (the evaluator needs to read it)
- Do NOT tick "Add a README file" (you already have a local project)
- Click "Create repository"

**Step 3: Connect your local project to GitHub**

GitHub will show you instructions. Use these commands:

```
$ git remote add origin https://github.com/YOUR_USERNAME/prep-work.git
$ git branch -M main
$ git push -u origin main
```

`git remote add origin` tells your local Git where the GitHub repository is.
`git push -u origin main` sends your local commits to GitHub.

**Authentication:** The first time you push, GitHub will ask for your credentials. Use a Personal Access Token (PAT) instead of your password:

1. On GitHub: click your profile picture → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name, set expiration to 90 days, tick "repo" scope
4. Copy the token (you only see it once)
5. When Git asks for your password, paste the token

After the first successful push:
```
$ git log --oneline
a3f9c21 Add market price tracking file
```

Your commit is now on GitHub. Go to `github.com/YOUR_USERNAME/prep-work` and you will see it.

**Future pushes:**

After your first push, all future pushes are just:
```
$ git push
```

---

### Module checklist

- [ ] I have Git installed and can run `git --version`
- [ ] I have configured my name and email with `git config --global`
- [ ] I can turn a folder into a Git project with `git init`
- [ ] I can check the state of my project with `git status`
- [ ] I can stage files with `git add`
- [ ] I can save a snapshot with `git commit -m "message"`
- [ ] I can view my commit history with `git log`
- [ ] I have a GitHub account
- [ ] I can push my local project to GitHub

---

### Common questions

**Q: Git says "Author identity unknown" when I try to commit**
You have not configured your name and email. Run `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`.

**Q: I pushed but I cannot see my files on GitHub**
Make sure you ran `git add .` and then `git commit` before `git push`. If your status shows "nothing to commit," your files are there — look at your repository on GitHub.

**Q: GitHub is asking for a password but my password is not working**
GitHub no longer accepts passwords for command-line operations. Generate a Personal Access Token (see Lesson 2.6 above) and use that instead of your password.

**Q: I ran `git push` and it says "fatal: 'origin' does not appear to be a git repository"**
You have not connected your local project to GitHub yet. Run `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git` first.

**Q: Can I undo a commit?**
Yes. `git revert HEAD` creates a new commit that undoes the previous one (safe — keeps history). For this course, do not worry about undoing commits — just make a new commit with the correction.

---

### What you can do now

You can track every change you make to your code, save named snapshots, and store your work on GitHub. Your code is now safe even if your laptop is lost or damaged. Any collaborator can see your work and you can share it with the evaluator by sending a URL.

You are ready for Module 3: Python Basics.
