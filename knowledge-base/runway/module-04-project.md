## [Runway 4] — The Mini-Project

**Track:** Prep
**Module:** 4 of 4

---

### What you will learn

In this module you will combine all the skills from Modules 1, 2, and 3 into a single complete project: a Python script that reads a CSV file and prints a market price summary. You will then commit the project to Git and push it to a public GitHub repository for evaluation.

This is not a test. It is a demonstration that the skills stick together — that you can use the terminal, write Python, work with files, and manage your code with Git, all in one task.

---

### Why this matters

The ability to build something end-to-end — even something simple — is what separates people who have done it from people who have only read about it. The Developer track starts immediately with building agents. If you can complete this project independently, you are ready.

**What you are building:** A market price summary tool. A user gives it a CSV file of prices from Kampala markets. The script outputs: how many items are in the file, which item is cheapest and who sells it, which item is most expensive and who sells it, and the average price across all items.

This is a realistic small tool. Real traders, logistics coordinators, and shop managers could use something like this.

---

### Lesson 4.1 — Understanding the project requirements

The evaluation system will fetch two files from your public GitHub repository:

1. `market_summary.py` — your Python script
2. `prices.csv` — your CSV data file

Your script must produce output that includes all of these:

- Total number of items
- The cheapest item, its price, and the vendor's name
- The most expensive item, its price, and the vendor's name
- The average price across all items

The evaluation is automatic — an AI reads your code and your CSV, checks whether the script would produce correct output, and scores it on 100 points.

**Scoring breakdown:**
- Reads CSV correctly: 20 points
- Prints total items: 10 points
- Prints cheapest item with vendor: 20 points
- Prints most expensive item with vendor: 20 points
- Prints average price: 20 points
- Script runs without errors (inferred from code quality): 10 points

You need 70 points to pass. If you score below 70, you receive specific feedback and can resubmit.

---

### Lesson 4.2 — Creating prices.csv

Create a file called `prices.csv` in your project folder. The file must have exactly these three columns in the header: `item`, `price_ugx`, `vendor`.

Use real Kampala market prices. At least 5 rows. Here is a starter template — replace with your own:

```
item,price_ugx,vendor
tomatoes,3000,Grace
onions,2500,Tendo
matoke,8000,Amara
groundnuts,5000,Fatuma
rice,12000,Ibrahim
maize_flour,4000,Naledi
cooking_oil,7500,Patrick
sugar,6000,Hadija
```

**Rules:**
- The header row must be exactly: `item,price_ugx,vendor`
- No spaces after commas
- Prices must be whole numbers (no decimal points)
- No blank rows
- No extra columns

**Verify your file:**

Open a terminal in your project folder and type:
```
$ cat prices.csv
```

You should see your data printed cleanly.

---

### Lesson 4.3 — Writing market_summary.py: step by step

Create a file called `market_summary.py` in the same folder as `prices.csv`.

**Step 1: Load the CSV into a list**

```python
import csv

def load_prices(filename):
    rows = []
    with open(filename, "r") as file:
        reader = csv.reader(file)
        next(reader)  # skip the header row
        for row in reader:
            rows.append({
                "item": row[0],
                "price": int(row[1]),
                "vendor": row[2]
            })
    return rows
```

This function reads the file and returns a list of dictionaries. Each dictionary has three keys: `item`, `price`, and `vendor`.

**Step 2: Find the cheapest and most expensive items**

```python
def find_cheapest(rows):
    cheapest = rows[0]
    for row in rows:
        if row["price"] < cheapest["price"]:
            cheapest = row
    return cheapest

def find_most_expensive(rows):
    most_expensive = rows[0]
    for row in rows:
        if row["price"] > most_expensive["price"]:
            most_expensive = row
    return most_expensive
```

These functions start by assuming the first item is the cheapest (or most expensive). Then they loop through all items. If a cheaper (or more expensive) item is found, they update the variable. At the end, they return the winner.

**Step 3: Calculate the average**

```python
def calculate_average(rows):
    total = 0
    for row in rows:
        total = total + row["price"]
    average = total / len(rows)
    return average
```

Add up all prices, then divide by the number of items.

**Step 4: Print the summary**

```python
def print_summary(rows):
    cheapest = find_cheapest(rows)
    most_expensive = find_most_expensive(rows)
    average = calculate_average(rows)

    print("=== Market Price Summary ===")
    print(f"Total items:     {len(rows)}")
    print(f"Cheapest:        {cheapest['item']} — UGX {cheapest['price']} ({cheapest['vendor']})")
    print(f"Most expensive:  {most_expensive['item']} — UGX {most_expensive['price']} ({most_expensive['vendor']})")
    print(f"Average price:   UGX {round(average)}")
```

**Step 5: Run the program**

```python
rows = load_prices("prices.csv")
print_summary(rows)
```

These two lines at the bottom call the functions and run the whole program.

**Complete file:**

```python
import csv

def load_prices(filename):
    rows = []
    with open(filename, "r") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            rows.append({
                "item": row[0],
                "price": int(row[1]),
                "vendor": row[2]
            })
    return rows

def find_cheapest(rows):
    cheapest = rows[0]
    for row in rows:
        if row["price"] < cheapest["price"]:
            cheapest = row
    return cheapest

def find_most_expensive(rows):
    most_expensive = rows[0]
    for row in rows:
        if row["price"] > most_expensive["price"]:
            most_expensive = row
    return most_expensive

def calculate_average(rows):
    total = 0
    for row in rows:
        total = total + row["price"]
    average = total / len(rows)
    return average

def print_summary(rows):
    cheapest = find_cheapest(rows)
    most_expensive = find_most_expensive(rows)
    average = calculate_average(rows)

    print("=== Market Price Summary ===")
    print(f"Total items:     {len(rows)}")
    print(f"Cheapest:        {cheapest['item']} — UGX {cheapest['price']} ({cheapest['vendor']})")
    print(f"Most expensive:  {most_expensive['item']} — UGX {most_expensive['price']} ({most_expensive['vendor']})")
    print(f"Average price:   UGX {round(average)}")

rows = load_prices("prices.csv")
print_summary(rows)
```

---

### Lesson 4.4 — Testing your script

In the terminal, navigate to your project folder:

```
$ cd prep_work
$ ls
market_summary.py   prices.csv
```

Both files should be present. Run the script:

```
$ python market_summary.py
=== Market Price Summary ===
Total items:     8
Cheapest:        onions — UGX 2500 (Tendo)
Most expensive:  rice — UGX 12000 (Ibrahim)
Average price:   UGX 5750
```

If you see output like this, the script works.

**If you get an error:** Read the error message carefully. The last line usually tells you the file and line number where the problem occurred. Ask Mshauri and paste the full error message.

**Common errors and fixes:**

- `FileNotFoundError: prices.csv` — the CSV file is not in the same folder as your script. Make sure both files are in `prep_work`.
- `ValueError: invalid literal for int()` — one of your prices in the CSV has a non-number value. Check your CSV for blank cells, text in the price column, or decimal points.
- `IndexError: list index out of range` — a row in your CSV does not have enough columns. Check for rows with missing commas.

---

### Lesson 4.5 — Committing and pushing to GitHub

Your work needs to be on GitHub for the evaluator to see it.

**Step 1: Make sure you are in your project folder**
```
$ cd prep_work
$ ls
market_summary.py   prices.csv
```

**Step 2: Check Git status**
```
$ git status
```

You should see `market_summary.py` and `prices.csv` listed as new or modified files.

**Step 3: Stage both files**
```
$ git add market_summary.py prices.csv
```

**Step 4: Commit**
```
$ git commit -m "Add market price summary script and prices data"
```

**Step 5: Push to GitHub**
```
$ git push
```

If you have not connected to GitHub yet, go back to Runway 2 Lesson 2.6.

**Step 6: Verify on GitHub**

Go to `github.com/YOUR_USERNAME/prep-work` in your browser. You should see both `market_summary.py` and `prices.csv` listed. Click on `market_summary.py` — you should see your code. If you see your code, your submission is ready.

---

### Lesson 4.6 — Submitting for evaluation

Go to the Runway dashboard and click "Submit mini-project."

Paste the URL of your GitHub repository. It should look like:
```
https://github.com/YOUR_USERNAME/prep-work
```

Not the file URL — the repository URL.

Click "Submit for evaluation." The system will:
1. Fetch `market_summary.py` and `prices.csv` from your repository
2. Ask an AI to evaluate whether the code is correct
3. Score it on 100 points
4. Return a score and specific feedback within 30 seconds

**If your score is below 70:**
You will receive feedback naming exactly what is missing. Fix the issue, commit, push, and resubmit. There is no limit on resubmissions.

**If your score is 70 or above:**
You are marked "Ready for exit assessment." You will be given a link to take the exit assessment — a final short assessment to confirm your readiness for the Developer track.

---

### Module checklist

- [ ] I have created `prices.csv` with at least 5 rows of Kampala market data
- [ ] The CSV has exactly these columns: `item`, `price_ugx`, `vendor`
- [ ] My `market_summary.py` prints the total number of items
- [ ] My script prints the cheapest item with its vendor name
- [ ] My script prints the most expensive item with its vendor name
- [ ] My script prints the average price
- [ ] Running `python market_summary.py` produces output without errors
- [ ] Both files are committed to Git with a clear commit message
- [ ] I have pushed the project to a public GitHub repository
- [ ] I have the GitHub repository URL ready to paste into the submission form

---

### Common questions

**Q: The evaluator says "Could not fetch files from GitHub"**
Check that: (1) your repository is set to Public, not Private; (2) the files are named exactly `market_summary.py` and `prices.csv`; (3) the files are in the root of the repository (not inside a subfolder).

**Q: I scored 50 and the feedback says "does not print cheapest with vendor"**
Your script is printing the cheapest item's name and price but not the vendor name. Update your print statement to include `cheapest['vendor']`.

**Q: My script works on my computer but the evaluator gives a low score**
The evaluator reads your code statically. Make sure there are no hardcoded values — your script must actually read from `prices.csv` using `csv.reader`, not have the values typed directly in the code.

**Q: Can I use pandas instead of the csv module?**
For this project, use the `csv` module as shown. Pandas is a popular library for data work but it is not built into Python and introduces complexity that is not needed here. The evaluator is specifically checking for `csv.reader` usage.

---

### What you can do now

You have built a complete working Python project from scratch — a data processing script with real Kampala market data, tracked with Git, and published on GitHub. You know how to read a file, process data with a loop, find minimums and maximums, calculate averages, and print formatted output.

This is a genuine software deliverable. You built it. That means you are ready for the Developer track.
