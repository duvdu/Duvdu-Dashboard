# Abstractions Plan for Admin Dashboard

This document outlines the key abstractions to build early in the project to speed up development and ensure code reusability.

---

## 1. Generic Table Component

- **Purpose:** Reuse for all data tables (users, projects, DCR, contracts, logs, etc.)
- **Should Provide:**
  - Configurable columns (label, field, custom render)
  - Data array input
  - Row actions (edit, delete, view, etc.)
  - Bulk actions
  - Pagination & sorting
  - Optional: selection (checkboxes), expandable rows

---

## 2. Filter/Search Panel Component

- **Purpose:** Standardize filtering/searching across modules
- **Should Provide:**
  - Configurable fields (text, select, date range, etc.)
  - Emits filter state to parent

---

## 3. Form Modal/Dialog Abstraction

- **Purpose:** Reuse for add/edit/approve/reject/message actions
- **Should Provide:**
  - Modal/Dialog wrapper
  - Form support with validation
  - Customizable content

---

## 4. Tab Layout Component

- **Purpose:** Consistent tabbed navigation (e.g., user profile sub-features)
- **Should Provide:**
  - Configurable tabs
  - Renders correct content per tab

---

## 5. Notification/Toast System

- **Purpose:** User feedback for actions (success, error, info)
- **Should Provide:**
  - Global notification context/provider or hook
  - Easy API for showing toasts/snackbars

---

## 6. API Service Layer

- **Purpose:** Centralize API calls, handle loading/errors, swap mock/real data
- **Should Provide:**
  - Typed endpoints
  - Error handling
  - Loading state management

---

## 7. Permission/Role Guard

- **Purpose:** Restrict actions/views by admin role or user type
- **Should Provide:**
  - Permission-checking utility or component wrapper

---

## 8. Reusable Toggle/Switch Component

- **Purpose:** For toggling views, enabling/disabling, etc.
- **Should Provide:**
  - Customizable toggle/switch UI

---

## 9. Date Range Picker

- **Purpose:** For filters and logs using date ranges
- **Should Provide:**
  - Reusable date range picker component

---

## 10. CSV Export Utility

- **Purpose:** Export tables/logs to CSV
- **Should Provide:**
  - Utility function or hook for exporting data arrays to CSV

---

## 11. Action Log/History Component

- **Purpose:** Display action logs (user actions, DCR updates, etc.)
- **Should Provide:**
  - List of actions with timestamps and details

---

**Tip:** Build these abstractions as simple, flexible components/utilities. Use mock data and props/configs to test them. Reuse and extend as you implement each feature.
