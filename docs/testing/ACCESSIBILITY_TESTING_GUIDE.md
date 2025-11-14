# Accessibility Testing Guide - Porteiro Dashboard

## Quick Testing Checklist

This guide provides step-by-step instructions for manually testing the accessibility features of the Porteiro Dashboard.

## 1. Keyboard Navigation Testing

### Test 1: Tab Navigation Through Form
**Steps:**
1. Open the Porteiro Dashboard
2. Press `Tab` key repeatedly
3. Verify the focus order:
   - Skip to main content link (appears on first Tab)
   - Notification bell button
   - Logout button
   - Nome input field
   - Documento input field
   - Destino select field
   - Motivo textarea
   - Confirmar Entrada button
   - Search input
   - Clear search button (if search has text)
   - Visitor list items
   - Support button

**Expected Result:** Focus moves in logical order with visible focus indicators

### Test 2: Form Submission with Enter
**Steps:**
1. Fill in all required fields
2. Press `Enter` key while focused on any field
3. Verify form submits

**Expected Result:** Form submits successfully

### Test 3: Escape Key to Close Notifications
**Steps:**
1. Click notification bell to open panel
2. Press `Escape` key
3. Verify panel closes

**Expected Result:** Notification panel closes

### Test 4: Skip to Main Content
**Steps:**
1. Refresh the page
2. Press `Tab` once
3. Verify "Pular para o conteúdo principal" link appears
4. Press `Enter`
5. Verify focus moves to main content area

**Expected Result:** Focus skips header and moves to main content

## 2. Screen Reader Testing

### Test with NVDA (Windows)

#### Test 1: Form Field Announcements
**Steps:**
1. Start NVDA (Insert + Ctrl + N)
2. Navigate to form with `Tab`
3. Listen to announcements for each field

**Expected Announcements:**
- "Nome do visitante, edit, required, Digite apenas letras e espaços. Mínimo 3 caracteres"
- "Documento de identificação do visitante, edit, required, Digite CPF com 11 dígitos..."
- "Destino da visita, combo box, required, Selecione o apartamento ou área comum..."
- "Motivo da visita, edit, Campo opcional..."

#### Test 2: Error Message Announcements
**Steps:**
1. Leave Nome field empty
2. Tab to next field
3. Listen for error announcement

**Expected Announcement:** "Nome é obrigatório, alert"

#### Test 3: Search Results Announcements
**Steps:**
1. Type in search field
2. Wait for results
3. Listen for announcement

**Expected Announcement:** "X visitantes encontrados" or "Nenhum visitante encontrado"

### Test with VoiceOver (macOS)

#### Test 1: Navigate Form
**Steps:**
1. Start VoiceOver (Cmd + F5)
2. Use VO + Right Arrow to navigate
3. Verify all form fields are announced with labels and hints

#### Test 2: List Navigation
**Steps:**
1. Navigate to visitor list
2. Use VO + Right Arrow
3. Verify list structure is announced

**Expected Announcement:** "List, X items" followed by each visitor's details

## 3. Visual Testing

### Test 1: Focus Indicators
**Steps:**
1. Use Tab key to navigate through all interactive elements
2. Verify each element shows a visible focus ring
3. Check focus ring has sufficient contrast

**Expected Result:** 
- Blue ring (2px) with offset visible on all elements
- Ring color contrasts with background
- Ring is not obscured by other elements

### Test 2: Error States
**Steps:**
1. Submit form with empty fields
2. Verify error indicators:
   - Red border on invalid fields
   - Red error icon next to field
   - Red error text below field
   - Error text is readable

**Expected Result:** Multiple visual indicators for errors

### Test 3: Color Contrast
**Steps:**
1. Use browser DevTools or contrast checker
2. Check text contrast ratios:
   - Normal text: minimum 4.5:1
   - Large text: minimum 3:1
   - UI components: minimum 3:1

**Expected Result:** All text meets WCAG AA standards

### Test 4: Zoom to 200%
**Steps:**
1. Press Ctrl/Cmd + Plus (+) to zoom to 200%
2. Verify all content is still readable
3. Check no horizontal scrolling required
4. Verify no content is cut off

**Expected Result:** Layout adapts to zoom level

## 4. Form Validation Testing

### Test 1: Required Field Validation
**Steps:**
1. Leave Nome field empty
2. Tab to next field
3. Verify error appears
4. Fill in Nome
5. Verify error disappears

**Expected Result:** 
- Error appears on blur
- Error clears when valid input provided
- Error is announced to screen readers

### Test 2: Document Format Validation
**Steps:**
1. Type "123" in Documento field
2. Tab to next field
3. Verify error: "CPF inválido" or "RG inválido"
4. Type valid CPF: "12345678909"
5. Verify formatting applied: "123.456.789-09"

**Expected Result:** 
- Invalid format shows error
- Valid format applies mask
- Validation announced to screen readers

### Test 3: Name Character Validation
**Steps:**
1. Type "João123" in Nome field
2. Verify numbers are not entered
3. Type "João Silva"
4. Verify capitalization applied

**Expected Result:** 
- Only letters and spaces accepted
- First letter of each word capitalized

## 5. Dynamic Content Testing

### Test 1: Toast Notifications
**Steps:**
1. Submit form successfully
2. Verify toast appears
3. Wait 5 seconds
4. Verify toast disappears

**Expected Result:** 
- Toast announced to screen readers
- Toast visible for 5 seconds
- Toast has close button

### Test 2: Visitor List Updates
**Steps:**
1. Register new visitor
2. Verify list updates immediately
3. Click "Saída" button
4. Verify status changes to "Saiu"
5. Verify list reorders (active visitors on top)

**Expected Result:** 
- Updates announced to screen readers
- Visual updates are immediate
- No page refresh required

### Test 3: Search Results
**Steps:**
1. Type in search field
2. Verify results appear in real-time
3. Verify result count announced
4. Clear search
5. Verify results cleared

**Expected Result:** 
- Results update as you type
- Count announced to screen readers
- Clear button accessible

## 6. Mobile/Touch Testing

### Test 1: Touch Targets
**Steps:**
1. Open on mobile device or use DevTools mobile view
2. Verify all buttons are at least 44x44px
3. Try tapping all interactive elements
4. Verify no accidental taps

**Expected Result:** All touch targets are large enough

### Test 2: Mobile Keyboard
**Steps:**
1. Focus on Documento field
2. Verify numeric keyboard appears
3. Focus on Nome field
4. Verify text keyboard appears

**Expected Result:** Appropriate keyboard for each field

## 7. Assistive Technology Compatibility

### Test with Different Screen Readers
- [ ] NVDA (Windows) - Free
- [ ] JAWS (Windows) - Trial available
- [ ] VoiceOver (macOS/iOS) - Built-in
- [ ] TalkBack (Android) - Built-in
- [ ] ChromeVox (Chrome extension) - Free

### Test with Different Browsers
- [ ] Chrome + NVDA
- [ ] Firefox + NVDA
- [ ] Safari + VoiceOver
- [ ] Edge + NVDA

## Common Issues to Watch For

### ❌ Issues to Report
- Focus indicator not visible
- Tab order is illogical
- Error messages not announced
- Buttons without labels
- Images without alt text
- Color-only information
- Keyboard traps
- Missing ARIA attributes

### ✅ Good Practices Observed
- All form fields have labels
- Error messages are descriptive
- Focus indicators are visible
- Keyboard navigation works
- Screen reader announcements are clear
- Dynamic content is announced
- Skip to main content link present

## Automated Testing Tools

### Browser Extensions
1. **axe DevTools** (Chrome/Firefox)
   - Install from browser store
   - Open DevTools → axe tab
   - Click "Scan ALL of my page"
   - Review issues

2. **WAVE** (Chrome/Firefox)
   - Install from browser store
   - Click WAVE icon
   - Review errors and alerts

3. **Lighthouse** (Chrome DevTools)
   - Open DevTools → Lighthouse tab
   - Select "Accessibility"
   - Click "Generate report"
   - Review score and issues

### Command Line Tools
```bash
# Install pa11y
npm install -g pa11y

# Run accessibility test
pa11y http://localhost:5173

# Run with specific standard
pa11y --standard WCAG2AA http://localhost:5173
```

## Reporting Issues

When reporting accessibility issues, include:
1. **Issue Description**: What's wrong?
2. **Steps to Reproduce**: How to see the issue?
3. **Expected Behavior**: What should happen?
4. **Actual Behavior**: What actually happens?
5. **Assistive Technology**: Screen reader, browser, OS
6. **WCAG Criterion**: Which guideline is violated?
7. **Severity**: Critical, High, Medium, Low
8. **Screenshots/Videos**: Visual evidence

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [Accessibility Testing Tools](https://www.w3.org/WAI/test-evaluate/tools/list/)

## Next Steps

After completing manual testing:
1. Document all issues found
2. Prioritize issues by severity
3. Create tickets for fixes
4. Retest after fixes
5. Consider automated testing in CI/CD
