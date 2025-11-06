# EcoComply Design Guidelines

## Design Approach

**Selected Framework:** Material Design 3 with Environmental Theming
**Rationale:** Government compliance systems require clear information hierarchy, data-dense displays, and consistent interaction patterns. Material Design provides robust components for dashboards, forms, and data visualization while allowing environmental color customization.

**Core Principles:**
- Clarity over decoration: Information must be immediately scannable
- Trust through consistency: Government users expect reliable, predictable interfaces
- Accessibility first: WCAG 2.1 AA compliance for all user roles
- Mobile-responsive: Field inspectors need full functionality on mobile devices

---

## Color Palette

### Light Mode
- **Primary Green:** 142 71% 45% (environmental brand color - buttons, headers, active states)
- **Primary Container:** 142 50% 92% (light green backgrounds for cards, success states)
- **Secondary Teal:** 174 65% 41% (accent for data visualizations, secondary actions)
- **Surface:** 0 0% 98% (main background)
- **Surface Container:** 0 0% 96% (card backgrounds, elevated surfaces)
- **Error Red:** 0 72% 51% (alerts, violations, overdue items)
- **Warning Amber:** 38 92% 50% (pending reviews, caution states)
- **Success Green:** 142 76% 36% (resolved complaints, compliance achieved)

### Dark Mode
- **Primary Green:** 142 60% 65% (softer green for dark backgrounds)
- **Primary Container:** 142 35% 25% (dark green containers)
- **Secondary Teal:** 174 45% 55%
- **Surface:** 0 0% 12% (main dark background)
- **Surface Container:** 0 0% 17% (dark cards)
- **Error Red:** 0 65% 60%
- **Warning Amber:** 38 80% 60%

### Semantic Colors
- **Air Pollution:** 204 70% 53% (sky blue)
- **Water Pollution:** 211 100% 50% (deep blue)
- **Waste:** 33 100% 45% (orange-brown)
- **Noise:** 280 67% 55% (purple)
- **Industrial:** 0 0% 40% (gray)

---

## Typography

**Font Family:** 'Inter' (primary), 'Roboto' (fallback)

**Scale:**
- **Display Large:** 57px / 64px, font-weight: 600 (dashboard headers)
- **Headline Large:** 32px / 40px, font-weight: 600 (page titles)
- **Headline Medium:** 28px / 36px, font-weight: 500 (section headers)
- **Title Large:** 22px / 28px, font-weight: 500 (card titles, modal headers)
- **Body Large:** 16px / 24px, font-weight: 400 (primary content)
- **Body Medium:** 14px / 20px, font-weight: 400 (secondary content, descriptions)
- **Label Large:** 14px / 20px, font-weight: 500 (buttons, form labels)
- **Label Medium:** 12px / 16px, font-weight: 500 (chips, badges, metadata)

---

## Layout System

**Spacing Units:** Tailwind scale - commonly use 3, 4, 6, 8, 12, 16 units
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12
- Card gaps: gap-4 to gap-6
- Dashboard margins: mx-4 md:mx-8

**Grid System:**
- Desktop: 12-column grid with max-w-7xl container
- Tablet: 8-column grid
- Mobile: 4-column stack
- Dashboard widgets: Use CSS Grid with auto-fit for responsive card layouts

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Wide: > 1440px

---

## Component Library

### Navigation
- **Top App Bar:** Fixed header with app logo, role indicator, notification bell, user menu
- **Side Navigation Drawer:** Persistent on desktop (240px width), slide-over on mobile
  - Dashboard, My Complaints/Reports, Submit New, Analytics, Settings
  - Role-specific menu items (Inspector Assignment for admins)
- **Breadcrumbs:** Show navigation hierarchy for deep pages

### Core Components

**Cards:**
- Complaint Cards: Elevated shadow, rounded-lg (8px), p-5 spacing
  - Category icon (top-left), status badge (top-right)
  - Complaint ID, timestamp, location chip
  - Description preview (2-line truncate)
  - Action buttons (View Details, Update Status)

**Status Badges:**
- Submitted: bg-blue-100 text-blue-800 (light mode) with blue-500 border
- Under Review: bg-amber-100 text-amber-800
- Resolved: bg-green-100 text-green-800
- Rejected: bg-red-100 text-red-800
- Pill-shaped (rounded-full), px-3 py-1, text-xs font-medium

**Forms:**
- Input fields: border-2 border-gray-300, focus:border-primary-green, rounded-md, p-3
- File upload: Dashed border dropzone with upload icon, accepted file types shown
- GPS location: Embedded mini-map preview with pin marker
- Category selector: Grid of icon buttons (6 categories), selected state with green fill

**Data Display:**
- Tables: Striped rows (alternate surface colors), sticky header, sortable columns
- Charts: Use Chart.js with green-teal color scheme, rounded bars, clear legends
- Maps: Leaflet/Google Maps with custom green markers for complaint locations
- Heatmap: Green gradient intensity (light to dark green) for pollution density

**Dashboard Widgets:**
- KPI Cards: Large number (text-4xl), label below, trend indicator (↑/↓), icon top-right
- Progress Bars: h-2 rounded-full, green fill with percentage label
- Activity Feed: Timeline with dot indicators, timestamps, action descriptions
- Quick Actions: Grid of 2x2 icon buttons with labels (Submit, View, Analyze, Report)

### Overlays
- **Modals:** max-w-2xl, centered, rounded-xl, p-6, blur backdrop
- **Notifications/Toasts:** Fixed top-right, slide-in animation, auto-dismiss (5s)
- **Confirmation Dialogs:** Compact, centered, primary/secondary button pair

### Category Icons
Use Material Icons via CDN:
- Air: `air` icon
- Water: `water_drop` icon
- Waste: `delete` icon
- Noise: `volume_up` icon
- Industrial: `factory` icon
- Other: `report_problem` icon

---

## Interaction Patterns

**Complaint Submission Flow:**
1. Category selection (large icon grid)
2. Details form (location auto-detected, manual override option)
3. Evidence upload (drag-drop with preview thumbnails)
4. Review summary before submit
5. Confirmation with tracking ID

**Status Updates:**
- Admin click → dropdown menu (Update Status, Assign Inspector, Add Notes)
- Modal opens with current status, new status selector, notes textarea
- Save triggers notification to complaint owner

**Dashboard Navigation:**
- Tab system for different views (All Complaints, My Cases, Resolved)
- Filter sidebar: Date range, category, status, location
- Search bar with autocomplete for complaint IDs

---

## Animations

**Minimal & Purposeful:**
- Page transitions: 200ms ease-in-out fade
- Card hover: Subtle lift (shadow-md to shadow-lg), 150ms
- Button press: Scale 0.98 for tactile feedback
- Status change: Badge color cross-fade, 300ms
- Loading states: Skeleton screens (pulse animation) for data fetch

**NO:**
- Excessive scroll animations
- Decorative parallax
- Distracting micro-interactions

---

## Images

**Hero Section:** No traditional hero - this is a utility app, not marketing
**Dashboard:** Replace hero with "Quick Actions" widget grid at top
**Evidence Display:** Complaint detail pages show uploaded photos in responsive gallery (grid-cols-2 md:grid-cols-3, rounded corners, lightbox on click)
**Empty States:** Illustrative icons (not photos) for "No complaints found" with clear CTA
**User Avatars:** Default Material Design person icon, circular, 40x40px for profile displays

---

## Accessibility

- All form inputs have visible labels and aria-labels
- Color contrast minimum 4.5:1 for text, 3:1 for UI components
- Keyboard navigation: Tab order follows visual hierarchy, focus rings (ring-2 ring-primary-green)
- Screen reader announcements for status updates
- Error messages linked to form fields with aria-describedby
- Map markers have text alternatives

---

## Mobile Considerations

- Bottom navigation bar replaces side drawer (5 core actions)
- Floating Action Button (FAB) for "Submit Complaint" on mobile
- Swipe gestures: Swipe complaint cards to reveal quick actions (Update, Delete)
- Touch targets minimum 48x48px
- Simplified data tables → card-based list view on mobile
- Charts: Horizontal scroll for wide datasets, simplified views