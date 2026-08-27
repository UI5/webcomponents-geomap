import GeomapContainerControlWrapper from "../../src/extensions/controls/GeomapContainerControlWrapper.js";
import type { Map } from "../../src/MapLibre.js";

describe("GeomapContainerControlWrapper", () => {
	let wrapper: GeomapContainerControlWrapper;
	let mockMap: Map;

	beforeEach(() => {
		mockMap = {} as Map;
	});

	describe("Constructor", () => {
		it("should create a slot element with the given slot name", () => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "test-slot" });

			expect(wrapper._slot).to.be.instanceOf(HTMLSlotElement);
			expect(wrapper._slot.name).to.equal("test-slot");
		});

		it("should accept different slot names", () => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "my-container-123" });

			expect(wrapper._slot.name).to.equal("my-container-123");
		});

		it("should not have a map reference before onAdd", () => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "test-slot" });

			expect(wrapper._map).to.be.undefined;
		});
	});

	describe("onAdd", () => {
		beforeEach(() => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "test-slot" });
		});

		it("should return an HTMLDivElement", () => {
			const container = wrapper.onAdd(mockMap);

			expect(container).to.be.instanceOf(HTMLDivElement);
		});

		it("should set the map reference", () => {
			wrapper.onAdd(mockMap);

			expect(wrapper._map).to.equal(mockMap);
		});

		it("should create a container with maplibregl-ctrl class", () => {
			const container = wrapper.onAdd(mockMap);

			expect(container.className).to.equal("maplibregl-ctrl");
		});

		it("should append the slot element to the container", () => {
			const container = wrapper.onAdd(mockMap);

			expect(container.children).to.have.length(1);
			expect(container.children[0]).to.equal(wrapper._slot);
		});

		it("should have the correct slot name in the appended slot", () => {
			const container = wrapper.onAdd(mockMap);
			const slot = container.querySelector("slot");

			expect(slot).to.not.be.null;
			expect(slot!.name).to.equal("test-slot");
		});

		it("should store the container reference", () => {
			const container = wrapper.onAdd(mockMap);

			expect(wrapper._container).to.equal(container);
		});
	});

	describe("onRemove", () => {
		beforeEach(() => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "test-slot" });
		});

		it("should clear the map reference", () => {
			wrapper.onAdd(mockMap);
			wrapper._container.remove = cy.stub();

			// Simulate being in the DOM
			const parent = document.createElement("div");
			parent.appendChild(wrapper._container);

			wrapper.onRemove();

			expect(wrapper._map).to.be.undefined;
		});

		it("should remove the container from its parent", () => {
			wrapper.onAdd(mockMap);

			const parent = document.createElement("div");
			parent.appendChild(wrapper._container);

			expect(parent.children).to.have.length(1);

			wrapper.onRemove();

			expect(parent.children).to.have.length(0);
		});

		it("should not throw if container has no parent", () => {
			wrapper.onAdd(mockMap);

			expect(() => {
				wrapper.onRemove();
			}).to.not.throw();
		});
	});

	describe("setSlotName", () => {
		beforeEach(() => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "initial-slot" });
		});

		it("should update the slot name", () => {
			wrapper.setSlotName("updated-slot");

			expect(wrapper._slot.name).to.equal("updated-slot");
		});

		it("should update the slot name after onAdd", () => {
			wrapper.onAdd(mockMap);
			wrapper.setSlotName("new-slot");

			const slot = wrapper._container.querySelector("slot");
			expect(slot!.name).to.equal("new-slot");
		});

		it("should allow changing slot name multiple times", () => {
			wrapper.setSlotName("first");
			expect(wrapper._slot.name).to.equal("first");

			wrapper.setSlotName("second");
			expect(wrapper._slot.name).to.equal("second");

			wrapper.setSlotName("third");
			expect(wrapper._slot.name).to.equal("third");
		});

		it("should handle empty string slot name", () => {
			wrapper.setSlotName("");

			expect(wrapper._slot.name).to.equal("");
		});
	});

	describe("IControl interface compliance", () => {
		it("should implement onAdd method", () => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "test" });

			expect(wrapper).to.have.property("onAdd");
			expect(wrapper.onAdd).to.be.a("function");
		});

		it("should implement onRemove method", () => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "test" });

			expect(wrapper).to.have.property("onRemove");
			expect(wrapper.onRemove).to.be.a("function");
		});
	});

	describe("Lifecycle", () => {
		it("should support full add → update → remove lifecycle", () => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "lifecycle-slot" });

			// Add
			const container = wrapper.onAdd(mockMap);
			expect(wrapper._map).to.equal(mockMap);
			expect(container.querySelector("slot")!.name).to.equal("lifecycle-slot");

			// Update slot
			wrapper.setSlotName("updated-lifecycle-slot");
			expect(container.querySelector("slot")!.name).to.equal("updated-lifecycle-slot");

			// Remove
			const parent = document.createElement("div");
			parent.appendChild(container);
			wrapper.onRemove();
			expect(wrapper._map).to.be.undefined;
			expect(parent.children).to.have.length(0);
		});

		it("should support re-adding after removal", () => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "reuse-slot" });

			// First add
			const container1 = wrapper.onAdd(mockMap);
			const parent1 = document.createElement("div");
			parent1.appendChild(container1);
			wrapper.onRemove();

			expect(wrapper._map).to.be.undefined;

			// Second add
			const container2 = wrapper.onAdd(mockMap);
			expect(wrapper._map).to.equal(mockMap);
			expect(container2).to.be.instanceOf(HTMLDivElement);
			expect(container2.className).to.equal("maplibregl-ctrl");
			expect(container2.querySelector("slot")!.name).to.equal("reuse-slot");
		});
	});

	describe("DOM structure", () => {
		it("should produce correct DOM hierarchy: div.maplibregl-ctrl > slot[name]", () => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "dom-test" });
			const container = wrapper.onAdd(mockMap);

			expect(container.tagName).to.equal("DIV");
			expect(container.classList.contains("maplibregl-ctrl")).to.be.true;
			expect(container.childElementCount).to.equal(1);

			const slot = container.firstElementChild as HTMLSlotElement;
			expect(slot.tagName).to.equal("SLOT");
			expect(slot.name).to.equal("dom-test");
		});

		it("should not add extra classes or attributes to the container", () => {
			wrapper = new GeomapContainerControlWrapper({ slotName: "clean-test" });
			const container = wrapper.onAdd(mockMap);

			expect(container.classList).to.have.length(1);
			expect(container.id).to.equal("");
		});
	});
});