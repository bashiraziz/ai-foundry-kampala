## FAQ — Runway 1: The Terminal

**Track:** Prep
**Type:** FAQ — built from live sessions
**Last updated:** June 2026

This file is updated after each Saturday session. Every entry comes from a real student question. Do not edit entries once written — add new ones at the bottom.

---

### Q: I cannot find the terminal on my Windows computer

**A:** On Windows, the built-in terminal is called Command Prompt or PowerShell, but for this course we use Git Bash — a terminal that comes with Git and uses Unix-style commands (the same commands used on Mac and Linux).

To get Git Bash:
1. Go to git-scm.com and download the Git installer for Windows
2. Run the installer — use all default settings
3. After installation, right-click anywhere on your Desktop and you will see "Git Bash Here" in the menu
4. Click it — a terminal window opens

You can also find Git Bash by searching "Git Bash" in the Windows Start menu.

Once Git Bash is open, type `pwd` and press Enter. You should see something like `/c/Users/YourName`. You are ready.

---

### Q: I typed `ls` and got an error — it says "ls is not recognized"

**A:** You are in Windows Command Prompt, not Git Bash. The Windows Command Prompt uses different commands — it uses `dir` instead of `ls`, for example.

Close the Command Prompt window. Open Git Bash instead (right-click Desktop → "Git Bash Here" or search "Git Bash" in the Start menu). In Git Bash, `ls` works correctly.

If you are sure you are in Git Bash and still getting this error, close Git Bash completely and reopen it. Sometimes the installation does not take effect until the terminal is restarted.

---

### Q: I used `cd` to go into a folder but now I am lost and cannot get back

**A:** Two commands will always rescue you:

`pwd` — shows you exactly where you are right now. Read the path and understand where you ended up.

`cd` with no arguments — takes you immediately back to your home directory, no matter how deep you went.

```
$ cd
$ pwd
/c/Users/YourName
```

You are back home. From here, navigate to where you want to go.

Another useful command: `cd ..` moves you up exactly one level. If you went five levels deep, typing `cd ..` five times brings you back.

Think of `cd` (no argument) as the "go home" button. Use it whenever you are disoriented.

---

### Q: I created a folder but I cannot see it in File Explorer (Windows) or Finder (Mac)

**A:** The folder exists — the terminal does not lie. There are two common explanations:

1. **You are looking in the wrong place.** In the terminal, type `pwd` to see the full path of your current folder. Then navigate to that same path in File Explorer or Finder. For example, if `pwd` shows `/c/Users/Bashir/kampala_prep`, open File Explorer and navigate to `C:\Users\Bashir\kampala_prep`.

2. **The folder is there but hidden.** On Mac, press Cmd+Shift+. (period) in Finder to show hidden files. On Windows, go to View → Show → Hidden items in File Explorer.

The terminal and File Explorer/Finder show the same files — they are just two different ways of looking at the same storage.

---

### Q: I tried to create a folder called `my project` with a space and the terminal created two folders

**A:** When you type `mkdir my project`, the terminal reads `my` and `project` as two separate arguments — it creates both `my` and `project` as separate folders.

To create a folder name with a space, wrap it in quotes:
```
$ mkdir "my project"
```

Or use an underscore or hyphen instead (strongly recommended):
```
$ mkdir my_project
$ mkdir my-project
```

Professional practice is to never use spaces in file or folder names for programming work. Underscores and hyphens are always safe.

---

### Q: I ran `cat` on a file and nothing appeared

**A:** If `cat` shows nothing, the file is empty. If you just created the file with `touch`, it has no contents yet.

Open the file in a text editor (Notepad on Windows, TextEdit on Mac, or any editor you prefer), add some text, and save it. Then run `cat` again.

To confirm the file exists and check its size before reading:
```
$ ls -l notes.txt
-rw-r--r-- 1 bashir staff 0 Jun 5 10:00 notes.txt
```

The `0` in the middle is the file size in bytes. A 0-byte file is empty. After you add text and save, the number will be greater than 0.

---

### Q: How do I know if I made a mistake? The terminal just goes back to the prompt without saying anything

**A:** Silence in the terminal usually means success. When a command works, many terminal commands simply return to the prompt without printing anything — this is normal Unix behaviour.

You only get output when:
- The command has something to show (like `ls` listing files, or `cat` printing contents)
- Something went wrong (an error message)

If you ran `mkdir kampala_prep` and the terminal went silent, that is good — the folder was created. Confirm by running `ls` and looking for the new folder.

If you ran a command and got a line of red text or a message containing "error", "not found", or "permission denied", something went wrong. The message will tell you what.

---

### Q: I get "Permission denied" when I try to create a file or folder

**A:** This means you are trying to create something in a folder that your user account does not have permission to write to. Common locations where this happens: the root `/` directory, `/usr/`, `/etc/`, and on Windows `C:\Windows\System32`.

The fix: work inside your home directory instead. Type `cd` to go home, then create your folder there:
```
$ cd
$ mkdir kampala_prep
$ cd kampala_prep
```

Your home directory (`/Users/YourName` on Mac, `/c/Users/YourName` on Windows with Git Bash) is the place where your user account has full permission to create, edit, and delete files.

---

### Q: Can I use the terminal on my phone?

**A:** Technically yes — there are terminal apps for Android (like Termux) and iPhone (like iSH). However, for this course, we strongly recommend using a laptop or desktop computer. The terminal is more stable, more consistent, and you will be running Python scripts and Git operations that work much better on a computer.

If you do not have access to a laptop, speak to the facilitator — there may be options available for club members in this situation.

---

### Q: What is the difference between a folder and a directory?

**A:** They are the same thing. "Folder" is the word used in graphical interfaces (like Windows Explorer). "Directory" is the word used in the terminal and in technical documentation. When you see "directory" in a command or error message, it means folder.

`pwd` stands for "print working directory" — it shows you which folder you are currently in.

---

### Q: I accidentally deleted a file using `rm`. Can I get it back?

**A:** On Mac and Linux, files deleted with `rm` in the terminal do not go to the Trash — they are gone immediately. There is no undo.

On Windows with Git Bash, `rm` also permanently deletes without going to Recycle Bin.

This is why we use Git. If your file was committed to a Git repository before you deleted it, you can recover it. If it was not committed, it is very difficult to recover.

Lesson: commit your work to Git frequently. Before deleting any file, ask yourself: "Is this committed?"

For this course, be careful with `rm`. You will not need it much in Runway 1 — focus on creating things, not deleting them.

---

### Q: I ran `mkdir` but I cannot find the folder — where did it go?

**Module:** 1
**Lesson:** 1.3
**Frequency:** 1
**Platform:** All

**Short answer:** Run `pwd` first to see where you currently are — you created the folder in a different location than you expected.

**Full explanation:** The terminal always creates folders in the directory you are currently in. If you navigated to `/c/Users/YourName/Downloads` by accident, running `mkdir kampala_prep` creates the folder there — not on the Desktop and not in your project folder. Think of it like telling someone "put this box somewhere" while standing in a different room than you realised. The box is where you were standing, not where you meant to be.

**Step-by-step fix:**
1. In the terminal, type `pwd` and press Enter — note the path shown
2. Open File Explorer and navigate to that exact path
3. Your folder will be there
4. If you want the folder somewhere else, run `cd` to go to the correct location first, then run `mkdir` again

**How to confirm it worked:** After running `pwd`, open File Explorer at that path. You will see the folder you created.

**If the fix did not work:** Run `ls` immediately after `mkdir` — if the folder was created, it will appear in the list. If it does not appear even in `ls`, the `mkdir` command may have had a typo. Check the folder name carefully.

---

### Q: I typed `cat` and the terminal is stuck — it will not give me a new prompt

**Module:** 1
**Lesson:** 1.4
**Frequency:** 1
**Platform:** All

**Short answer:** You ran `cat` with no filename — it is now waiting for you to type input. Press Ctrl+C to cancel and return to the prompt.

**Full explanation:** When you type `cat` with no filename, the terminal does not give an error — it enters "read from keyboard" mode and waits for you to type text, then print it back. The cursor just blinks. This surprises everyone the first time. It is not broken. Pressing Ctrl+C sends an interrupt signal that cancels the waiting command and returns you to the prompt. Think of Ctrl+C as the "I changed my mind, stop what you are doing" key combination in any terminal situation.

**Step-by-step fix:**
1. Press Ctrl+C (hold the Ctrl key, press C) — the terminal cancels the waiting command
2. You will see `^C` printed and then a new `$` prompt appears
3. Now type the correct command: `cat notes.txt` (with the filename)

**How to confirm it worked:** The `$` prompt returns and you see `^C` on the screen before it.

**If the fix did not work:** If Ctrl+C does not respond, try Ctrl+D (which sends an end-of-file signal). If the terminal is completely frozen, close the window and open a new one.

---

### Q: My terminal shows strange characters when I type — it looks broken

**Module:** 1
**Lesson:** 1.2
**Frequency:** 1
**Platform:** Windows

**Short answer:** You are in the wrong terminal — close it and open Git Bash instead. On Windows, also check that you opened Git Bash, not Windows PowerShell or Command Prompt.

**Full explanation:** Windows has several different terminal applications — Command Prompt (cmd.exe), PowerShell, Windows Terminal, and Git Bash. They each handle text encoding differently. When you open the wrong one, or when encoding settings are mismatched, you may see characters like `â€™` instead of `'`, or arrows and boxes instead of normal text. This is a display issue caused by the terminal and your font/encoding being out of sync. Git Bash (which this course uses) is configured correctly for the commands we run. If you are seeing garbled text in Git Bash, closing and reopening it usually resets the display.

**Step-by-step fix:**
1. Close the terminal window showing strange characters
2. Right-click on your Desktop and select "Git Bash Here" — or search "Git Bash" in the Start menu
3. In the new window, type `echo hello` and press Enter
4. You should see `hello` printed cleanly

**How to confirm it worked:** Normal text appears without garbled symbols or box characters.

**If the fix did not work:** In Git Bash, right-click the title bar → Options → Text → change the character set to UTF-8 and the font to a standard monospace font (Courier New or Consolas). Click Apply, close, and reopen Git Bash.

---
