export interface SvgParams {
  fill: string
  fillOpacity: number
  stroke: string
  strokeOpacity: number
  strokeWidth: number
}

export const defaultParams: SvgParams = {
  fill: '#667eea',
  fillOpacity: 0.8,
  stroke: '#764ba2',
  strokeOpacity: 1,
  strokeWidth: 2,
}

export function applyParamsToSvg(svgContent: string, params: SvgParams): string {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgContent, 'image/svg+xml')
    const svgElement = doc.querySelector('svg')

    if (!svgElement) {
      return svgContent
    }

    function applyParams(element: Element): void {
      if (element.hasAttribute('fill') || element.hasAttribute('param(fill)')) {
        if (element.getAttribute('fill')?.includes('param(fill)')) {
          element.setAttribute('fill', params.fill)
        }
      }

      if (element.hasAttribute('fill-opacity') || element.hasAttribute('param(fill-opacity)')) {
        if (element.getAttribute('fill-opacity')?.includes('param(fill-opacity)')) {
          element.setAttribute('fill-opacity', params.fillOpacity.toString())
        }
      }

      if (element.hasAttribute('stroke') || element.hasAttribute('param(outline)')) {
        if (element.getAttribute('stroke')?.includes('param(outline)')) {
          element.setAttribute('stroke', params.stroke)
        }
      }

      if (element.hasAttribute('stroke-opacity') || element.hasAttribute('param(outline-opacity)')) {
        if (element.getAttribute('stroke-opacity')?.includes('param(outline-opacity)')) {
          element.setAttribute('stroke-opacity', params.strokeOpacity.toString())
        }
      }

      if (element.hasAttribute('stroke-width') || element.hasAttribute('param(outline-width)')) {
        if (element.getAttribute('stroke-width')?.includes('param(outline-width)')) {
          element.setAttribute('stroke-width', params.strokeWidth.toString())
        }
      }

      Array.from(element.children).forEach(child => {
        if (child instanceof Element) {
          applyParams(child)
        }
      })
    }

    applyParams(svgElement)

    const serializer = new XMLSerializer()
    return serializer.serializeToString(doc)
  } catch (error) {
    console.error('Failed to apply params to SVG:', error)
    return svgContent
  }
}
