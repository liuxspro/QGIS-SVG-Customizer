const SHAPE_ELEMENTS = new Set([
  'path',
  'rect',
  'circle',
  'ellipse',
  'polygon',
  'polyline',
  'line',
  'text',
])

const ATTRIBUTE_MAP: Record<string, string> = {
  fill: 'param(fill)',
  'fill-opacity': 'param(fill-opacity)',
  stroke: 'param(outline)',
  'stroke-opacity': 'param(outline-opacity)',
  'stroke-width': 'param(outline-width)',
}

function isShapeElement(element: Element): boolean {
  return SHAPE_ELEMENTS.has(element.tagName.toLowerCase())
}

function shouldPreserveOriginal(value: string | null): boolean {
  return value !== null && value !== 'none' && value !== ''
}

function replaceAttributes(element: Element, preserveOriginal: boolean): void {
  if (isShapeElement(element)) {
    Object.entries(ATTRIBUTE_MAP).forEach(([attr, paramValue]) => {
      const originalValue = element.getAttribute(attr)
      
      if (preserveOriginal && shouldPreserveOriginal(originalValue)) {
        element.setAttribute(attr, `${paramValue} ${originalValue}`)
      } else {
        element.setAttribute(attr, paramValue)
      }
    })
  }

  Array.from(element.children).forEach(child => {
    if (child instanceof Element) {
      replaceAttributes(child, preserveOriginal)
    }
  })
}


export function processSvg(svgContent: string, preserveOriginal: boolean = false): string {
  console.log('[svgProcessor] processSvg called, preserveOriginal:', preserveOriginal)
  
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgContent, 'image/svg+xml')
    const svgElement = doc.querySelector('svg')

    if (!svgElement) {
      throw new Error('Invalid SVG: No svg element found')
    }

    replaceAttributes(svgElement, preserveOriginal)

    const serializer = new XMLSerializer()
    const result = serializer.serializeToString(doc)
    return result
  } catch (error) {
    console.error('[svgProcessor] Error:', error)
    throw new Error(`Failed to process SVG: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function downloadSvg(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
