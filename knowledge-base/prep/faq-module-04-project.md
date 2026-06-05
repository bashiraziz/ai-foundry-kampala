## FAQ — Runway 4: The Mini-Project

**Track:** Prep
**Type:** FAQ — built from live sessions
**Last updated:** June 2026

This file is updated after each Saturday session. Every entry comes from a real student question. Do not edit entries once written — add new ones at the bottom.

---

### Q: The evaluator says "Could not fetch files from GitHub" — what is wrong?

**A:** The evaluator fetches files from a specific URL pattern:
```
https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/market_summary.py
https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/prices.csv
```

The most common causes of this error:

1. **The repository is Private, not Public.** Go to Settings → Danger Zone → Change visibility → Make public.

2. **The files are named differently.** The evaluator looks for exactly `market_summary.py` and `prices.csv`. If your files are named `Market_Summary.py`, `market-summary.py`, `price_data.csv`, or anything different, it will not find them. Rename the files and re-commit.

3. **The files are in a subfolder.** The evaluator looks in the root of the repository. Make sure `market_summary.py` and `prices.csv` are not inside any subfolder — they should be at the top level.

4. **The branch is not called `main`.** If you initialised your repository and the branch is called `master` instead of `main`, rename it:
   ```
   $ git branch -M main
   $ git push -u origin main
   ```

To test before submitting: open an incognito browser window and go to `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/prices.csv`. You should see your CSV data. If you see a 404 page or a GitHub login, fix the issue before submitting.

---

### Q: I scored 40 points — the feedback says my script does not read from the CSV

**A:** This means the evaluator determined your script does not actually read `prices.csv` — perhaps the data is typed directly into the code (hardcoded) instead of being read from the file.

The evaluator replaces your `prices.csv` with different data to check. If your script has the answers hardcoded, they will not match the evaluator's data.

Your script must use `import csv` and `csv.reader` to read the file. Example of what is required:

```python
import csv

with open("prices.csv", "r") as file:
    reader = csv.reader(file)
    next(reader)  # skip header
    for row in reader:
        # process each row
```

If your script contains lines like `item = "tomatoes"` with the data typed in directly, that is the problem. Replace them with actual file-reading code.

---

### Q: I scored 60 points — my script is missing the vendor name in the output

**A:** Your script is printing the cheapest or most expensive item's name and price, but not the vendor's name. Look at your print statements.

Required format for full points:
```
Cheapest:        onions — UGX 2500 (Tendo)
Most expensive:  rice — UGX 12000 (Ibrahim)
```

Your print statement should include all three values:
```python
print(f"Cheapest:        {cheapest['item']} — UGX {cheapest['price']} ({cheapest['vendor']})")
```

If your output only shows:
```
Cheapest item: onions, 2500
```
That is missing the vendor name. Add `cheapest['vendor']` to your print statement.

---

### Q: The script works on my computer but I am scared the evaluator will see something different

**A:** The evaluator uses an AI to read your code and determine whether it is logically correct. It does not actually run the code on a server. This means:

- You do not need a specific Python version
- You do not need any special libraries beyond the built-in `csv` module
- The evaluator can read code even if there is a small syntax issue

However, the evaluator does check logic — whether your algorithm for finding the cheapest item actually works, whether you are computing the average correctly, etc. Test your code locally first and make sure it produces correct output for your own `prices.csv`.

---

### Q: I submitted and got a score of 70 — can I try to improve it?

**A:** Yes, you can resubmit as many times as you like. If you scored 70, you have already passed — the exit assessment is unlocked. Whether to try for a higher score is your choice.

If you want to improve, read the feedback carefully, fix the specific issue mentioned, commit the change, push to GitHub, and resubmit.

---

### Q: I am not sure if my CSV format is correct

**A:** Your `prices.csv` file should look exactly like this (with your own data):

```
item,price_ugx,vendor
tomatoes,3000,Grace
onions,2500,Tendo
```

Check these things:
- First line is exactly `item,price_ugx,vendor` (no spaces, no quotes)
- Each data row has exactly 3 values separated by commas
- Prices are whole numbers (no UGX symbol, no commas in the number, no decimals)
- No blank lines anywhere in the file
- At least 5 data rows (not counting the header)

To verify, open Git Bash and:
```
$ cat prices.csv
```
You should see clean data. If you see any extra characters or blank lines, fix them in your text editor.

---

### Q: I pushed my fixes but the evaluator still shows the old score after resubmission

**A:** The evaluator fetches the current state of your files from GitHub each time you submit. After pushing, wait about 30 seconds and then resubmit. GitHub takes a few seconds to update the raw file URLs.

If you are certain you pushed the fix (`git push` completed without errors), go to your GitHub repository in the browser and check that the file content has updated. If the old code is still showing on GitHub, your push may not have worked — check `git log` to confirm the latest commit is there.

---

### Q: My script crashes with "ZeroDivisionError: division by zero"

**A:** This happens in your `calculate_average` function if `len(rows)` is zero — meaning your CSV loaded with no data rows.

Check if your `next(reader)` call is skipping the wrong row. If your CSV has no header row, `next(reader)` will skip the first data row. Make sure your CSV has a header row as the first line.

Also check for a completely empty `prices.csv` file. Open it and verify it has data.

```python
rows = load_prices("prices.csv")
print(f"Loaded {len(rows)} rows")  # add this temporarily to debug
print_summary(rows)
```

If it prints "Loaded 0 rows", the CSV is not being read correctly.

---

### Q: I am stuck and I do not know what to try next

**A:** This is a normal part of learning to code. When stuck:

1. Read the error message slowly, word by word. The last line usually names the file and line number. Go to that line.

2. Add print statements to see what your variables contain at different points:
   ```python
   rows = load_prices("prices.csv")
   print("Rows loaded:", len(rows))
   print("First row:", rows[0] if rows else "EMPTY")
   ```

3. Ask Mshauri. Paste the full error message and the relevant part of your code. The more specific you are, the more specific the help.

4. Take a break and come back. Seriously. Code problems that seem impossible often become obvious after 10 minutes away from the screen.

Being stuck is not a sign that you cannot do this. It is the exact feeling that every developer experiences every day. The skill is not avoiding being stuck — it is knowing how to get unstuck.
