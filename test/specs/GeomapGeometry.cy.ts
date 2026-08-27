import GeomapGeometry from "../../src/geometry/GeomapGeometry.js";

describe("GeomapGeometry", () => {
	beforeEach(() => {
		// runs before each test in this block
	});

	describe("test methods", () => {
		it("tests geomapPoint, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;

			let pt = geometry.geomapPoint([-77, 44]);

			expect(pt.type).to.equal("Feature");
			expect(pt.geometry.type).to.equal("Point");
			expect(pt.geometry.coordinates[0]).to.equal(-77);
			expect(pt.geometry.coordinates[1]).to.equal(44);

			try {
				pt = geometry.geomapPoint([]);
			} catch (e) {
				expect(e.message).to.equal("Missing one of the point coordinates. Please make sure you provide correct point coordinates");
			}
		});

		it("tests geomapPoints, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;

			const fs = geometry.geomapPoints([[-77, 44], [110, 70]], {id: "random"});

			expect(fs.type).to.equal("FeatureCollection");
			expect(fs.features.length).to.equal(2);
			expect(fs.features[0].type).to.equal("Feature");
			expect(fs.features[0].geometry.type).to.equal("Point");
			expect(fs.features[0].geometry.coordinates[0]).to.equal(-77);
			expect(fs.features[0].geometry.coordinates[1]).to.equal(44);
			expect(fs.features[0].type).to.equal("Feature");
			expect(fs.features[1].geometry.type).to.equal("Point");
			expect(fs.features[1].geometry.coordinates[0]).to.equal(110);
			expect(fs.features[1].geometry.coordinates[1]).to.equal(70);
		});

		it("tests geomapCreateFeature, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const geom = {
				type: "Point",
				coordinates: [-77, 44]
			}

			let f = geometry.geomapCreateFeature(geom);

			expect(f.type).to.equal("Feature");
			expect(f.geometry.type).to.equal("Point");
			expect(f.geometry.coordinates[0]).to.equal(-77);
			expect(f.geometry.coordinates[1]).to.equal(44);

			f = geometry.geomapCreateFeature(geom, {}, {id: "dummyId", bbox: {}});

			expect(f.type).to.equal("Feature");
			expect(f.id).to.equal("dummyId");
			expect(f.bbox).to.deep.equal({});
			expect(f.geometry.type).to.equal("Point");
			expect(f.geometry.coordinates[0]).to.equal(-77);
			expect(f.geometry.coordinates[1]).to.equal(44);
		});

		it("tests geomapFeatureSet, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const geom = {
				type: "Point",
				coordinates: [-77, 44],
				id: "dummyId"
			}

			const f = geometry.geomapCreateFeature(geom);
			let fs = geometry.geomapFeatureSet(f);

			expect(fs.type).to.equal("FeatureCollection");
			expect(fs.features.type).to.equal("Feature");
			expect(fs.features.geometry.type).to.equal("Point");
			expect(fs.features.geometry.coordinates[0]).to.equal(-77);
			expect(fs.features.geometry.coordinates[1]).to.equal(44);

			fs = geometry.geomapFeatureSet(f, {id: "dummyId", bbox: {}});

			expect(fs.type).to.equal("FeatureCollection");
			expect(fs.id).to.equal("dummyId");
			expect(fs.bbox).to.deep.equal({});
			expect(fs.features.type).to.equal("Feature");
			expect(fs.features.geometry.type).to.equal("Point");
			expect(fs.features.geometry.coordinates[0]).to.equal(-77);
			expect(fs.features.geometry.coordinates[1]).to.equal(44);
		});

		it("tests geomapLine, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const aPoints = [[-77, 44], [110, 70], [110, 40]];

			let line = geometry.geomapLine(aPoints);

			expect(line.type).to.equal("Feature");
			expect(line.geometry.type).to.equal("LineString");
			expect(line.geometry.coordinates.length).to.equal(3);

			try {
				line = geometry.geomapLine([]);
			} catch (e) {
				expect(e.message).to.equal("Given coordinates must be an array of at lease two positions.");
			}
		});

		it("tests geomapLines, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const aPoints = [[-77, 44], [110, 70], [110, 40]];

			const lines = geometry.geomapLines([aPoints]);
			expect(lines.type).to.equal("FeatureCollection");
			expect(lines.features.length).to.equal(1);
			expect(lines.features[0].type).to.equal("Feature");
			expect(lines.features[0].geometry.type).to.equal("LineString");
			expect(lines.features[0].geometry.coordinates.length).to.equal(3);
		});

		it("tests transformToGeometricType, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const ptCoords = [-77, 44];

			let geom = geometry.transformToGeometricType("Point", ptCoords);

			expect(geom.type).to.equal("Point");
			expect(geom.coordinates[0]).to.equal(-77);
			expect(geom.coordinates[1]).to.equal(44);

			const lineCoords = [[-77, 44], [110, 70], [110, 40]];
			geom = geometry.transformToGeometricType("LineString", lineCoords);

			expect(geom.type).to.equal("LineString");

			try {
				geom = geometry.transformToGeometricType("LineString", []);
			} catch (e) {
				expect(e.message).to.equal("Given coordinates must be an array of at lease two positions.");
			}
			try {
				geom = geometry.transformToGeometricType(undefined, []);
			} catch (e) {
				expect(e.message).to.equal("Given geometry type is not correct. Please make sure you provide correct geometry type!");
			}
		});

		it("tests geomapPolygon, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			let polygon = geometry.geomapPolygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });

			expect(polygon.type).to.equal("Feature");
			expect(polygon.geometry.type).to.equal("Polygon");
			expect(polygon.geometry.coordinates[0].length).to.equal(5);
			expect(polygon.properties.name).to.equal("poly1");

			try {
				polygon = geometry.geomapPolygon([[]]);
			} catch (e) {
				expect(e.message).to.equal("Given coordinates for polygon are incorrect. Please check input arguments.");
			}

			try {
				polygon = geometry.geomapPolygon([[[-5, 52], [-4, 56], [-2, 51]]]);
			} catch (e) {
				expect(e.message).to.equal("Each LinearRing of a Polygon must have 4 or more Positions.");
			}

			try {
				polygon = geometry.geomapPolygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54]]]);
			} catch (e) {
				expect(e.message).to.equal("First and last Position are not equivalent.");
			}
		});

		it("tests geomapPolygons, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const polygons = geometry.geomapPolygons([
				[[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
				[[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
			]);

			expect(polygons.type).to.equal("FeatureCollection");
			expect(polygons.features.length).to.equal(2);
			expect(polygons.features[0].type).to.equal("Feature");
			expect(polygons.features[1].type).to.equal("Feature");
			expect(polygons.features[0].geometry.type).to.equal("Polygon");
			expect(polygons.features[1].geometry.type).to.equal("Polygon");
			expect(polygons.features[0].geometry.coordinates[0].length).to.equal(5);
			expect(polygons.features[1].geometry.coordinates[0].length).to.equal(5);
		});

		it("tests geomapBearing, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const bearing = geometry.geomapBearing([110, 70], [-77, 44], {final: true});

			expect(bearing).to.equal(177.38254591180507);
		});

		it("tests calculateFinalBearing, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const bearing = geometry.calculateFinalBearing([110, 70],[-77, 44]);

			expect(bearing).to.equal(177.38254591180507);
		});

		it("tests calculatePointDestination, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const oPoint = geometry.geomapPoint([-75.343, 39.984]);
			const iDistance = 50;
			const iBearing = 90;
			const oOptions = {units: 'miles'};

			const destination = geometry.calculatePointDestination(oPoint, iDistance, iBearing, oOptions);

			expect(destination.type).to.equal("Feature");
			expect(destination.geometry.type).to.equal("Point");
			expect(destination.geometry.coordinates[0]).to.equal(-74.399);
			expect(destination.geometry.coordinates[1]).to.equal(39.98);
		});

		it("tests geomapAlong, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const line = geometry.geomapLine([[-83, 30], [-84, 36], [-78, 41]]);
			const options = {units: 'miles'};

			const along = geometry.geomapAlong(line, 200, options);

			expect(along.type).to.equal("Feature");
			expect(along.geometry.type).to.equal("Point");
			expect(along.geometry.coordinates[0]).to.equal(-83.461);
			expect(along.geometry.coordinates[1]).to.equal(32.868);
		});

		it("tests geomapCircle, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			let center = [-75.343, 39.984];
			const radius = 5;
			const options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
			let circle = geometry.geomapCircle(center, radius, options);

			expect(circle.type).to.equal("Feature");
			expect(circle.geometry.type).to.equal("Polygon");
			expect(circle.geometry.coordinates[0].length).to.equal(11);

			center = geometry.geomapPoint([-75.343, 39.984]);
			center.properties = {foo: 'bar'};
			circle = geometry.geomapCircle(center, radius);

			expect(circle.type).to.equal("Feature");
			expect(circle.geometry.type).to.equal("Polygon");
		});

		it("tests geomapCentroid, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068, BGSOFUISAKAR-1249", () => {

			const geometry = GeomapGeometry;
			const polygon = geometry.geomapPolygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);

			const geometryCoordinatesIterator = cy.spy(geometry, "geometryCoordinatesIterator");

			const centroid = geometry.geomapCentroid(polygon);

			expect(centroid.type).to.equal("Feature");
			expect(centroid.geometry.type).to.equal("Point");
			expect(centroid.geometry.coordinates[0]).to.equal(-82);
			expect(centroid.geometry.coordinates[1]).to.equal(36);

			expect(geometryCoordinatesIterator.callCount).to.equal(1);
		});

		it("tests geomapCalculateDistance, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068, BGSOFUISAKAR-1249", () => {

			const geometry = GeomapGeometry;
			const geoJSON = {
				'type': 'Feature',
				'geometry': {
					'type': 'LineString',
					'coordinates': [
						[-73.98270540162157, 40.72607712159058],
						[2.3415010101080327, 48.85653689004303]
					]
				}
			};
			const geomapGeoJSONSegmentsIterator = cy.spy(geometry, "geomapGeoJSONSegmentsIterator");
			const geometryGeoJSONIterator = cy.spy(geometry, "geometryGeoJSONIterator");
			const geometryFlat = cy.spy(geometry, "geometryFlat");
			const geometryIterate = cy.spy(geometry, "geometryIterate");
			const geometryCoordinatesIterator = cy.spy(geometry, "geometryCoordinatesIterator");

			const distance = geometry.geomapCalculateDistance(geoJSON, {units: 'kilometers'});

			expect(distance).to.be.closeTo(5834.068566198603, 0.0001);
			expect(geomapGeoJSONSegmentsIterator.callCount).to.equal(1);
			expect(geometryGeoJSONIterator.callCount).to.equal(1);
			expect(geometryFlat.callCount).to.equal(1);
			expect(geometryIterate.callCount).to.equal(1);
			expect(geometryCoordinatesIterator.callCount).to.equal(1);
		});

		it("tests NotSelfIntersectingValidation, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const polygon = geometry.geomapPolygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
			const valid = geometry.NotSelfIntersectingValidation(polygon);
			expect(valid.valid).to.be.true;
		});

		it("tests geometryIterate, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const polygon = geometry.geomapPolygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
			polygon.type = "DUMMY";

			try {
				const g = geometry.geometryIterate(polygon);
			} catch (e) {
				expect(e.message).to.equal("Given geometry type is not correct. Please make sure you provide correct geometry type");
			}
		});

		it("tests geometryCoordinatesIterator, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068, , BGSOFUISAKAR-1294", () => {

			const geometry = GeomapGeometry;
			const polygon = geometry.geomapPolygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
			polygon.type = "DUMMY";

			try {
				const g = geometry.geometryCoordinatesIterator(polygon);
			} catch (e) {
				expect(e.message).to.equal("Geometry type is not correct. Please make sure you provide a correct geometry type.");
			}
		});

		it("tests geometryGeoJSONIterator, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068, BGSOFUISAKAR-1294", () => {

			const geometry = GeomapGeometry;
			let polygon = geometry.geomapPolygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
			polygon.type = "DUMMY";

			try {
				const g = geometry.geometryGeoJSONIterator(polygon);
			} catch (e) {
				expect(e.message).to.equal('Given geometry type is not correct. Please make sure you provide correct geometry type');
			}

			const pt = {
				type: "Point",
				coordinates: [-77, 44]
			}

			try {
				const g = geometry.geometryGeoJSONIterator(pt);
				expect(g).to.equal(undefined);
			} catch (e) {
				expect(e.message).to.equal('Given geometry type is not correct. Please make sure you provide correct geometry type');
			}
		});

		it("tests getGeometry", () => {

			const geometry = GeomapGeometry;
			let polygon = geometry.geomapPolygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
			polygon.type = "Polygon";

			let expected = {
				type: "Polygon",
				coordinates: [[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]
			};

			let g = geometry.getGeometry(polygon, 0, false, true);
			expect(g).to.deep.equal(expected);

			const fs = geometry.geomapPoints([[-77, 44], [110, 70]], {id: "random"});
			expected = {
				type: "Point",
				coordinates: [-77, 44]
			};

			g = geometry.getGeometry(fs, 0, true, false);
			expect(g).to.deep.equal(expected);

			g = geometry.getGeometry(polygon, 0, false, false);
			expect(g).to.deep.equal(polygon);
		});

		it("tests getFeatureData", () => {

			const geometry = GeomapGeometry;
			let polygon = geometry.geomapPolygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
			polygon.type = "Polygon";

			let expected = {
				type: "Polygon",
				geometry: {
					type: "Polygon",
					coordinates: [[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]
				},
				properties: {},
				bbox: undefined,
				id: undefined,
			};

			let g = geometry.getFeatureData(polygon, 0, false, true);
			expect(g).to.deep.equal(expected);

			const fs = geometry.geomapPoints([[-77, 44], [110, 70]], {id: "random"});
			expected = {
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [-77, 44]
				},
				properties: {
					id: "random"
				},
				bbox: undefined,
				id: undefined,
			};

			g = geometry.getFeatureData(fs, 0, true, false);
			expect(g).to.deep.equal(expected);

			g = geometry.getFeatureData(polygon, 0, false, false);
			expected = {
				geometry: polygon, properties: {}, bbox: undefined, id: undefined,
			};
			expect(g).to.deep.equal(expected);
		});
	});
});
