# Accessibility Implementation Guide - SIGECO Porteiro Dashboard

## Overview

This document describes the accessibility features implemented in the Porteiro Dashboard to ensure WCAG 2.1 Level AA compliance and provide an inclusive experience for all users, including those using assistive technologies.

## Implemented Features

### 1. ARIA Attributes

#### Form Fields
All form inputs include comprehensive ARIA attributes:

- **aria-label**: Descriptive labels for all inputs
- **aria-describedby**: Links to hint text and error messages
- **aria-invalid**: Indicates validation state (true/false)
- **aria-required**: Marks required fields
- **inputMode**: Optimizes mobile keyboard (e.g., "numeric" for document field)
- **autoComplete**: Enables browser autofill where appropriate

Example:
```tsx
<Input
  id="nome"
  name="nome"
  aria-label="Nome completo do visitante"
  aria-describedby="nome-hint nome-error"
  aria-invalid={!!error}
  aria-required="true"
  autoComplete="name"
/>
```

#### Select Components
- **aria-label**: Describes the select purpose
- **aria-required**: Marks as required
- **aria-invalid**: Shows validation state
- **aria-describedby**: Links to error messages and hints
- **aria-controls**: Links to dropdown content

#### Buttons
- **aria-label**: Descriptive labels for icon-only buttons
- **aria-busy**: Indicates loading state during async operations
- **aria-expanded**: Shows dropdown/panel state (open/closed)
- **aria-haspopup**: Indicates popup/dialog presence

#### Lists and Results
- **role="list"** and **role="listitem"**: Semantic list structure
- **role="listbox"** and **role="option"**: For search results
- **aria-selected**: Indicates selected items
- **aria-live="polite"**: Announces dynamic content changes
- **aria-atomic**: Controls how screen readers announce updates

### 2. Keyboard Navigation

#### Tab Order
Logical tab order throughout the application:
1. Skip to main content link (appears on focus)
2. Header navigation (notifications, logout)
3. Form fields (nome → documento → destino → motivo → submit)
4. Search input
5. Visitor list items
6. Support button

#### Keyboard Shortcuts
- **Tab**: Navigate forward through interactive elements
- **Shift + Tab**: Navigate backward
- **Enter**: Activate buttons and submit forms
- **Space**: Activate buttons
- **Escape**: Close notification panel and modals
- **Arrow Keys**: Navigate within select dropdowns (native behavior)

#### Focus Management
- First invalid field receives focus on validation error
- Focus trapped appropriately in modals/dialogs
- Visible focus indicators on all interactive elements
- Skip to main content link for keyboard users

### 3. Screen Reader Support

#### Live Regions
Dynamic content updates are announced:
```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {results.length} {results.length === 1 ? 'visitante encontrado' : 'visitantes encontrados'}
</div>
```

#### Hidden Content
Decorative icons hidden from screen readers:
```tsx
<AlertCircle className="..." aria-hidden="true" />
```

#### Descriptive Labels
All interactive elements have descriptive labels:
- Form fields: "Nome completo do visitante"
- Buttons: "Registrar saída de [Nome]"
- Status badges: "Status: Ativo"
- Notifications: Full context including type, title, message, and time

#### Semantic HTML
- `<header>` for page header
- `<main>` for main content
- `<nav>` for navigation
- `<form>` with proper structure
- `<button>` for interactive elements (not divs)

### 4. Visual Indicators

#### Error States
- Red border on invalid fields
- Error icon (AlertCircle) next to field
- Error message below field with role="alert"
- Focus ring on invalid fields

#### Focus Indicators
- 2px ring with offset on focus
- High contrast focus states
- Visible on all interactive elements
- Custom styling for skip link

#### Loading States
- aria-busy attribute
- Loading spinner with animation
- Descriptive text ("Registrando...", "Processando...")
- Disabled state during operations

### 5. Color and Contrast

#### WCAG AA Compliance
All text meets minimum contrast ratios:
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

#### Color Independence
Information not conveyed by color alone:
- Status badges include text labels
- Error states include icons and text
- Success/warning states have multiple indicators

### 6. Form Validation

#### Inline Validation
- Real-time validation on blur
- Clear error messages
- Error messages linked via aria-describedby
- Visual and programmatic error indication

#### Error Prevention
- Input masks for document fields
- Character restrictions (letters only for names)
- Required field indicators (*)
- Helpful hint text for each field

#### Error Recovery
- Clear error messages explaining the problem
- Focus moved to first error
- Validation toast with summary
- Ability to correct and resubmit

## Testing Checklist

### Keyboard Navigation
- [ ] Can navigate entire form using only Tab key
- [ ] Can submit form using Enter key
- [ ] Can close notifications using Escape key
- [ ] Skip to main content link works
- [ ] Focus order is logical
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible

### Screen Reader Testing
- [ ] Form labels are announced correctly
- [ ] Error messages are announced
- [ ] Success messages are announced
- [ ] Dynamic content updates are announced
- [ ] Button purposes are clear
- [ ] List structures are recognized
- [ ] Status information is conveyed

### Visual Testing
- [ ] Focus indicators are visible on all elements
- [ ] Error states are clearly indicated
- [ ] Loading states are visible
- [ ] Color contrast meets WCAG AA
- [ ] Text is readable at 200% zoom
- [ ] No information conveyed by color alone

### Assistive Technology Testing
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] VoiceOver (macOS/iOS)
- [ ] TalkBack (Android)
- [ ] Keyboard-only navigation
- [ ] Voice control

## Screen Reader Testing Commands

### NVDA (Windows)
- **NVDA + Down Arrow**: Read next item
- **NVDA + Up Arrow**: Read previous item
- **Insert + F7**: List all form fields
- **Insert + F5**: Refresh elements list
- **Tab**: Navigate to next interactive element

### VoiceOver (macOS)
- **VO + Right Arrow**: Read next item
- **VO + Left Arrow**: Read previous item
- **VO + U**: Open rotor (lists, forms, etc.)
- **Tab**: Navigate to next interactive element

### JAWS (Windows)
- **Down Arrow**: Read next item
- **Up Arrow**: Read previous item
- **Insert + F5**: List form fields
- **Insert + F6**: List headings
- **Tab**: Navigate to next interactive element

## Best Practices Implemented

### 1. Semantic HTML
- Use native HTML elements when possible
- Proper heading hierarchy
- Semantic landmarks (header, main, nav)
- Form elements with labels

### 2. Progressive Enhancement
- Core functionality works without JavaScript
- Graceful degradation for older browsers
- No reliance on hover-only interactions

### 3. Responsive Design
- Touch targets minimum 44x44px
- Mobile-friendly form inputs
- Responsive text sizing
- Flexible layouts

### 4. Error Handling
- Clear, actionable error messages
- Multiple error indicators
- Error prevention where possible
- Easy error recovery

### 5. Content Structure
- Logical heading hierarchy
- Descriptive link text
- Clear button labels
- Meaningful alt text (when images present)

## Known Limitations

1. **Select Component**: Uses Radix UI which has built-in accessibility, but custom styling may affect some screen readers
2. **Toast Notifications**: Auto-dismiss may be too fast for some users (currently 5 seconds)
3. **Dynamic Content**: Some rapid updates may be overwhelming for screen reader users

## Future Improvements

1. **Customizable Timeouts**: Allow users to configure toast duration
2. **High Contrast Mode**: Dedicated high contrast theme
3. **Reduced Motion**: Respect prefers-reduced-motion
4. **Font Size Controls**: User-adjustable text size
5. **Keyboard Shortcuts Help**: Modal showing all keyboard shortcuts
6. **Focus Trap**: Implement proper focus trap in notification panel

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)

## Support

For accessibility issues or suggestions, please contact the development team or file an issue in the project repository.
