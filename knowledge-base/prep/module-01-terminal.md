## [Module 1] — The Terminal

**Track:** Prep
**Module:** 1 of 4

---

### What you will learn

By the end of this module you will be able to open a terminal, navigate your computer's file system using text commands, create folders and files, and read the contents of a file — all without touching a mouse.

These are the absolute foundation skills for every developer. Every tool you will use in the Developer track — Git, Python, Node.js, deployment scripts — is operated through the terminal. You cannot skip this.

---

### Why this matters

Most people manage their computers by clicking icons, opening folders visually, and dragging files. That works fine for everyday tasks. But when you are building software, the terminal gives you direct, precise control over your computer — faster than any graphical interface.

**Kampala analogy:** Imagine you manage a wholesale shop. You could walk through the warehouse yourself to move stock, check inventory, and update records. Or you could call your store manager on the phone and say: "Move the 50kg rice bags from section B to section A. Tell me what is in section C. Create a new shelf called 'imports'." The terminal is that phone call. You are giving exact instructions in words, and the computer executes them immediately.

Another way to think about it: a graphical interface is like a restaurant menu with pictures. The terminal is like talking directly to the chef. More powerful, requires more knowledge, but you can ask for exactly what you want.

---

### Lesson 1.1 — What is a terminal?

A terminal is a text-based window for communicating with your computer. You type a command, press Enter, and the computer executes it and shows you the result.

On different operating systems, the terminal has different names:

- **Mac:** Terminal (found in Applications > Utilities) or iTerm2
- **Linux (Ubuntu):** Terminal or Ctrl+Alt+T shortcut
- **Windows:** You have two options — Command Prompt (older, limited) or Windows Terminal / PowerShell (recommended). For this course, use Git Bash after installing Git, because it gives you Unix-style commands that match what everyone else uses.

When you open the terminal, you will see a prompt. It looks something like this:

```
bashir@laptop:~$
```

This means: the user is `bashir`, the computer is called `laptop`, and `~` means you are in your home directory (your main personal folder). The `$` means the terminal is ready for your command.

On Windows with Git Bash, it looks similar:

```
bashir@LAPTOP MINGW64 ~
$
```

You type after the `$`. When you press Enter, the command runs. The result appears, then a new prompt appears and waits for your next command.

**First command to try:**

Type `echo hello` and press Enter. The terminal will print `hello`. You have just given the computer a command and it obeyed. This is the basic loop of everything you will do.

---

### Lesson 1.2 — Where am I? pwd and ls

The file system of your computer is like a building with many rooms. Folders are rooms. Files are objects inside rooms. At any moment in the terminal, you are standing in one specific room.

**pwd — print working directory**

`pwd` tells you which folder (room) you are currently in.

```
$ pwd
/Users/bashir
```

This output means you are in the `bashir` folder, which is inside `Users`, which is at the root of the disk. This is your home directory.

On Windows with Git Bash:
```
$ pwd
/c/Users/bashir
```

`/c/` means the C: drive.

**ls — list**

`ls` shows all the files and folders in your current directory.

```
$ ls
Desktop   Documents   Downloads   Music   Pictures   Videos
```

These are all the items in your current folder.

`ls -l` shows more detail — file sizes, dates, and permissions:

```
$ ls -l
drwxr-xr-x  2 bashir staff  64 Jun  1 09:00 Desktop
drwxr-xr-x  5 bashir staff 160 Jun  3 14:22 Documents
```

The `d` at the start means it is a directory (folder). The date shows when it was last changed.

`ls -a` shows hidden files too (files whose names start with `.`).

**Practical exercise:**

1. Open your terminal
2. Type `pwd` — write down the path you see
3. Type `ls` — count how many items appear
4. Type `ls -l` — find the most recently modified item

---

### Lesson 1.3 — Moving between folders: cd

`cd` stands for "change directory." It moves you from one folder to another.

**Moving into a folder:**

```
$ cd Documents
$ pwd
/Users/bashir/Documents
```

You have moved into the Documents folder. Now `ls` will show you what is inside Documents.

**Moving up one level:**

`cd ..` moves you up to the parent folder. Two dots means "the folder above this one."

```
$ cd ..
$ pwd
/Users/bashir
```

**Moving to your home directory from anywhere:**

`cd` with no argument, or `cd ~`, always takes you back to your home directory no matter where you are.

```
$ cd
$ pwd
/Users/bashir
```

**Moving multiple levels at once:**

```
$ cd Documents/projects/kampala
```

This moves you three levels deep in one command.

**Absolute vs relative paths:**

A path starting with `/` is absolute — it describes the full location from the root of the disk:
```
$ cd /Users/bashir/Documents
```

A path without `/` at the start is relative — it moves from wherever you currently are:
```
$ cd Documents
```

**Kampala analogy:** `cd` is like giving directions. "Go into the warehouse, then go into section B." `cd ..` is "go back to the main floor." `cd /` is "go to the entrance of the building."

**Common mistake:** If you type `cd documents` but the folder is called `Documents` (capital D), you will get an error. The terminal is case-sensitive on Mac and Linux. On Windows, it is usually not, but treat it as case-sensitive to build good habits.

---

### Lesson 1.4 — Creating folders and files: mkdir and touch

Now that you can navigate, you can create things.

**mkdir — make directory**

`mkdir` creates a new folder.

```
$ mkdir kampala_club
$ ls
Desktop   Documents   Downloads   kampala_club   Music
```

The folder `kampala_club` now exists.

**mkdir with a path:**

```
$ mkdir Documents/projects/kampala_club
```

This creates the folder deep inside Documents > projects. Note: the parent folders (`projects`) must already exist, or this will fail. To create a folder and all missing parent folders at once, use `-p`:

```
$ mkdir -p Documents/projects/kampala_club
```

**Naming conventions:** Use underscores or hyphens instead of spaces. A folder called `my project` causes problems because the terminal interprets the space as a separator between two separate arguments. `my_project` or `my-project` is safe.

**touch — create a file**

`touch` creates a new empty file.

```
$ touch notes.txt
$ ls
Desktop   Documents   Downloads   kampala_club   Music   notes.txt
```

`touch` is also used to update the modification time of an existing file without changing its contents — this matters when working with build tools.

**Creating multiple files at once:**

```
$ touch index.py README.md prices.csv
```

Three files created in one command.

**Practical exercise:**

1. Navigate to your home directory: `cd`
2. Create a folder: `mkdir kampala_prep`
3. Enter it: `cd kampala_prep`
4. Create three files: `touch notes.txt data.csv script.py`
5. Confirm: `ls`

---

### Lesson 1.5 — Reading a file: cat

`cat` prints the entire contents of a file to the terminal.

```
$ cat notes.txt
```

If `notes.txt` contains text, you will see it. If it is empty (just created with `touch`), you see nothing.

**Example with content:**

First, open the file in any text editor and add some text. Then in the terminal:

```
$ cat notes.txt
Module 1: The Terminal
Started: June 2026
Status: In progress
```

**cat with multiple files:**

```
$ cat notes.txt data.csv
```

Both files' contents will print one after the other.

**When cat is too much:**

For large files, `cat` floods the terminal. Use `less` instead — it shows one screenful at a time. Press space to advance, `q` to quit:

```
$ less large_file.txt
```

**Practical exercise:**

1. Open `notes.txt` in any text editor (Notepad on Windows, TextEdit on Mac)
2. Write: "I am learning the terminal."
3. Save and close the text editor
4. In the terminal, type `cat notes.txt`
5. You should see your text printed

---

### Module checklist

Work through this list. Only tick an item when you can do it from memory without looking at notes.

- [ ] I can open a terminal on my computer
- [ ] I can type `pwd` and explain what it shows me
- [ ] I can type `ls` and see the files and folders in my current directory
- [ ] I can move into a subfolder using `cd foldername`
- [ ] I can move up one level using `cd ..`
- [ ] I can return to my home directory using `cd` or `cd ~`
- [ ] I can create a new folder using `mkdir`
- [ ] I can create a new file using `touch`
- [ ] I can read a file's contents using `cat`

---

### Common questions

**Q: I typed a command and nothing happened**
That is normal. Many commands work silently — they succeed and return you to the prompt without printing anything. If no error appears, the command worked.

**Q: I got "command not found"**
Check your spelling. The terminal requires exact spelling and is case-sensitive. Also check that the program is installed — for example, `python` requires Python to be installed.

**Q: I cannot find the terminal on Windows**
Install Git from git-scm.com. During installation, Git installs "Git Bash" — a terminal with Unix-style commands. Right-click on the Desktop and choose "Git Bash Here" to open it.

**Q: I typed `ls` and it says "ls is not recognized"**
You are in the Windows Command Prompt, not Git Bash. Close it and open Git Bash instead. In Command Prompt, the equivalent command is `dir`.

**Q: I used `cd` and now I am lost**
Type `pwd` to see exactly where you are. Then type `cd` (no argument) to return to your home directory and start fresh.

**Q: File names with spaces are not working**
Wrap the name in quotes: `cd "My Documents"` or use a backslash before the space: `cd My\ Documents`. Better practice: never use spaces in file and folder names you create. Use underscores: `my_documents`.

---

### What you can do now

You can navigate your computer's file system entirely through text commands. You can find your location, look around, move between folders, create new folders and files, and read file contents.

This is the foundation every developer uses dozens of times per day. When you open a terminal to run Python, use Git, or deploy an application, all of that starts from these basic navigation skills.

You are ready for Module 2: Git.
