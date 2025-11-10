# SIGECO MVP - Test Execution Guide

## Quick Start

This guide provides step-by-step instructions for executing the complete validation and stability testing suite for SIGECO MVP.

---

## Pre-Test Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Type Check and Lint
```bash
npm run validate
```

Expected output: No errors

### 3. Start Development Server
```bash
npm run dev
```

Expected output: Server running on `http://localhost:5173`

---

## Automated Validation

### Step 1: Run Build Validation
```bash
npm run validate
```

This command runs:
- TypeScript type checking (`tsc --noEmit`)
- ESLint validation
- Production build test

**Expected Result:** All checks pass with no errors

### Step 2: Run Console Validation Script

1. Open the application in your browser: `http://localhost:5173`
2. Open browser DevTools (F12 or Ctrl+Shift+I)
3. Go to the Console tab
4. Copy the contents of `scripts/validate-console.js`
5. Paste into the console and press Enter

**Expected Result:** 
- All automated tests pass
- Helper functions are available for further testing

---

## Manual Testing Procedures

### Test Suite 1: Navigation and Console Errors

**Objective:** Verify zero console errors across all pages

**Steps:**
1. Clear console (Ctrl+L or click clear button)
2. Navigate to Home (`/`)
   - Check console: 0 errors ✓
3. Navigate to Login (`/login`)
   - Check console: 0 errors ✓
4. Navigate to Porteiro Dashboard (`/porteiro-dashboard`)
   - Check console: 0 errors ✓
5. Navigate to Admin Dashboard (`/admin-dashboard`)
   - Check console: 0 errors ✓
6. Navigate to invalid route (`/invalid-test-route`)
   - Check console: 0 errors ✓
   - Verify 404 page displays ✓

**Pass Criteria:** Zero console errors on all pages

---

### Test Suite 2: Error Boundary Testing

**Objective:** Verify Error Boundaries catch and handle errors gracefully

**Steps:**

#### Test 2.1: Trigger Error in Console
1. Navigate to `/porteiro-dashboard`
2. Open console
3. Execute: `throw new Error("Manual test error")`
4. Verify:
   - Error Boundary catches the error ✓
   - Friendly error message displays ✓
   - "Tentar Novamente" button is visible ✓
5. Click "Tentar Novamente"
6. Verify page recovers successfully ✓

#### Test 2.2: Verify Error Logging
1. In console, execute: `viewLogs()`
2. Verify the test error appears in logs ✓
3. Check log entry contains:
   - Timestamp ✓
   - Error level ✓
   - Error message ✓
   - Stack trace ✓

**Pass Criteria:** 
- Error Boundary displays and recovers
- Error is logged with all required fields

---

### Test Suite 3: Report Generation

**Objective:** Verify PDF and Excel reports generate and download successfully

**Steps:**

#### Test 3.1: PDF Report
1. Navigate to Admin Dashboard
2. Go to Relatórios section
3. Apply filters:
   - Período: "Última semana"
   - Tipo: "Visitante"
4. Click "Gerar PDF"
5. Verify:
   - Loading spinner appears ✓
   - Generation completes in < 5 seconds ✓
   - PDF downloads automatically ✓
   - No console errors ✓
6. Open downloaded PDF
7. Verify:
   - Report header present ✓
   - Data matches filters ✓
   - Formatting is correct ✓
   - Footer with date ✓

#### Test 3.2: Excel Report
1. Apply different filters:
   - Período: "Último mês"
   - Status: "Autorizado"
2. Click "Gerar Excel"
3. Verify:
   - Loading spinner appears ✓
   - Generation completes in < 5 seconds ✓
   - Excel downloads automatically ✓
   - No console errors ✓
4. Open downloaded Excel file
5. Verify:
   - Multiple sheets exist ✓
   - Data sheet has correct data ✓
   - Statistics sheet has calculations ✓
   - Data matches filters ✓

#### Test 3.3: Error Handling
1. Apply invalid filters (if possible)
2. Attempt to generate report
3. Verify:
   - Appropriate error message displays ✓
   - No file downloads ✓
   - No console errors ✓

**Pass Criteria:**
- Both report types generate successfully
- Files download automatically
- Content is accurate
- No console errors

---

### Test Suite 4: Analytics Testing

**Objective:** Verify analytics work with and without ad blockers

**Steps:**

#### Test 4.1: Without Ad Blocker
1. Disable any ad blocker extensions
2. Clear console
3. Refresh application
4. Perform actions:
   - Navigate to login
   - Navigate to dashboard
   - Generate a report
5. In console, execute: `viewAnalytics()`
6. Verify events are tracked ✓

#### Test 4.2: With Ad Blocker
1. Enable ad blocker extension (uBlock Origin, AdBlock, etc.)
2. Clear console
3. Refresh application
4. Perform same actions:
   - Navigate to login
   - Navigate to dashboard
   - Generate a report
5. Verify:
   - No console errors ✓
   - Application functions normally ✓
6. In console, execute: `viewAnalytics()`
7. Verify events are queued locally ✓

**Pass Criteria:**
- Analytics work without ad blocker
- No errors with ad blocker enabled
- Events are queued when blocked

---

### Test Suite 5: CORS Validation

**Objective:** Verify no CORS errors in console

**Steps:**
1. Clear console
2. Open Network tab in DevTools
3. Refresh application
4. Check Console tab:
   - Verify no CORS errors ✓
   - Verify no "blocked by CORS policy" messages ✓
5. Check Network tab:
   - Filter by "Font"
   - Verify all fonts load from local sources ✓
   - Filter by "CSS"
   - Verify all stylesheets load successfully ✓
   - Filter by "JS"
   - Verify all scripts load successfully ✓

**Pass Criteria:**
- Zero CORS errors
- All resources load successfully
- All fonts are local

---

### Test Suite 6: Logging System

**Objective:** Verify logging system works correctly

**Steps:**

#### Test 6.1: View Logs
1. In console, execute: `viewLogs()`
2. Verify logs display in table format ✓
3. Check log entries have:
   - id ✓
   - timestamp ✓
   - level ✓
   - message ✓
   - context ✓

#### Test 6.2: Test Log Limit
1. Check current log count
2. If < 100, generate more errors to test limit
3. Verify only 100 most recent entries are kept ✓

#### Test 6.3: Export Logs
1. In console, execute: `exportResults()`
2. Verify JSON file downloads ✓
3. Open file and verify it contains validation results ✓

**Pass Criteria:**
- Logs are stored correctly
- 100 entry limit is enforced
- Export functionality works

---

### Test Suite 7: Performance Testing

**Objective:** Verify performance meets targets

**Steps:**

#### Test 7.1: Initial Load Time
1. Clear browser cache
2. Open DevTools Performance tab
3. Start recording
4. Navigate to `http://localhost:5173`
5. Stop recording when page is interactive
6. Measure time to interactive
7. Verify: < 2 seconds ✓

#### Test 7.2: Report Generation Performance
1. Navigate to reports page
2. Apply filters with 100+ records
3. Start timer
4. Click "Gerar PDF"
5. Stop timer when download starts
6. Verify: < 5 seconds ✓
7. Repeat for Excel ✓

#### Test 7.3: Navigation Performance
1. Measure time between page navigations
2. Navigate: Home → Login → Dashboard
3. Verify each transition: < 500ms ✓

**Pass Criteria:**
- Initial load < 2 seconds
- Report generation < 5 seconds
- Navigation < 500ms

---

### Test Suite 8: Cross-Browser Testing

**Objective:** Verify application works in multiple browsers

**Steps:**

#### Test in Chrome/Edge
1. Run all test suites above
2. Document any issues
3. Overall result: PASS/FAIL

#### Test in Firefox
1. Run all test suites above
2. Document any issues
3. Overall result: PASS/FAIL

#### Test in Safari (if available)
1. Run all test suites above
2. Document any issues
3. Overall result: PASS/FAIL

**Pass Criteria:**
- All tests pass in all browsers
- No browser-specific issues

---

## Test Results Documentation

### Recording Results

Use the comprehensive validation guide at `scripts/validate-stability.md` to document all test results.

### Quick Results Check

In browser console, execute:
```javascript
exportResults()
```

This will download a JSON file with all automated test results.

---

## Troubleshooting

### Issue: Console shows errors
**Solution:** 
1. Note the error message
2. Check if it's related to a specific component
3. Review Error Boundary implementation
4. Check logs: `viewLogs()`

### Issue: Reports don't download
**Solution:**
1. Check console for errors
2. Verify ReportService is imported correctly
3. Check browser download settings
4. Verify data is available for report

### Issue: Analytics not working
**Solution:**
1. Check if ad blocker is interfering
2. Verify AnalyticsService is initialized
3. Check queue: `viewAnalytics()`
4. Review console for errors

### Issue: CORS errors appear
**Solution:**
1. Identify the resource causing CORS error
2. Verify resource is hosted locally
3. Check index.html for external dependencies
4. Review network tab for failed requests

---

## Definition of Done Checklist

Before marking task as complete, verify:

- [ ] All automated tests pass
- [ ] Zero console errors across all pages
- [ ] Zero CORS warnings
- [ ] Error Boundaries work correctly
- [ ] Reports generate and download successfully
- [ ] Analytics work with and without ad blockers
- [ ] Logging system captures errors
- [ ] Performance targets are met
- [ ] Tests pass in multiple browsers
- [ ] All results documented in `validate-stability.md`

---

## Next Steps After Testing

1. **If all tests pass:**
   - Mark task as complete
   - Document results
   - Prepare for pilot deployment

2. **If tests fail:**
   - Document failures in detail
   - Create issues for each failure
   - Fix issues and re-test
   - Do not proceed until all tests pass

---

## Contact

For questions about testing procedures, contact the development team.

---

## Appendix: Helper Commands

### Console Helper Functions
```javascript
viewLogs()              // View all logged errors
viewAnalytics()         // View analytics queue
testErrorBoundary()     // Trigger test error
clearLogs()             // Clear all logs
exportResults()         // Export validation results
```

### NPM Scripts
```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run validate        # Run type-check + lint + build
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking
```

---

**Last Updated:** 2025-11-05  
**Version:** 1.0.0
