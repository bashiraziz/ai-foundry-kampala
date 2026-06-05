## FAQ — Module 3: Python Basics

**Track:** Prep
**Type:** FAQ — built from live sessions
**Last updated:** June 2026

This file is updated after each Saturday session. Every entry comes from a real student question. Do not edit entries once written — add new ones at the bottom.

---

### Q: Python is installed but when I type `python` the terminal opens a Microsoft Store page

**A:** On Windows 10 and 11, Microsoft ships a stub "python" command that opens the Store instead of running Python. To fix this:

Option 1 — Use `python3` instead of `python`:
```
$ python3 --version
```

Option 2 — Disable the Store redirect:
1. Open Windows Settings → Apps → Advanced app settings → App execution aliases
2. Find "python.exe" and "python3.exe" and turn them both Off
3. Close and reopen Git Bash
4. Now `python` should point to your installed Python

Option 3 — Use the full path:
```
$ /c/Users/YourName/AppData/Local/Programs/Python/Python312/python.exe --version
```

The most reliable fix for this course is Option 1: use `python3` consistently.

---

### Q: I get "IndentationError: expected an indented block"

**A:** Python uses indentation (spaces at the start of a line) to know which code belongs inside a loop, function, or if-statement. This error means you started a block (a `for`, `def`, or `if` line ending with `:`) but the next line has no indentation.

Example of the error:
```python
for item in items:
print(item)  # ERROR: this line should be indented
```

Correct:
```python
for item in items:
    print(item)  # 4 spaces before print
```

The fix: add 4 spaces at the beginning of the line that should be inside the block.

**Mixed tabs and spaces** also causes this error. Use only spaces — not tabs — for indentation in your Python files. Most text editors can be configured to insert spaces when you press Tab. In VS Code, click the "Spaces: 4" indicator at the bottom right of the window to confirm.

---

### Q: I get "TypeError: can only concatenate str (not int) to str"

**A:** You are trying to combine text with a number using `+`, but Python requires both to be the same type.

Example of the error:
```python
price = 3000
print("Price is: " + price)  # ERROR
```

Fix option 1 — use an f-string:
```python
price = 3000
print(f"Price is: {price}")  # works
```

Fix option 2 — convert the number to a string:
```python
price = 3000
print("Price is: " + str(price))  # works
```

For this course, always use f-strings when combining text and variables. They are cleaner and less error-prone.

---

### Q: I get "ValueError: invalid literal for int() with base 10: ''"

**A:** You are calling `int()` on an empty string or a string that is not a number.

The most common cause when reading CSV files: there is a blank row at the end of your CSV. When the CSV reader reads the blank row, `row[1]` is an empty string `""`, and `int("")` fails.

Fix: open your `prices.csv` file in a text editor and delete any blank lines at the end. Save the file.

Another common cause: the CSV has a header row and you forgot `next(reader)` to skip it. The first row would be `["item", "price_ugx", "vendor"]`, and `int("price_ugx")` fails.

Fix: make sure your code includes `next(reader)` after creating the reader:
```python
reader = csv.reader(file)
next(reader)  # skip the header
for row in reader:
    price = int(row[1])
```

---

### Q: My loop runs but it only processes the first item, not all of them

**A:** Check two things:

1. **Is there a `return` or `break` inside the loop?** These stop the loop after the first iteration.

2. **Is your loop body properly indented?** If the `print` or processing code is not indented under the `for` line, it will only run once after the loop finishes, not inside it.

Example of the problem:
```python
for row in rows:
    item = row["item"]
print(item)  # this is OUTSIDE the loop — runs once after all items
```

Correct:
```python
for row in rows:
    item = row["item"]
    print(item)  # this is INSIDE the loop — runs for every item
```

Count your spaces carefully. Every line inside the loop must start with exactly 4 spaces.

---

### Q: What does `None` mean? My function returns None unexpectedly

**A:** `None` is Python's way of representing "nothing" or "no value." A function that does not have a `return` statement automatically returns `None`.

Example:
```python
def find_cheapest(rows):
    cheapest = rows[0]
    for row in rows:
        if row["price"] < cheapest["price"]:
            cheapest = row
    # forgot to return!

result = find_cheapest(items)
print(result)  # prints: None
```

Fix: add `return cheapest` at the end of the function:
```python
def find_cheapest(rows):
    cheapest = rows[0]
    for row in rows:
        if row["price"] < cheapest["price"]:
            cheapest = row
    return cheapest  # now it returns the value
```

---

### Q: I get "FileNotFoundError: [Errno 2] No such file or directory: 'prices.csv'"

**A:** Python is looking for `prices.csv` but cannot find it. The most common cause: you are running your script from a different folder than where `prices.csv` is.

In the terminal, navigate to the folder that contains both files before running the script:

```
$ ls
market_summary.py   prices.csv
$ python market_summary.py
```

Both files must be visible in `ls`. If only `market_summary.py` is there, either `prices.csv` is in a different location or it has not been created yet.

If you are in VS Code and clicking "Run", the terminal may be in a different directory. Open a regular terminal, navigate to your project folder, and run from there.

---

### Q: I am confused about when to use `int()` vs `float()`

**A:** Use `int()` for whole numbers — prices in UGX, counts, quantities. Use `float()` for numbers with decimal points.

For the mini-project, all prices are in whole UGX, so `int()` is correct.

The average calculation will naturally produce a float even when dividing two integers:
```python
average = 30500 / 8
print(average)  # 3812.5
```

To round to the nearest whole number when printing: `round(average)`.

---

### Q: How do I know if my code is inside a function or at the top level?

**A:** Look at indentation. Code at the left margin (no spaces before it) is at the "top level" — it runs when the file is run. Code indented under a `def` line runs only when that function is called.

```python
# This is top-level code — runs immediately when you run the file
print("This runs first")

def greet():
    # This is inside the function — only runs when greet() is called
    print("Hello")

# This is top-level — runs when the file reaches this line
greet()
```

For the mini-project: your function definitions (`def load_prices(...)`, `def find_cheapest(...)`, etc.) should be at the top level with no indentation. The calls to those functions (`rows = load_prices("prices.csv")`) should also be at the top level.

---

### Q: My average calculation shows many decimal places. How do I round it?

**A:** Use `round()`:

```python
average = 3812.5
print(round(average))      # 3813 (rounds to nearest integer)
print(round(average, 2))   # 3812.5 (rounds to 2 decimal places)
```

For the summary output, `round(average)` with no second argument rounds to the nearest whole number, which is clean for UGX prices.

```python
print(f"Average price:   UGX {round(average)}")
```
