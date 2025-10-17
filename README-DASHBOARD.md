# Test Coverage Dashboard - Setup Instructions

## 🎯 Overview
This dashboard provides real-time monitoring of test coverage metrics for the Unicorn Finance project, designed for engineering managers to track progress toward the 90% coverage goal.

## 🚀 Running Locally

### Option 1: Open Directly in Browser (Recommended)
The dashboard is a standalone HTML file with no dependencies required.

1. **Navigate to the repository:**
   ```bash
   cd /path/to/unicorn-finance
   ```

2. **Open the dashboard:**
   - **On Mac:**
     ```bash
     open test-coverage-dashboard.html
     ```
   
   - **On Linux:**
     ```bash
     xdg-open test-coverage-dashboard.html
     ```
   
   - **On Windows:**
     ```bash
     start test-coverage-dashboard.html
     ```
   
   - **Or simply:** Double-click `test-coverage-dashboard.html` in your file explorer

### Option 2: Using a Local Server
If you prefer to serve it via HTTP:

```bash
# Using Python 3
cd /path/to/unicorn-finance
python3 -m http.server 8080

# Then open: http://localhost:8080/test-coverage-dashboard.html
```

```bash
# Using Node.js (if you have npx)
cd /path/to/unicorn-finance
npx serve .

# Then open the URL shown in terminal + /test-coverage-dashboard.html
```

## 📊 Dashboard Features

### Scorecard Metrics
- **Overall Coverage**: Current backend test coverage percentage
- **Files Tested**: Number of tested vs total critical files
- **Test Cases**: Total passing test count
- **Target Progress**: Progress toward 90% coverage goal

### AI Executive Summary
- Current status assessment
- Key recommendations
- Sprint targets

### Prioritized File List
Files are prioritized by:
- **Critical**: Security & core infrastructure (JWT signing, secrets management)
- **High**: Business logic (API request handlers, configurations)
- **Medium**: State management (React contexts)
- **Low**: UI components

Each file shows:
- Current coverage percentage
- Lines of code
- Impact level
- Reason for prioritization
- Test status

## 🔄 Updating the Dashboard

The dashboard currently shows static data from October 17, 2025. To update it with fresh coverage data:

1. **Run the backend tests:**
   ```bash
   cd app/server
   yarn test:coverage
   ```

2. **Update the HTML file** with new metrics from the coverage report

3. **For future automation**, you can create a script to parse `coverage/coverage-summary.json` and update the HTML dynamically.

## 🎨 Design

The dashboard uses **JPMorgan Chase brand colors**:
- Primary Blue: #117ACA
- Dark Blue: #003366
- Navy: #0B2545
- Success Green: #10B981
- Warning Orange: #F59E0B

## 📝 Notes

- The dashboard is completely standalone - no internet connection required
- All data is embedded in the HTML file
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- No build step or dependencies needed

## 🔗 Related Links

- [Main PR #3](https://github.com/bashargmahmoud-ui/unicorn-finance/pull/3) - Test coverage implementation
- [Devin Session](https://app.devin.ai/sessions/70311d15be844c0b91e05a764bf550ac)
