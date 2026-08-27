import Cluster from "../../src/Cluster.js";
import Map from "../../src/extensions/Map.js";

describe("Cluster", () => {
	beforeEach(() => {
		// runs before each test in this block
	});

	describe("test methods", () => {
		it("tests get type", () => {
			const f = new Cluster({},{}, {});
			expect(f.type).to.equal("Feature");
		});

		it("tests get id", () => {
			const f = new Cluster({},{}, {id: "dummy"});
			expect(f.id).to.equal("dummy");
		});


		it("tests isCluster", () => {
			const f = {
				'type': 'Feature',
				'geometry': {
					'type': 'LineString',
					'coordinates': [
						[-73.98270540162157, 40.72607712159058],
						[2.3415010101080327, 48.85653689004303]
					]
				},
				'properties': {
					'cluster': true,
				}
			};

			expect(Cluster.isCluster(f)).to.be.true;

			f.properties.cluster = false;
			expect(Cluster.isCluster(f)).to.be.false;
		});

		it("tests expand", async () => {
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			const f = {
				'type': 'Feature',
				'geometry': {
					'type': 'LineString',
					'coordinates': [
						[-73.98270540162157, 40.72607712159058],
						[2.3415010101080327, 48.85653689004303]
					]
				},
				'properties': {
					'cluster': true,
					'cluster_id': 'dummyId',
				}
			};
			const center = {center: [[-73.98270540162157, 40.72607712159058], [2.3415010101080327, 48.85653689004303]], zoom: 3};
			const stub = cy.stub(map, "easeTo");
			const c = new Cluster(map,{}, f);
			try {
				c.expand().catch((e) => {
					expect(e.message).to.equal("this.source.getClusterExpansionZoom is not a function");
				});
			} catch (e) {
				expect(e.message).to.equal("Not implemented");
			}

			c.source = {
				getClusterExpansionZoom: () => {
					return 3;
				}
			}
			const zoom = await c.expand();
			expect(zoom).to.deep.equal(3);
			expect(stub.called).to.equal(true);
			expect(stub.calledWith(center)).to.equal(true);

		});

		it("tests getChildren", async () => {
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			const f = {
				'type': 'Feature',
				'geometry': {
					'type': 'LineString',
					'coordinates': [
						[-73.98270540162157, 40.72607712159058],
						[2.3415010101080327, 48.85653689004303]
					]
				},
				'properties': {
					'cluster': true,
					'cluster_id': 'dummyId',
				}
			};
			const c = new Cluster(map,{}, f);
			try {
				c.getChildren().catch((e) => {
					expect(e.message).to.equal("this.source.getClusterChildren is not a function");
				});
			} catch (e) {
				expect(e.message).to.equal("Not implemented");
			}

			c.source = {
				getClusterChildren: () => {
					return [f];
				}
			}
			const children = await c.getChildren();
			expect(children).to.deep.equal([f]);


		});

		it("tests getLeaves", async () => {
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			const f = {
				'type': 'Feature',
				'geometry': {
					'type': 'LineString',
					'coordinates': [
						[-73.98270540162157, 40.72607712159058],
						[2.3415010101080327, 48.85653689004303]
					]
				},
				'properties': {
					'cluster': true,
					'cluster_id': 'dummyId',
				}
			};
			const c = new Cluster(map,{}, f);
			try {
				c.getLeaves(0,0).catch((e) => {
					expect(e.message).to.equal("this.source.getClusterLeaves is not a function");
				});
			} catch (e) {
				expect(e.message).to.equal("Not implemented");
			}

			c.source = {
				getClusterLeaves: () => {
					return [f];
				}
			}
			const leaves = await c.getLeaves(0,0);
			expect(leaves).to.deep.equal([f]);
		});
	});
});
