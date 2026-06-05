## FAQ — Module 2: Git

**Track:** Prep
**Type:** FAQ — built from live sessions
**Last updated:** June 2026

This file is updated after each Saturday session. Every entry comes from a real student question. Do not edit entries once written — add new ones at the bottom.

---

### Q: GitHub is asking for my password but my actual password is not working

**A:** GitHub stopped accepting account passwords for Git operations in August 2021. You must use a Personal Access Token (PAT) instead.

To create one:
1. Go to github.com and sign in
2. Click your profile picture (top right) → Settings
3. Scroll all the way down the left sidebar to "Developer settings"
4. Click "Personal access tokens" → "Tokens (classic)"
5. Click "Generate new token (classic)"
6. Give it a name like "prep-work-token"
7. Set expiration to 90 days
8. Under "Select scopes", tick the box for "repo"
9. Click "Generate token" at the bottom
10. **Copy the token immediately** — GitHub will only show it once

When Git asks for your password, paste the token. It will look like `ghp_xxxxxxxxxxxxxxxxxxxx`.

**To avoid typing it every time:** Run this command once:
```
$ git config --global credential.helper store
```
After you enter the token once, Git will remember it automatically.

---

### Q: I ran `git push` but it says "fatal: 'origin' does not appear to be a git repository"

**A:** Your local Git project does not know where to send the files. You need to connect it to your GitHub repository first.

Run this command (replacing YOUR_USERNAME and YOUR_REPO with your actual values):
```
$ git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

Then:
```
$ git branch -M main
$ git push -u origin main
```

The `-u origin main` tells Git that "origin" (GitHub) is where this branch should push to by default. After this, future pushes are just `git push`.

To check what remote connections you have:
```
$ git remote -v
origin  https://github.com/yourname/prep-work.git (fetch)
origin  https://github.com/yourname/prep-work.git (push)
```

If this shows nothing, you have not added a remote yet.

---

### Q: I made a commit but the files are not showing up on GitHub

**A:** You have committed locally but not pushed. A commit only saves to your computer. `git push` sends it to GitHub.

Check your status:
```
$ git status
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)
```

"Ahead by 1 commit" means you have 1 commit locally that is not yet on GitHub. Run:
```
$ git push
```

Then refresh your GitHub repository in the browser — you should see the files.

---

### Q: What is the difference between git add and git commit?

**A:** Think of it as packing a box before sending it.

`git add` puts items in the box (stages them). You are selecting which changes you want to include in this save.

`git commit` seals and labels the box with a description (saves the snapshot with a message). The box is now permanently saved on your computer.

`git push` sends the sealed box to GitHub (uploads to the internet).

You cannot skip steps. If you commit without adding, nothing is in the box and the commit is empty. If you push without committing, there is nothing new to send.

The typical sequence for saving your work:
1. Make changes to your files
2. `git add .` — stage everything
3. `git commit -m "What I changed"` — save the snapshot
4. `git push` — send to GitHub

---

### Q: I got "Author identity unknown" — Git is asking me to configure user.email and user.name

**A:** Git needs to know who you are before it can save commits. Run these two commands:

```
$ git config --global user.name "Your Full Name"
$ git config --global user.email "your.email@example.com"
```

Use the same email you used for your GitHub account. The `--global` flag means this setting applies to all Git projects on your computer, so you only need to do this once.

After running both commands, try your commit again.

---

### Q: I accidentally ran `git init` in the wrong folder — how do I undo it?

**A:** `git init` creates a hidden folder called `.git` inside the current directory. To undo it, you delete that folder.

First, confirm you are in the right (wrong) folder:
```
$ pwd
$ ls -a
```

You should see `.git` in the list.

**Mac/Linux:**
```
$ rm -rf .git
```

**Windows (Git Bash):**
```
$ rm -rf .git
```

This removes Git tracking from the folder without deleting your files. The folder itself remains — Git just no longer tracks it.

Warning: only do this when you initialised Git in the wrong place. Do not run this in a folder where you actually want Git.

---

### Q: I ran `git status` and it says "not a git repository"

**A:** You are in a folder that has not been initialised with Git. You need to either:

1. Navigate to your project folder (the one where you ran `git init`):
```
$ cd prep_work
```

2. Or initialise Git in the current folder:
```
$ git init
```

`git status` only works inside a Git repository (a folder with a `.git` subfolder). It does not work in just any folder.

---

### Q: What does HEAD mean in Git messages?

**A:** HEAD is Git's way of saying "where you currently are in the history." Usually HEAD points to the latest commit on your current branch.

When you see `HEAD -> main`, it means: "you are on the main branch and your current position is the latest commit."

For this course, do not worry too much about HEAD. It will always be pointing to the right place as long as you are doing `git add`, `git commit`, and `git push` in order.

---

### Q: I created my repository on GitHub as Private. The evaluator cannot see my files

**A:** The evaluation system fetches files from a public URL. Private repositories require authentication, which the evaluator does not have.

To change your repository from Private to Public:
1. Go to your repository on GitHub
2. Click "Settings" (the gear icon in the top menu of the repository)
3. Scroll all the way down to the "Danger Zone" section
4. Click "Change visibility"
5. Select "Make public"
6. Confirm

After this, the URL `https://raw.githubusercontent.com/YOUR_USERNAME/prep-work/main/market_summary.py` should be accessible without logging in. You can test this by opening it in a private/incognito browser window.

---

### Q: My commit message had a typo. Can I fix it?

**A:** If you have not pushed the commit to GitHub yet, you can change the message:
```
$ git commit --amend -m "Corrected commit message"
```

If you have already pushed, the simplest approach for this course is to leave it. The commit message does not affect your project evaluation. A typo in a commit message is not a problem.

---

### Q: I see "warning: LF will be replaced by CRLF" — is this a problem?

**A:** This is a Windows line-ending warning. It is not an error and it will not cause problems for your project. You can safely ignore it.

The technical explanation: Mac and Linux use LF (line feed) to end lines in text files. Windows uses CRLF (carriage return + line feed). Git on Windows warns you when it converts between them. The conversion is harmless for Python scripts and CSV files.
