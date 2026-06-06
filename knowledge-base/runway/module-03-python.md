## [Runway 3] — Python Basics

**Track:** Prep
**Module:** 3 of 4

---

### What you will learn

By the end of this module you will be able to write and run Python scripts from the terminal, store and manipulate data using variables, lists, and loops, define reusable functions, and read data from CSV files. These are the exact skills needed for the mini-project.

---

### Why this matters

Python is the language of AI. Almost every AI tool, every data pipeline, every automation script in the Developer track uses Python. You do not need to master it before joining — but you need to be able to read it, write simple scripts, and debug errors.

**Kampala analogy:** Python is like a very obedient shop assistant who follows instructions written on cards. Each line of your script is one instruction. The assistant reads the cards from top to bottom and does exactly what each card says. If you write a card incorrectly, the assistant stops and tells you what confused them — that is an error message.

---

### Lesson 3.1 — Installing Python and running your first script

**Installing Python:**

Go to python.org/downloads. Click the big "Download Python 3.x" button.

**Windows:** Run the installer. IMPORTANT: on the first screen, tick "Add Python to PATH" before clicking Install. Without this, the terminal will not find Python.

**Mac:** Python 3 may already be installed. Check with `python3 --version`. If not, download from python.org.

**Ubuntu/Linux:** `sudo apt install python3`

**Checking your installation:**

```
$ python --version
Python 3.12.3
```

On Mac/Linux you may need `python3` instead of `python`:
```
$ python3 --version
Python 3.12.3
```

**Writing your first script:**

Create a file called `hello.py` in your `prep_work` folder. Open it in a text editor and write:

```python
print("Hello from Kampala!")
```

Save the file. In the terminal, run it:

```
$ python hello.py
Hello from Kampala!
```

You have just run a Python program. Everything else is building on this.

---

### Lesson 3.2 — Variables

A variable is a named container that holds a value. You use `=` to put a value into a container.

```python
item = "tomatoes"
price = 3000
vendor = "Grace"
in_stock = True
```

Here, `item` holds the text "tomatoes", `price` holds the number 3000, `vendor` holds "Grace", and `in_stock` holds the boolean value True.

**Data types:**

- `str` (string) — text, written in quotes: `"tomatoes"`, `'Grace'`
- `int` (integer) — whole number: `3000`, `42`, `0`
- `float` (floating point) — decimal number: `3.14`, `2750.50`
- `bool` (boolean) — True or False (capital T and F)

**Using variables:**

```python
item = "tomatoes"
price = 3000
print(item)       # prints: tomatoes
print(price)      # prints: 3000
print(price + 500) # prints: 3500
```

**f-strings — combining text and variables:**

An f-string lets you embed variables directly inside text:

```python
vendor = "Grace"
item = "tomatoes"
price = 3000
print(f"{vendor} sells {item} for UGX {price}")
# prints: Grace sells tomatoes for UGX 3000
```

The `f` before the quote marks the string as an f-string. Variables inside `{}` are replaced with their values.

**Changing a variable:**

```python
price = 3000
print(price)  # 3000
price = 3500
print(price)  # 3500
```

A variable's value can be changed at any time by assigning a new value.

---

### Lesson 3.3 — Lists

A list holds multiple values in a single variable.

```python
vendors = ["Grace", "Tendo", "Amara", "Fatuma", "Ibrahim"]
```

**Accessing items:**

Lists are numbered starting from 0 (not 1). This is called zero-based indexing.

```python
print(vendors[0])  # Grace
print(vendors[1])  # Tendo
print(vendors[4])  # Ibrahim
```

**Finding the length:**

```python
print(len(vendors))  # 5
```

**Adding an item:**

```python
vendors.append("Naledi")
print(len(vendors))  # 6
```

**A list of dictionaries:**

In real programs, you often have lists of objects, where each object has multiple properties. Python uses a `dict` (dictionary) for this:

```python
market_items = [
    {"item": "tomatoes", "price": 3000, "vendor": "Grace"},
    {"item": "onions", "price": 2500, "vendor": "Tendo"},
    {"item": "matoke", "price": 8000, "vendor": "Amara"},
]
```

Access a specific field:
```python
print(market_items[0]["item"])    # tomatoes
print(market_items[1]["price"])   # 2500
```

**Kampala analogy:** A list is like a numbered register of vendors at Owino market. Vendor 0 is in stall 0, vendor 1 is in stall 1. You can look up any vendor by their stall number.

---

### Lesson 3.4 — Loops

A loop repeats an action for each item in a list.

```python
vendors = ["Grace", "Tendo", "Amara", "Fatuma"]

for vendor in vendors:
    print(f"Welcome, {vendor}!")
```

Output:
```
Welcome, Grace!
Welcome, Tendo!
Welcome, Amara!
Welcome, Fatuma!
```

Python reads this as: "For each vendor in the list called vendors, run the indented code below, where `vendor` refers to the current item."

**Indentation matters in Python.** The code inside the loop must be indented by 4 spaces (or one tab). If the indentation is wrong, Python will give an error.

**A loop that calculates:**

```python
prices = [3000, 2500, 8000, 5000, 12000]
total = 0

for price in prices:
    total = total + price

print(f"Total: UGX {total}")
# Total: UGX 30500
```

**Kampala analogy:** A loop is a market vendor walking down a row of customers, calling out the same greeting to each one. The vendor does not know in advance how many customers are in the row — they just keep going until the row ends.

---

### Lesson 3.5 — Functions

A function is a reusable block of code with a name. You define it once and call it many times.

```python
def calculate_total(price, quantity):
    result = price * quantity
    return result

total = calculate_total(8000, 3)
print(f"Total: UGX {total}")
# Total: UGX 24000
```

**`def`** starts the function definition.
**`calculate_total`** is the function name.
**`price, quantity`** are parameters — the inputs the function expects.
**`return`** sends a value back to the caller.

**A function with no return value:**

```python
def greet_vendor(name, item):
    print(f"Hello {name}, I see you sell {item} today.")

greet_vendor("Grace", "tomatoes")
greet_vendor("Tendo", "onions")
```

**Kampala analogy:** A function is a standard operating procedure written on a card. "To calculate the total for a sale: multiply the price by the quantity, then write down the result." You write the SOP once. Every time you need to calculate a total, you follow the card — you do not rewrite the instructions.

**Why functions matter:** Without functions, if you need the same calculation in 5 places in your script, you write it 5 times. If the calculation changes, you have to update it in 5 places and might miss one. With a function, you update it once.

---

### Lesson 3.6 — Reading a CSV file

CSV stands for "Comma-Separated Values." It is a simple text file where each line is a row of data, and the values in each row are separated by commas. It is the most common format for sharing data.

A `prices.csv` file looks like this:
```
item,price_ugx,vendor
tomatoes,3000,Grace
onions,2500,Tendo
matoke,8000,Amara
groundnuts,5000,Fatuma
rice,12000,Ibrahim
```

The first line is the header — the column names. Each following line is one row of data.

**Reading CSV in Python:**

```python
import csv

with open("prices.csv", "r") as file:
    reader = csv.reader(file)
    next(reader)  # skip the header row
    for row in reader:
        item = row[0]
        price = int(row[1])
        vendor = row[2]
        print(f"{vendor} sells {item} for UGX {price}")
```

Output:
```
Grace sells tomatoes for UGX 3000
Tendo sells onions for UGX 2500
Amara sells matoke for UGX 8000
Fatuma sells groundnuts for UGX 5000
Ibrahim sells rice for UGX 12000
```

Key details:
- `import csv` loads Python's built-in CSV module
- `with open(...) as file:` opens the file safely (closes it automatically when done)
- `csv.reader(file)` creates an object that reads one row at a time
- `next(reader)` skips the first row (the header)
- `row[0]`, `row[1]`, `row[2]` are the first, second, and third columns
- `int(row[1])` converts the price from text to a number (CSV always reads everything as text)

**Error you will encounter:** If you forget `int()`, you will try to do arithmetic on text and get a `TypeError`. The fix is always to wrap the number column in `int()`.

---

### Module checklist

- [ ] I have Python installed and can run `python --version` in the terminal
- [ ] I can create a `.py` file and run it with `python filename.py`
- [ ] I can store values in variables (strings, integers, booleans)
- [ ] I can build text output using f-strings
- [ ] I can create a list and access items by index
- [ ] I can write a `for` loop that processes each item in a list
- [ ] I can write a function that takes inputs and returns a value
- [ ] I can read a CSV file using `import csv` and process each row

---

### Common questions

**Q: I get "python: command not found" or "python is not recognized"**
On Mac/Linux try `python3` instead of `python`. On Windows, Python was not added to PATH during installation — uninstall Python and reinstall, making sure to tick "Add Python to PATH" on the first screen.

**Q: I get "IndentationError"**
Python is strict about indentation. The code inside a loop or function must be consistently indented (4 spaces recommended). Check that you are not mixing tabs and spaces — use only spaces.

**Q: I get "TypeError: can only concatenate str (not int) to str"**
You are trying to combine text and a number without converting. Use f-strings: `f"Price is {price}"` instead of `"Price is " + price`. Or convert the number to text: `"Price is " + str(price)`.

**Q: I get "ValueError: invalid literal for int() with base 10"**
You are trying to convert text to an integer but the text is not a number. Check your CSV — there may be a blank row, a header row being read as data, or a column with text in it.

**Q: My loop runs but nothing prints**
Check your indentation. The `print` statement might not be inside the loop. Also check that your list is not empty.

**Q: I am not sure what an error message means**
Copy the error message exactly and ask Mshauri. Error messages contain the exact information needed to fix the problem.

---

### What you can do now

You can write Python scripts that store data in variables, process lists of items using loops, define reusable functions, and read data from CSV files. These are the building blocks for the mini-project.

You are ready for Runway 4: The Mini-Project.
