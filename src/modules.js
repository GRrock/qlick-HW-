
const yRange = function (min, max, ticks) {
    let i = 1;
    while (true) {
        if ((max - min) % ticks !== 0) {
            if (i > 0) {
                max++;
            } else {
                min--;
            }
        } else {
            break;
        }
        i = i * -1;
    }
    return [min, max]
}

const binarySearch = function (arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
    var left = 0;  // inclusive
    var right = arr.length;  // exclusive
    var found;
    while (left < right) {
        var middle = (left + right) >> 1;
        var compareResult;
        if (isEvaluator) {
            compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
        } else {
            compareResult = compareFn(opt_target, arr[middle]);
        }
        if (compareResult > 0) {
            left = middle + 1;
        } else {
            right = middle;
            found = !compareResult;
        }
    }
    return found ? left : arr.length - 1;
};

export function yAxisSet(svgElement, yLegend, margin, stepY, heightOfSVG, yLabels) {

    const pointsOfAxisY = yLegend.reduce((acc, element, index) => {
        yLabels[yLabels.length - 1 - index].textContent = element;
        yLabels[index].setAttribute('x', 0);
        yLabels[index].setAttribute('y', margin.top + (stepY * index) + 5);
        return acc += ` M ${margin.left} ${margin.top + (stepY * index)} l -10 0`;
    }, `M ${margin.left} ${margin.top} l 0 ${heightOfSVG}`)

    svgElement.setAttribute("d", pointsOfAxisY);
}

export function xAxisSet(svgElement, margin, stepX, widthOfSVG, heightOfSVG, xLabels) {
    let availableWidth = 0;

    const [labelsWidth, labelsHeight] = xLabels.reduce((acc, element) => {
        acc[0].push(element.getBoundingClientRect().width)
        acc[1].push(element.getBoundingClientRect().height)
        return acc;
    }, [[], []])

    const pointsOfAxisX = xLabels.reduce((acc, element, index) => {
        element.setAttribute('x', ((margin.left + (stepX * index)) + stepX / 2) - (labelsWidth[index] / 2));
        element.setAttribute('y', heightOfSVG + margin.top + labelsHeight[index] + 4);

        if (availableWidth > ((margin.left + (stepX * index)) + stepX / 2) - (labelsWidth[index] / 2)) {
            element.style.visibility = 'hidden';
        } else {
            element.style.visibility = 'visible';
            availableWidth = ((margin.left + (stepX * index)) + stepX / 2) + (labelsWidth[index] / 2)
        }

        return acc += ` M ${margin.left + (index * stepX)} ${heightOfSVG + margin.top} l 0 10`;

    }, `M ${margin.left} ${heightOfSVG + margin.top} l ${widthOfSVG} 0`)

    svgElement.setAttribute("d", pointsOfAxisX);
}

export function chartLineSet(svgElement, x, y) {

    const chartPoints = y.reduce((acc, element, index) => {
        return acc += ` ${x[index]} ${y[index]}`;
    }, `M`);
    svgElement.setAttribute('d', chartPoints);
}

export default function draw(svg, yValues, xValues, yTicks, xTicks, cache, tooltip, heightOfSVG, widthOfSVG) {
    let indexCompresionY = 0;

    const yAxis = cache.yAxis;
    const xAxis = cache.xAxis;
    const chartLine = cache.chartLine;
    const margin = cache.margin;
    const marker = cache.marker;
    const xLabels = cache.xLabels;
    const yLabels = cache.yLabels;

    const stepY = (heightOfSVG) / (yTicks - 1);
    const stepX = (widthOfSVG) / xTicks;

    const [MinY, MaxY] = yRange(Math.min(...yValues), Math.max(...yValues), yTicks)

    if (MaxY === MinY) {
        indexCompresionY = heightOfSVG / (Math.abs(MaxY) * 2);
    } else {
        indexCompresionY = heightOfSVG / (MaxY - MinY);
    }
    // заполняем точки для x и y
    const [x, y] = yValues.reduce((acc, element, index) => {
        acc[0].push((stepX * index) + (stepX / 2) + margin.left);
        acc[1].push(margin.top + (MaxY * indexCompresionY) - (element * indexCompresionY));
        return acc;
    }, [[], []])

    // составляем значения
    const chain = (MaxY - MinY) / (yTicks - 1)
    const yLegend = [];

    for (let index = 0; index < yTicks; index++) {
        yLegend.push((MinY + (chain * index)).toFixed(1))
    }

    // заполняем лейблы оси Х значениями 
    xValues.map((element, index) => {
        xLabels[index].textContent = element;
        xLabels[index].setAttribute('class', 'xLabels')
    })
    // составляем карту значения для бинарного поиска 
    const mapOfYvalues = yValues.reduce((acc, element, index) => {
        acc.push((margin.left + stepX) + (stepX * index));
        return acc
    }, [])
    // вешаем обработчик на svg для отображения тултипа и маркера
    svg.addEventListener('mousemove', e => {
        const indexOfarr = binarySearch(mapOfYvalues, ((target, middel) => target > middel), false, e.offsetX);

        if (e.offsetX < margin.left || e.offsetX > widthOfSVG + margin.left ||
            e.offsetY < margin.top || e.offsetY > heightOfSVG + margin.top) {
            tooltip.style.visibility = 'hidden';
            marker.style.visibility = 'hidden';
        } else {
            tooltip.style.visibility = 'visible';
            marker.style.visibility = 'visible';

            tooltip.style.top = 10 + e.offsetY + "px";
            tooltip.style.left = 10 + e.offsetX + "px";
            marker.setAttribute("cx", x[indexOfarr])
            marker.setAttribute("cy", y[indexOfarr])

            tooltip.innerHTML = yValues[indexOfarr] + "<br>" + xValues[indexOfarr]
        }
    })
    svg.addEventListener('mouseout', e => {
        tooltip.style.visibility = 'hidden';
        marker.style.visibility = 'hidden';
    })
    // рисуем оси и чарт
    yAxisSet(yAxis, yLegend, margin, stepY, heightOfSVG, yLabels);
    xAxisSet(xAxis, margin, stepX, widthOfSVG, heightOfSVG, xLabels);
    chartLineSet(chartLine, x, y);
}