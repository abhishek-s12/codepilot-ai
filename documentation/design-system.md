# CodePilot AI Design System

Version: 1.0

---

## 🎨 Design Philosophy

CodePilot AI is not just a dashboard; it is a **developer operating system**. Every user interface decision must prioritize:
* **Focus**: Remove unnecessary elements and keep the editor at the center of attention.
* **Speed**: Fast performance is more important than fancy visuals.
* **Clarity**: High contrast, visible focus, and readable typography.
* **Consistency**: Rigid grid patterns, standard border radii, and a structured color palette.
* **Low Cognitive Load**: Apply progressive disclosure so advanced tools only appear when explicitly requested.

---

## 📐 Layout & Panel Configurations

The primary interface uses a three-column resizable layout:

| Panel | Standard Width | Min Width | Max Width | resizable | Behavior |
|---|---|---|---|---|---|
| **Explorer** | 260px | 220px | 360px | Yes | Left sidebar for directory browsing and navigation. |
| **Editor** | Dominant (65%-80%) | — | — | — | Monaco editor main code workspace. |
| **AI Sidebar** | 380px | 320px | 520px | Yes | Right sidebar for AI Chat assistant, call graph tools, and actions. |
| **Bottom Workspace** | Collapsed | Height: 300px | 70% height | Yes | Collapsible bottom dock for terminals, task logs, and outputs. |

---

## 🎨 Palette & Color System

To create a premium developer aesthetic, the app uses a dark, curated color system:

### Base Colors
* **Background**: `#090B11` (Deep space grey-black)
* **Surface**: `#10131B` (Sleek slate grey)
* **Panel**: `#151A24` (Slightly lighter grey for active panels)
* **Border**: `#2B3345` (Subtle boundary borders)
* **Divider**: `#202838` (Thin lines)

### Actions & States
* **Primary (Accent)**: `#7C5CFF` (Purple) / **Hover**: `#9378FF`
* **Success**: `#3DDC84` (Android Green)
* **Warning**: `#F6C445` (Gold Yellow)
* **Danger**: `#FF5C7A` (Crimson Red)
* **Info**: `#3DA5FF` (Ocean Blue)

### Text Hierarchy
* **Primary**: `#F3F4F6` (White-grey)
* **Secondary**: `#B8C1D1` (Soft slate)
* **Muted**: `#6B7280` (Cool grey)

---

## 📏 Grid, Radius & Spacing Scale

### Spacing Scale
Spacing must strictly conform to an **8px grid system**:
`4px` | `8px` | `12px` | `16px` | `24px` | `32px` | `48px` | `64px`

### Border Radii
* **Small**: `8px` (Tags, status badges)
* **Medium**: `12px` (Buttons, inputs)
* **Large / Cards**: `16px` (Default cards, dialog screens)

---

## ⌨️ Keyboard-First Shortcuts

Every primary action must be executable using keyboard combinations to ensure maximum speed and accessibility for developers:

* **Open Palette / Search**: `Ctrl + P` / `Ctrl + K`
* **Toggle AI Sidebar**: `Ctrl + Shift + A`
* **Close Panel / Modal**: `Esc`
* **Navigate Symbols**: `Arrow Keys` + `Enter`

---

## 📂 Folder Structure

```text
frontend/src/
├── assets/          — Static assets (images, logos)
├── components/      — Reusable components (Buttons, Cards, Inputs)
├── contexts/        — React context states (AuthContext, ThemeContext)
├── hooks/           — Custom reusable React hooks
├── layouts/         — Base screen layouts
├── services/        — API and WebSocket wrappers
├── styles/          — Tailwind configuration and global CSS overrides
├── tabs/            — Tab components for bottom workspace
└── utils/           — Helper functions
```
