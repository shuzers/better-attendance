# 📊 CUTM Better Attendance Browser Extension

A powerful browser extension that enhances the standard university attendance table by providing **real-time visual feedback** and **actionable insights** on your attendance status.  

This is specifically and strictly only for CUTM ERP

Easily track your progress and know exactly:
- ✅ How many classes you can afford to **bunk**, or  
- 📈 How many you need to **attend** to maintain the required percentage (default: **75%**).

---

## ✨ Features

### 🧮 Combined Attendance Tracking
Automatically groups attendance data for courses that appear on multiple rows (e.g., **theory** and **practical** sections) and calculates a single, accurate combined percentage.

### 🎯 Visual Progress Indicator
Adds a **vibrant, color-coded SVG progress circle** column that gives instant visual feedback on your current standing.

### 📊 Actionable Status Column
A new column clearly displays one of two helpful messages:
- 🟢 **Can Bunk X classes** – Shows the maximum classes you can miss before falling below target.
- 🔴 **Attend Y classes** – Shows how many consecutive classes you must attend to reach 75%.

### 🌈 Responsive Color Coding
Colors change dynamically based on your current attendance:
| Color | Meaning | Range |
|:------|:--------|:------|
| 🟢 Green / Safe | Above target | > 80% |
| 🟡 Yellow / Caution | Near target | 75–80% |
| 🔴 Red / Urgent | Below target | < 75% |

---

## 🛠️ Installation

This extension works on all **Chromium-based browsers** (e.g., Google Chrome, Microsoft Edge).

### Option 1: Install from Browser Store *(Coming Soon)*
The extension will soon be available on:
- **Microsoft Edge Add-ons** Store  
- **Chrome Web Store**

Once available:
1. Search for **“University Attendance Calculator”**.
2. Click **Install** to add it to your browser.

---

### Option 2: Load Unpacked Extension *(Manual Method)*

If you want to use it right now:

1. **Download the Release**
   - Get the latest ZIP file from the project’s **Releases** page.

2. **Extract the Files**
   - Extract the ZIP contents to a permanent folder (e.g., `AttendanceExtension`).
   - Don’t move or delete this folder afterward.
   - Add 3 images named icon16,icon48,icon128 serving as the logo and title for the extension if you fork it.

3. **Enable Developer Mode**
   - For **Chrome**: Go to `chrome://extensions`  
   - For **Edge**: Go to `edge://extensions`  
   - Toggle **Developer mode** ON (top right corner).

4. **Load Unpacked**
   - Click **Load unpacked** → Select the folder you extracted earlier.

5. **View Your Attendance**
   - Go to your university’s attendance portal.  
   - The new **progress circle** and **status columns** will appear automatically!

---

## ⚙️ Logic Explained

The core logic revolves around simple, iterative calculations that determine your **safe bunk count** or **required attendance count**.

| Status | Condition | Logic |
|:--------|:-----------|:------|
| 🟢 **Bunk Safe** | Current % ≥ Target % | Iteratively simulates missed classes `(attended / delivered)` until below target → gives **max bunkable classes**. |
| 🔴 **Attend Urgent** | Current % < Target % | Iteratively simulates attended classes `(attended / delivered)` until target reached → gives **min classes to attend**. |

---

## 💻 Development

All functionality resides in a single JavaScript file: `content.js`.

### 🔑 Key Functions

| Function | Description |
|:----------|:-------------|
| `addAttendanceCalculatorColumn()` | Main function — locates the attendance table, groups rows by course, computes combined attendance, and adds visual/status columns. |
| `calculateBunkStatus(a, d, p)` | Determines how many classes must be attended or can be bunked given current data. |
| `createProgressCircle(p)` | Builds the animated, color-coded SVG ring for visual progress indication. |

---

## 🤝 Contribution

Contributions are welcome!  


