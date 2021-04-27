import Factory from "./Factory";
const cache = {
    isInitialized: false,
    xAxis: null,
    yAxis: null,
    chartLine: null,
    marker: null,
    margin: null,
    xLabels: [],
    yLabels: []
}
const pathsFactory = new Factory();
const markersFactory = new Factory();
const xLabelsFactory = new Factory();
const yLabelsFactory = new Factory();

export default function controller(svg, yPoints, yTicks, xTicks) {
    
    if (cache.isInitialized && cache.yLabels.length !== yPoints.length) {
        pathsFactory.clear();
        markersFactory.clear();
        xLabelsFactory.clear();
        yLabelsFactory.clear();
        cache.isInitialized = false;
        cache.xLabels = [];
        cache.yLabels = [];
    }
    if (!cache.isInitialized) {
        cache.xAxis = pathsFactory.add("path");
        cache.yAxis = pathsFactory.add("path");
        cache.chartLine = pathsFactory.add("path");

        while (yTicks > 0) {
            cache.yLabels.push(yLabelsFactory.add('text'));
            yTicks--;
        }
        while (xTicks > 0) {
            cache.xLabels.push(xLabelsFactory.add('text'));
            xTicks--;
        }

        cache.marker = markersFactory.add("circle")

        cache.margin = {
            top: 25,
            left: 50,
            right: 25,
            bottom: 25
        }
        cache.isInitialized = true;

        cache.chartLine.setAttribute("class", "chartLine");
        cache.xAxis.setAttribute("class", "axis");
        cache.yAxis.setAttribute("class", "axis");
        cache.marker.setAttribute("class", "marker");
        cache.marker.setAttribute("r", 3)

        svg.appendChild(cache.xAxis);
        svg.appendChild(cache.yAxis);
        svg.appendChild(cache.chartLine);
        svg.appendChild(cache.marker);

        cache.xLabels.forEach(element => {
            svg.appendChild(element);
        });
        cache.yLabels.forEach(element => {
            svg.appendChild(element);
        });
    }

    return cache;
}