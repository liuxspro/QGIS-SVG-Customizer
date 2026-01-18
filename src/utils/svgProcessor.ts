const ATTRIBUTE_MAP: Record<string, string> = {
  fill: 'param(fill)',
  'fill-opacity': 'param(fill-opacity)',
  stroke: 'param(outline)',
  'stroke-opacity': 'param(outline-opacity)',
  'stroke-width': 'param(outline-width)',
}

function replaceAttributes(element: Element, preserveOriginal: boolean): void {
  Object.entries(ATTRIBUTE_MAP).forEach(([attr, paramValue]) => {
    if (element.hasAttribute(attr)) {
      const originalValue = element.getAttribute(attr)
      if (preserveOriginal && originalValue) {
        element.setAttribute(attr, `${paramValue} ${originalValue}`)
      } else {
        element.setAttribute(attr, paramValue)
      }
    }
  })

  Array.from(element.children).forEach(child => {
    if (child instanceof Element) {
      replaceAttributes(child, preserveOriginal)
    }
  })
}

export function processSvg(svgContent: string, preserveOriginal: boolean = false): string {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgContent, 'image/svg+xml')
    const svgElement = doc.querySelector('svg')

    if (!svgElement) {
      throw new Error('Invalid SVG: No svg element found')
    }

    replaceAttributes(svgElement, preserveOriginal)

    const serializer = new XMLSerializer()
    return serializer.serializeToString(doc)
  } catch (error) {
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
