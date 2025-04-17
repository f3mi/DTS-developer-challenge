# Theme System Implementation Guide

This document provides guidelines for implementing the dark/light theme system across the entire application.

## Overview

Our application uses a theme system based on CSS variables defined in the root element. These variables are toggled between light and dark themes using the `useThemeStore` Pinia store.

## Getting Started

1. Import the theme store in your component:
   ```typescript
   import { useThemeStore } from '../stores/theme'
   const themeStore = useThemeStore()
   ```

2. Use the `isDark` reactive property to detect current theme:
   ```typescript
   const { isDark } = storeToRefs(themeStore)
   ```

3. Add a theme toggle button if needed:
   ```typescript
   const toggleTheme = () => {
     themeStore.toggleTheme()
   }
   ```

## Using Theme CSS Classes

We've created a set of utility classes in `assets/styles/theme.css` that can be applied to elements to automatically handle theme changes:

### Container Classes
- `theme-view-container` - For root view elements (applies bg color and full height)
- `theme-dashboard-layout` - For dashboard layout structure
- `theme-main-content` - For main content area in layouts

### Element Classes
- `theme-card` - For card-like containers
- `theme-input` - For form inputs
- `theme-button-primary` - For primary action buttons
- `theme-button-secondary` - For secondary action buttons
- `theme-loader` - For loading spinners
- `theme-status-pill` - For status pills (with variants: new, in-progress, review, completed)

### Typography Classes
- `theme-text-primary` - For primary text
- `theme-text-secondary` - For secondary/muted text
- `theme-text-disabled` - For disabled text

### Background Classes
- `theme-bg-primary` - Primary background color
- `theme-bg-secondary` - Secondary background color
- `theme-bg-tertiary` - Tertiary background color
- `theme-bg-card` - Card background color

## Using CSS Variables

Instead of hardcoding colors in your components, use CSS variables:

```css
/* Incorrect ❌ */
.my-element {
  background-color: #ffffff;
  color: #333333;
}

/* Correct ✅ */
.my-element {
  background-color: var(--bg-card);
  color: var(--text-primary);
}
```

### Available CSS Variables

#### Background Colors
- `--bg-primary` - Main background color
- `--bg-secondary` - Secondary background color
- `--bg-tertiary` - Tertiary background color
- `--bg-card` - Card background color

#### Text Colors
- `--text-primary` - Primary text color
- `--text-secondary` - Secondary text color
- `--text-disabled` - Disabled text color

#### Border & UI Colors
- `--border-color` - Border color
- `--divider-color` - Divider color
- `--shadow-color` - Shadow color
- `--hover-bg` - Hover background color
- `--focus-ring` - Focus ring color

#### Status Colors
- `--success-color` - Success color
- `--error-color` - Error color
- `--warning-color` - Warning color
- `--info-color` - Info color

#### Task Status Colors
- `--status-new` - New task color
- `--status-in-progress` - In progress task color
- `--status-review` - Review task color
- `--status-completed` - Completed task color

## Handling Dynamic Content Like Charts

For content that requires JavaScript to set colors (like charts), use the `getThemeColors` helper function:

```typescript
const getThemeColors = () => {
  const getColor = (varName: string) => 
    getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  
  return {
    statusColors: [
      getColor('--status-new'),
      getColor('--status-in-progress'),
      getColor('--status-review'),
      getColor('--status-completed')
    ],
    textColor: getColor('--text-primary'),
    backgroundColor: getColor('--bg-card'),
    primaryColor: getColor('--primary-color'),
    isDark: themeStore.isDark
  }
}
```

Then watch for theme changes and update your content:

```typescript
watch(() => themeStore.isDark, () => {
  // Re-render chart or component with new theme colors
  initChart()
})
```

## Step-by-Step Implementation For Each View

1. **Import the theme store and add reactive references**
2. **Add theme-aware CSS classes to your template**
3. **Update component styles to use CSS variables**
4. **Add a theme toggle if appropriate for the view**
5. **Add dynamic color handling for JavaScript components**

## Checklist For Each View

- [ ] Dashboard.vue
- [ ] TaskDetails.vue
- [ ] Tasks.vue
- [ ] Calendar.vue
- [x] Reports.vue
- [x] Login.vue
- [ ] Register.vue
- [ ] ErrorPage.vue

## Tips

- Use Chrome DevTools to preview both light and dark themes during development
- Test all components in both themes to ensure proper contrast
- Remember to handle images and SVGs that may need different versions for light/dark modes
- Consider users with high contrast preferences and ensure proper accessibility 