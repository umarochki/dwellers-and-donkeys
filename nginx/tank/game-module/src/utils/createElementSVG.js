export default function createElementSVG(options) {

  var {boxWidth, boxHeight, texture} = options;

  const xmlns = "http://www.w3.org/2000/svg";
  var svgElem = document.createElementNS(xmlns, "svg");
  
  svgElem.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
  svgElem.setAttributeNS(null, "width", boxWidth);
  svgElem.setAttributeNS(null, "height", boxHeight);
  svgElem.innerHTML = texture;

  return svgElem;
}
