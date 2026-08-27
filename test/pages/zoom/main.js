import geoJsonData1 from './data1.geojson.json?url'; //?raw => as string
import geoJsonData2 from './data2.geojson.json?url'; //?raw => as string
import geoJsonData3 from './data3.geojson.json?url'; //?raw => as string
document.getElementById("data1").setAttribute("geojson-url", geoJsonData1);
document.getElementById("data2").setAttribute("geojson-url", geoJsonData2);
document.getElementById("data3").setAttribute("geojson-url", geoJsonData3);