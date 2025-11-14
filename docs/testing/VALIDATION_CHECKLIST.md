# SIGECO MVP - Quick Validation Checklist

Use this checklist for rapid validation before deployment or after making changes.

---

## Pre-Flight Checks

- [ ] Dependencies installed: `npm install`
- [ ] Build passes: `npm run validate`
- [ ] Dev server running: `npm run dev`
- [ ] Browser DevTools open (F12)

---

## 1. Console Errors (5 min)

**Navigate to each page and check console:**

- [ ] Home (`/`) - 0 errors
- [ ] Login (`/login`) - 0 errors
- [ ] Porteiro Dashboard (`/porteiro-dashboard`) - 0 errors
- [ ] Admin Dashboard (`/admin-dashboard`) - 0 errors
- [ ] Invalid route (`/test-404`) - 0 errors, 404 page shows

**Result:** ✅ PASS / ❌ FAIL

---

## 2. Error Boundary (3 min)

- [ ] Navigate to `/porteiro-dashboard`
- [ ] Console: `throw new Error("Test")`
- [ ] Error Boundary displays friendly message
- [ ] "Tentar Novamente" button works
- [ ] Console: `viewLogs()` shows the error

**Result:** ✅ PASS / ❌ FAIL

---

## 3. Report Generation (5 min)

### PDF Report
- [ ] Navigate to Admin Dashboard → Relatórios
- [ ] Apply filters
- [ ] Click "Gerar PDF"
- [ ] Loading spinner appears
- [ ] PDF downloads in < 5 seconds
- [ ] PDF opens and contains correct data
- [ ] No console errors

### Excel Report
- [ ] Apply different filters
- [ ] Click "Gerar Excel"
- [ ] Loading spinner appears
- [ ] Excel downloads in < 5 seconds
- [ ] Excel opens with multiple sheets
- [ ] Data matches filters
- [ ] No console errors

**Result:** ✅ PASS / ❌ FAIL

---

## 4. Analytics (3 min)

### Without Ad Blocker
- [ ] Disable ad blocker
- [ ] Refresh app
- [ ] Perform actions (login, navigate, generate report)
- [ ] Console: `viewAnalytics()` shows events
- [ ] No console errors

### With Ad Blocker
- [ ] Enable ad blocker
- [ ] Refresh app
- [ ] Perform same actions
- [ ] No console errors
- [ ] Console: `viewAnalytics()` shows queued events

**Result:** ✅ PASS / ❌ FAIL

---

## 5. CORS Validation (2 min)

- [ ] Clear console
- [ ] Refresh application
- [ ] Check console: 0 CORS errors
- [ ] Check console: 0 "blocked by CORS policy" messages
- [ ] Network tab: All fonts load from local sources
- [ ] Network tab: All resources load successfully

**Result:** ✅ PASS / ❌ FAIL

---

## 6. Logging System (2 min)

- [ ] Console: `viewLogs()`
- [ ] Logs display in table format
- [ ] Entries have: timestamp, level, message, context
- [ ] Log count ≤ 100 entries
- [ ] Console: `exportResults()` downloads JSON file

**Result:** ✅ PASS / ❌ FAIL

---

## 7. Performance (3 min)

- [ ] Clear cache
- [ ] Refresh app
- [ ] Initial load < 2 seconds
- [ ] PDF generation < 5 seconds
- [ ] Excel generation < 5 seconds
- [ ] Page navigation < 500ms

**Result:** ✅ PASS / ❌ FAIL

---

## 8. Automated Validation (2 min)

- [ ] Open browser console
- [ ] Copy/paste `scripts/validate-console.js`
- [ ] All automated tests pass
- [ ] Review summary results

**Result:** ✅ PASS / ❌ FAIL

---

## Final Checklist

- [ ] All 8 sections above: PASS
- [ ] Zero critical console errors
- [ ] Zero CORS warnings
- [ ] All features working as expected
- [ ] Results documented

---

## Overall Result

**Date:** _______________  
**Tester:** _______________  
**Browser:** _______________  
**Status:** ✅ READY FOR DEPLOYMENT / ❌ NEEDS FIXES

---

## Quick Commands

```bash
# Build validation
npm run validate

# Start dev server
npm run dev
```

```javascript
// Console helpers
viewLogs()              // View logs
viewAnalytics()         // View analytics
testErrorBoundary()     // Test error handling
exportResults()         // Export results
```

---

**Total Time:** ~25 minutes

**For detailed testing:** See `scripts/validate-stability.md`  
**For step-by-step guide:** See `scripts/TEST_EXECUTION_GUIDE.md`
