import GeomapCopyrightControl from "../../src/GeomapCopyrightControl.js";
import GeomapCopyrightControlWrapper from "../../src/extensions/controls/GeomapCopyrightControlWrapper.js";
import Map from "../../src/extensions/Map";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("ui5-geomap-copyright-control", () => {
	beforeEach(() => {
		// runs before each test in this block
		setWorkerUrl("dummy");
	});
    describe("test methods", () => {
        it("tests handleInvalidation method", () => {
                // Arrange
                const copyright = new GeomapCopyrightControl();
                const map = new Map({
                    container: document.createElement("div"),
                    attributionControl: false,
                    zoom: 5
                });
                const wrapper = new GeomapCopyrightControlWrapper({
                    slotName: copyright._individualSlot ?? "",
                });

                // Act
                copyright.handleInvalidation({type: "slot"});

                // Assert
                expect(wrapper._slot.name).to.equal("");

                // Arrange
                copyright._instance = wrapper;
                copyright.map = map;
                copyright._individualSlot = "_individualSlot";

                // Act
                copyright.handleInvalidation({type: "slot"});

                // Assert
                expect(wrapper._slot.name).to.equal("_individualSlot");
        });
    });
});
