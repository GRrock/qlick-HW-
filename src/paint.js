import draw from "./modules";
import controller from './controller'
export default function paint($element, layout) {
    const element = $element[0];
    const svg = element.querySelector("svg");
    const tooltip = element.querySelector(".tooltip");
    const qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
    const xValues = [];
    const yValues = [];
    
    qMatrix.forEach(element => {
        xValues.push(element[0].qText);
        yValues.push(element[1].qNum)
    });

    const yTicks = 5;
    const xTicks = xValues.length;

    const cache = controller(svg, yValues, yTicks, xTicks);

    const rect = svg.getBoundingClientRect();
    const heightOfSVG = rect.height - cache.margin.top - cache.margin.bottom;
    const widthOfSVG = rect.width - cache.margin.left - cache.margin.right;

    draw(svg, yValues, xValues, yTicks, xTicks, cache, tooltip, heightOfSVG, widthOfSVG);
}