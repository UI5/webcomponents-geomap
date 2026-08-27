import GeomapGeometry from "../../src/geometry/GeomapGeometry.js";
import GeomapGeometryUtil from "../../src/geometry/GeomapGeometryUtil.js";

describe("GeomapGeometryUtil", () => {
	beforeEach(() => {
		// runs before each test in this block
	});

	describe("test methods", () => {
		it("tests isPointInPolygon, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const util = GeomapGeometryUtil;

			const pt = geometry.geomapPoint([-77, 44]);
			const polygon = geometry.geomapPolygon([[
				[-81, 41],
				[-81, 47],
				[-72, 47],
				[-72, 41],
				[-81, 41]
			]]);

			let result = util.isPointInPolygon(pt, polygon);
			expect(result).to.be.true;

			try {
				result = util.isPointInPolygon(pt);
			} catch (e) {
				expect(e.message).to.be.equal("Please make sure you provide correct arguments.");
			}

			try {
				result = util.isPointInPolygon(null, polygon);
			} catch (e) {
				expect(e.message).to.be.equal("Please make sure you provide correct arguments.");
			}
		});

		it("tests isPointInPolygon - bbox, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068, BGSOFUISAKAR-1294", () => {

			const geometry = GeomapGeometry;
			const util = GeomapGeometryUtil;

			const pt = geometry.geomapPoint([-77, 44]);
			const polygon = geometry.geomapPolygon([[
				[-81, 41],
				[-81, 47],
				[-72, 47],
				[-72, 41],
				[-81, 41]
			]]);

			polygon.bbox = [0, 0, 10, 10];

			let result = util.isPointInPolygon(pt, polygon, {ignoreBoundary: true});
			expect(result).to.be.false;
		});

		it("tests pointInPolygonBounds, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068, BGSOFUISAKAR-1294", () => {

			const geometry = GeomapGeometry;
			const util = GeomapGeometryUtil;

			const pt = geometry.geomapPoint([-77, 44]);
			const polygon = geometry.geomapPolygon([[
				[-81, 41],
				[-81, 47],
				[-72, 47],
				[-72, 41],
				[-81, 41]
			]]);

			let result = util.pointInPolygonBounds(pt, polygon);
			expect(result).to.be.true;

			try {
				result = util.pointInPolygonBounds(pt);
			} catch (e) {
				expect(e.message).to.be.equal("Please make sure you provide correct arguments.");
			}
			try {
				result = util.pointInPolygonBounds();
			} catch (e) {
				expect(e.message).to.be.equal("Please make sure you provide correct arguments.");
			}
		});

		it("tests geomapPointInPolygon, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const util = GeomapGeometryUtil;

			const point = [13.283843994140625, 42.16849286599469];
			let polygon = [
				[
					[12.367115771, 42.778762088],
					[14.681863801, 42.63796868],
					[13.214789935, 40.934229176],
					[12.367115771, 42.778762088]
				]
			];

			let result = util.geomapPointInPolygon(point, polygon);
			expect(result).to.be.true;

			polygon = [
				[
					[12.367115771, 42.778762088],
					[14.681863801, 42.63796868],
					[13.214789935, 40.934229176]
				]
			];

			try {
				result = util.geomapPointInPolygon(point, polygon);
			} catch (e) {
				expect(e.message).to.be.equal("First and last coordinates in the polygon must be the same. Please make sure you provide correct polygon.");
			}
		});

		it("tests geomapPointInPolygon - false cases BLI: BGSOFUISAKAR-1067, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068, BGSOFUISAKAR-1294", () => {

			const geometry = GeomapGeometry;
			const util = GeomapGeometryUtil;

			const point = [-33.673095703125, 57.1243140842962];
			let polygon = [
				[
					[62.271035372, 19.474813514],
					[81.245222205, 13.907334242],
					[64.563192719, 1.426088746],
					[62.271035372, 19.474813514]
				]
			];

			let result = util.geomapPointInPolygon(point, polygon);
			expect(result).to.be.false;

			polygon = [
				[
					[12.367115771, 42.778762088],
					[14.681863801, 42.63796868],
					[13.214789935, 40.934229176]
				]
			];
		});

		it("tests calculateDestination, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const geometry = GeomapGeometry;
			const util = GeomapGeometryUtil;

			const oPoint = geometry.geomapPoint([-75.343, 39.984]);
			const iDistance = 50;
			const iBearing = 90;
			const oOptions = {units: 'miles'};

			let destination = util.calculateDestination(oPoint, iDistance, iBearing, oOptions);

			expect(destination.lat).to.equal(39.98);
			expect(destination.lng).to.equal(-74.399);

			destination = util.calculateDestination(undefined, iDistance, iBearing, oOptions);

			expect(destination.lat).to.equal(0);
			expect(destination.lng).to.equal(0);

		});

		it("tests inBBox, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;

			const pt = [-75.343, 39.984];
			const inBbox = util.inBBox(pt, [-180, 84.48577680525165, -179, 86.06126914660831]);

			expect(inBbox).to.be.false;
		});

		it("tests extractGeomapGeometry, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;

			const pt = {
				"type": "Feature",
				"properties": {},
				"geometry": {
					"type": "Point",
					"coordinates": [110, 40]
				}
			}
			let oGeometry = util.extractGeomapGeometry(pt);

			expect(oGeometry.type).to.equal("Point");
			expect(oGeometry.coordinates[0]).to.equal(110);
			expect(oGeometry.coordinates[1]).to.equal(40);

			const p = {
				"type": "Point",
				"coordinates": [110, 40]
			};

			oGeometry = util.extractGeomapGeometry(p);

			expect(oGeometry.type).to.equal("Point");
			expect(oGeometry.coordinates[0]).to.equal(110);
			expect(oGeometry.coordinates[1]).to.equal(40);
		});

		it("tests convertLengthToRadians, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;

			let radians = util.convertLengthToRadians(10000, "miles");

			expect(radians).to.equal(2.526042657483066);

			radians = util.convertLengthToRadians(10000, "kilometers");
			expect(radians).to.equal(1.5696101377226164);

			try {
				radians = util.convertLengthToRadians(10000, "dummy");
			} catch (e) {
				expect(e.message).to.be.equal("Provided unit metric is not a valid one");
			}
		});

		it("tests convertRadiansToLength, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;

			let radians = util.convertRadiansToLength(2.526042657483066, "miles");

			expect(radians).to.equal(10000);

			radians = util.convertRadiansToLength(1.5696101377226164, "kilometers");
			expect(radians).to.equal(10000);

			try {
				radians = util.convertRadiansToLength(2.526042657483066, "dummy");
			} catch (e) {
				expect(e.message).to.be.equal("Provided unit metric is not a valid one");
			}
		});

		it("tests convertPointCoordinatesFromDegreesToRadians, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;

			let radians = util.convertPointCoordinatesFromDegreesToRadians(30);

			expect(radians).to.equal(0.5235987755982988);

			try {
				radians = util.convertRadiansToLength(2.526042657483066, "dummy");
			} catch (e) {
				expect(e.message).to.be.equal("Provided unit metric is not a valid one");
			}
		});

		it("tests convertPointCoordinatesFromtRadiansToDegrees, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;

			const radians = util.convertPointCoordinatesFromtRadiansToDegrees(0.52);

			expect(radians).to.equal(29.79380534680281);
		});

		it("tests geomapPolygonValidate, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;
			const polygon = [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]];

			let valid = util.geomapPolygonValidate(polygon);

			expect(valid.bValid).to.be.true;
			expect(valid.sMsg).to.be.equal("");

			valid = util.geomapPolygonValidate();
			expect(valid.bValid).to.be.false;
			expect(valid.sMsg).to.be.equal("Missing coordinates for polygon. Please check input arguments.");

			valid = util.geomapPolygonValidate([[]]);
			expect(valid.bValid).to.be.false;
		});

		it("tests geomapLineValidate, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;
			const line = [[-5, 52], [-4, 56], [-2, 51]];

			let valid = util.geomapLineValidate(line);

			expect(valid.bValid).to.be.true;
			expect(valid.sMsg).to.be.equal("");

			try {
				valid = util.geomapLineValidate({});
			} catch (e) {
				expect(valid.bValid).to.be.false;
			}
		});

		it("tests isValidCoordinates, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;
			const pt = [-5, 52];

			let valid = util.isValidCoordinates(pt);

			expect(valid.bValid).to.be.true;
			expect(valid.sMsg).to.be.equal("");

			valid = util.isValidCoordinates();
			expect(valid.bValid).to.be.false;
			expect(valid.sMsg).to.be.equal("Missing point coordinates. Make sure you provide correct point coordinates");

			valid = util.isValidCoordinates({});
			expect(valid.bValid).to.be.false;
			expect(valid.sMsg).to.be.equal("Point coordinates must be of type array");

		});

		it("tests getPointCoordinates, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;
			let coordinates;
			let pt = {
				"type": "Feature",
				"properties": {},
				"geometry": {
					"type": "Point",
					"coordinates": [110, 40]
				}
			};

			coordinates = util.getPointCoordinates(pt);

			expect(coordinates[0]).to.be.equal(110);
			expect(coordinates[1]).to.be.equal(40);

			pt = {
				"type": "Point",
				"coordinates": [110, 40]
			};

			coordinates = util.getPointCoordinates(pt);

			expect(coordinates[0]).to.be.equal(110);
			expect(coordinates[1]).to.be.equal(40);

			try {
				coordinates = util.getPointCoordinates({});
			} catch (e) {
				expect(e.message).to.be.equal("Coordinates argument must be of type GeoJSON Point or an Array of numbers");
			}

			try {
				coordinates = util.getPointCoordinates();
			} catch (e) {
				expect(e.message).to.be.equal("Please make sure you provide correct argument for coordinates.");
			}
		});

		it("tests pointDistance, BGSOFUISAKAR-1060, BGSOFUISAKAR-1068", () => {

			const util = GeomapGeometryUtil;
			const pt1 = {
				"type": "Feature",
				"properties": {},
				"geometry": {
					"type": "Point",
					"coordinates": [110, 40]
				}
			};

			const pt2 = {
				"type": "Feature",
				"properties": {},
				"geometry": {
					"type": "Point",
					"coordinates": [110, 70]
				}
			};

			const distance = util.pointDistance(pt1, pt2, {units: 'miles'});

			expect(distance).to.be.equal(2072.80258726909);
		});
	});
});
