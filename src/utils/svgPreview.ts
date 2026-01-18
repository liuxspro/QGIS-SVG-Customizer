export interface SvgParams {
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeOpacity: number;
  strokeWidth: number;
}

export const defaultParams: SvgParams = {
  fill: "#667eea",
  fillOpacity: 1,
  stroke: "#764ba2",
  strokeOpacity: 1,
  strokeWidth: 0,
};

export function applyParamsToSvg(
  svgContent: string,
  params: SvgParams,
): string {
  console.log("[svgPreview] applyParamsToSvg called");

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (!svgElement) {
      return svgContent;
    }

    function applyParams(element: Element): void {
      const fillValue = element.getAttribute("fill");
      if (fillValue?.includes("param(fill)")) {
        element.setAttribute("fill", params.fill);
      }

      const fillOpacityValue = element.getAttribute("fill-opacity");
      if (fillOpacityValue?.includes("param(fill-opacity)")) {
        element.setAttribute("fill-opacity", params.fillOpacity.toString());
      }

      const strokeValue = element.getAttribute("stroke");
      if (strokeValue?.includes("param(outline)")) {
        element.setAttribute("stroke", params.stroke);
      }

      const strokeOpacityValue = element.getAttribute("stroke-opacity");
      if (strokeOpacityValue?.includes("param(outline-opacity)")) {
        element.setAttribute("stroke-opacity", params.strokeOpacity.toString());
      }

      const strokeWidthValue = element.getAttribute("stroke-width");
      if (strokeWidthValue?.includes("param(outline-width)")) {
        element.setAttribute("stroke-width", params.strokeWidth.toString());
      }

      Array.from(element.children).forEach((child) => {
        if (child instanceof Element) {
          applyParams(child);
        }
      });
    }

    applyParams(svgElement);

    const serializer = new XMLSerializer();
    const result = serializer.serializeToString(doc);
    console.log(
      "[svgPreview] applyParamsToSvg completed, result length:",
      result.length,
    );
    return result;
  } catch (error) {
    console.error("[svgPreview] Failed to apply params to SVG:", error);
    return svgContent;
  }
}
