# QGIS SVG Customizer - Agent Guidelines

This document provides guidelines for agentic coding assistants working on this repository.

## Development Commands

### Package Manager
- **pnpm** is used as the package manager (not npm)
- All commands should use `pnpm run` instead of `npm run`

### Essential Commands
- **Start dev server**: `pnpm run dev`
- **Build for production**: `pnpm run build`
- **Lint code**: `pnpm run lint`
- **Preview production build**: `pnpm run preview`

### Installing Dependencies
- Install all dependencies: `pnpm install`
- Install a specific package: `pnpm add <package-name>`
- Install dev dependency: `pnpm add -D <package-name>`

### Testing
No test suite is currently configured. When adding tests:
- Use a framework compatible with Vite + React (e.g., Vitest)
- Follow TypeScript strict typing patterns
- Add test scripts to package.json

## Code Style Guidelines

### TypeScript & Imports
- **Strict mode enabled**: All type errors must be resolved
- **Type-only imports**: Use `import type { ... }` or `import { type ... }` for type imports only
- **Import order**: React hooks → local utils → styles → type imports
  ```typescript
  import { useState, useRef, useCallback } from 'react'
  import { processSvg } from './utils/svgProcessor'
  import { type SvgParams } from './types'
  import './App.css'
  ```

### Naming Conventions
- **Components**: PascalCase (`App.tsx`, `SvgPreview.tsx`)
- **Functions/Variables**: camelCase (`processSvg`, `handleDownload`)
- **Constants**: UPPER_SNAKE_CASE for static maps (`ATTRIBUTE_MAP`)
- **CSS Classes**: kebab-case with BEM-like structure (`.control-panel`, `.control-label`)
- **Files**: Match exported component/function name

### React Patterns
- Use **functional components** with hooks exclusively
- Prefer `useCallback` for event handlers to prevent unnecessary re-renders
- Use `useMemo` for expensive computations or derived state
- Always include dependency arrays in hooks
- Use `useRef` for DOM element references
- Clean up refs (reset values) when clearing state

### Error Handling
- Wrap async/parsing operations in try-catch blocks
- Use `error instanceof Error` to safely access error messages
- Provide descriptive error messages: `Failed to process SVG: ${error.message}`
- Return fallback values (original input) in utility functions on error
- Set error state for user-facing errors

### State Management
- Keep component state minimal and related
- Group related state in objects (e.g., `SvgParams`)
- Reset all related state together when clearing data
- Use explicit types for useState: `useState<string | null>(null)`

### Code Formatting
- **No comments**: Keep code self-documenting
- Use template literals for string interpolation
- Prefer `const` over `let`, use `let` only when reassignment needed
- Use optional chaining (`?.`) and nullish coalescing (`??`) appropriately
- Use strict equality (`===`/`!==`) always

### SVG Processing
- Use browser APIs: `DOMParser` and `XMLSerializer`
- Handle missing SVG elements gracefully
- Recursively traverse element children
- Use `Array.from()` when iterating over HTMLCollections
- Always validate input SVG content
- **Shape elements only**: Only add QGIS parameters to shape elements (`path`, `rect`, `circle`, `ellipse`, `polygon`, `polyline`, `line`, `text`)
- **Add all parameters**: Always add all 5 QGIS parameters to shape elements, not just replace existing ones
- **Preserve logic**: When preserve option is enabled, append original values if they exist and are not "none"

### CSS Guidelines
- Separate CSS files per component
- Use CSS variables for theme colors
- Support both dark and light modes using `@media (prefers-color-scheme: light)`
- Responsive breakpoints: 1024px (tablet), 768px (mobile)
- Use flexbox and grid for layouts
- Maintain consistent spacing, border-radius, and transitions

### File Organization
```
src/
├── App.tsx              # Main application component
├── main.tsx            # Entry point
├── utils/              # Utility functions
│   ├── svgProcessor.ts # SVG processing logic
│   └── svgPreview.ts  # Preview generation logic
├── types/              # TypeScript type definitions (if needed)
└── assets/            # Static assets
```

## Project Specifics

### SVG Customization Logic
- **QGIS parameters**: `param(fill)`, `param(fill-opacity)`, `param(outline)`, `param(outline-opacity)`, `param(outline-width)`
- **Preserve option**: When enabled, append original values: `fill="param(fill) #ff0000"`
- **Preview separation**: Live preview applies actual colors, downloaded file contains QGIS parameters

### Build Notes
- Uses Vite with rolldown bundler
- React 19 with JSX transform
- TypeScript targets ES2022/ESNext
- No external runtime dependencies

### Linting Rules
- ESLint with TypeScript support
- React hooks and refresh plugins
- `verbatimModuleSyntax` enforced - type imports must be explicit
- No unused locals/parameters allowed
- Strict null checking enabled
