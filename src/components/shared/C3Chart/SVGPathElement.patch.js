// This patch is here to prepare test environment, where `SVGPathElement` does not exist
window.SVGPathElement = window.SVGPathElement || { prototype: {} };
