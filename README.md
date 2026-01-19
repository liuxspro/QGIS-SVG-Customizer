# QGIS SVG Customizer

A web-based tool to convert SVG files into QGIS-compatible format with customizable color parameters.

## Features

- **SVG Upload**: Drag & drop or click to upload SVG files
- **QGIS Parameter Conversion**: Automatically converts SVG attributes to QGIS dynamic parameters:
  - `param(fill)` - Fill color
  - `param(fill-opacity)` - Fill opacity
  - `param(outline)` - Stroke color
  - `param(outline-opacity)` - Stroke opacity
  - `param(outline-width)` - Stroke width
- **Live Preview**: Real-time preview with customizable parameters:
  - Fill color picker
  - Fill opacity slider (0-1)
  - Stroke color picker
  - Stroke opacity slider (0-1)
  - Stroke width slider (0-10px)
- **Preserve Original Attributes**: Option to preserve original SVG values alongside QGIS parameters
- **Side-by-Side View**: Compare original SVG with QGIS-compatible preview
- **Download**: Export converted SVG with QGIS parameters

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite (rolldown)** - Build tool and dev server
- **pnpm** - Package manager

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd qgis-svg-custom

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
# Build for production
pnpm run build
```

### Preview Production Build

```bash
# Preview production build locally
pnpm run preview
```

### Linting

```bash
# Run ESLint
pnpm run lint
```

## Usage

1. **Upload SVG**: Click the upload zone or drag & drop an SVG file
2. **Adjust Parameters**: Use the control panel to customize:
   - Fill color and opacity
   - Stroke color, opacity, and width
3. **Toggle Preserve Option**: Enable "Preserve Original Attributes" to keep original values
4. **Preview Changes**: See real-time preview on the right side
5. **Download**: Click "Download QGIS SVG" to export the converted file

## How It Works

The tool processes SVG files by:

1. Parsing the SVG using DOMParser
2. Replacing static attributes with QGIS dynamic parameters on shape elements (path, rect, circle, ellipse, polygon, polyline, line, text)
3. Preserving original values if the option is enabled
4. Applying temporary values for preview visualization
5. Generating downloadable SVG with QGIS parameters

## File Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx            # Entry point
├── App.css             # Component styles
└── utils/
    ├── svgProcessor.ts # SVG processing and conversion logic
    └── svgPreview.ts   # Preview parameter application logic
```

## License

MIT
