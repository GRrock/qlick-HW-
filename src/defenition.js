//import qexrt from "../out/svgTestGrigorev.qext"

export default {
     type: "items", 
     component: "accordion",
     items: {
         dimensions: {
             uses: "dimensions",
             min: 1,
             max: 1
         },
         measures: {
            uses: "measures",
            min: 1,
            max: 1
        },
         settings: {
             uses: "settings"
         }
     }
 }