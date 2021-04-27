import "@babel/polyfill";
import "./style.css";
import paint from './paint.js';
import template from './template.html';
import support from './support.json'
import localCss from './style.css';
import initialProperties from './initialProperties.js';
import definition from './defenition.js'

export default {
    paint,
    initialProperties,
    template,
    definition,
    support,
    localCss
}
