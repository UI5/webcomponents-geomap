import type GeomapContainerControl from "../../src/GeomapContainerControl.js";
import "../../src/GeomapContainerControl.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Input.js";

describe("ui5-geomap-container-control", () => {
	function mountContainer(content = "", attrs = "") {
		cy.mount(
			`<ui5-geomap-container-control ${attrs}>${content}</ui5-geomap-container-control>`
		);
	}

	describe("test properties", () => {
		it("tests default rendering", () => {
			// Arrange
			mountContainer();

			// Assert
			cy.get("ui5-geomap-container-control").should("exist");
		});

		it("tests shadow DOM slot", () => {
			// Arrange
			mountContainer();

			// Assert
			cy.get("ui5-geomap-container-control")
				.shadow()
				.find("slot")
				.should("exist");
		});

		it("tests empty rendering", () => {
			// Arrange
			mountContainer();

			// Assert
			cy.get("ui5-geomap-container-control")
				.children()
				.should("have.length", 0);
		});

		it("tests plain HTML content slot", () => {
			// Arrange
			mountContainer('<div class="test-content">Hello World</div>');

			// Assert
			cy.get("ui5-geomap-container-control .test-content")
				.should("exist")
				.and("contain.text", "Hello World");
		});

		it("tests multiple child elements slot", () => {
			// Arrange
			mountContainer(`
				<div class="child-1">First</div>
				<div class="child-2">Second</div>
				<div class="child-3">Third</div>
			`);

			// Assert
			cy.get("ui5-geomap-container-control")
				.children()
				.should("have.length", 3);

			cy.get("ui5-geomap-container-control .child-1").should("contain.text", "First");
			cy.get("ui5-geomap-container-control .child-2").should("contain.text", "Second");
			cy.get("ui5-geomap-container-control .child-3").should("contain.text", "Third");
		});

		it("tests nested HTML structures slot", () => {
			// Arrange
			mountContainer(`
				<div class="card">
					<h3 class="card-title">Title</h3>
					<p class="card-body">Body text</p>
				</div>
			`);

			// Assert
			cy.get("ui5-geomap-container-control .card").should("exist");
			cy.get("ui5-geomap-container-control .card-title").should("contain.text", "Title");
			cy.get("ui5-geomap-container-control .card-body").should("contain.text", "Body text");
		});

		it("tests image content slot", () => {
			// Arrange
			mountContainer(`
				<img class="test-img" src="https://i.pravatar.cc/40?u=test" alt="Test image" />
			`);

			// Assert
			cy.get("ui5-geomap-container-control .test-img")
				.should("exist")
				.and("have.attr", "alt", "Test image");
		});

		it("tests inline SVG content slot", () => {
			// Arrange
			mountContainer(`
				<svg width="24" height="24" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" fill="red" />
				</svg>
			`);

			// Assert
			cy.get("ui5-geomap-container-control svg")
				.should("exist");

			cy.get("ui5-geomap-container-control svg circle")
				.should("have.attr", "fill", "red");
		});

		it("tests UI5 Web Components slot", () => {
			// Arrange
			mountContainer('<ui5-button id="slottedBtn">Click me</ui5-button>');

			// Assert
			cy.get("ui5-geomap-container-control ui5-button")
				.should("exist")
				.and("contain.text", "Click me");
		});

		it("tests styled content slot", () => {
			// Arrange
			mountContainer(`
				<div class="styled" style="background: red; padding: 1rem; border-radius: 0.5rem;">
					Styled content
				</div>
			`);

			// Assert
			cy.get("ui5-geomap-container-control .styled")
				.should("have.css", "background-color", "rgb(255, 0, 0)")
				.and("have.css", "border-radius", "8px");
		});

		it("tests content property", () => {
			// Arrange
			mountContainer(`
				<div class="a">A</div>
				<div class="b">B</div>
			`);

			cy.get("ui5-geomap-container-control").then(($el) => {
				const el = $el[0] as GeomapContainerControl;

				// Assert
				expect(el.content).to.be.an("array");
				expect(el.content).to.have.length(2);
			});
		});

		it("tests content property default", () => {
			// Arrange
			mountContainer();

			cy.get("ui5-geomap-container-control").then(($el) => {
				const el = $el[0] as GeomapContainerControl;

				// Assert
				expect(el.content).to.be.an("array");
				expect(el.content).to.have.length(0);
			});
		});

		it("tests _instance property", () => {
			// Arrange
			mountContainer('<div>Test</div>');

			cy.get("ui5-geomap-container-control").then(($el) => {
				const el = $el[0] as GeomapContainerControl;

				// Assert
				expect(el._instance).to.not.be.undefined;
			});
		});

		it("tests _individualSlot property", () => {
			// Arrange
			mountContainer('<div>Test</div>');

			cy.get("ui5-geomap-container-control").then(($el) => {
				const el = $el[0] as GeomapContainerControl;

				// Assert
				if (el._individualSlot) {
					expect(el._instance).to.not.be.undefined;
					expect(el._instance!._slot.name).to.equal(el._individualSlot);
				}
			});
		});

		it("tests mixed content types rendering", () => {
			// Arrange
			mountContainer(`
				<div class="card" style="padding: 0.5rem;">
					<h4 class="title">Report</h4>
					<img class="icon" src="https://i.pravatar.cc/24?u=mix" alt="icon" />
					<ui5-input id="mixInput" placeholder="Enter..."></ui5-input>
					<ui5-button id="mixBtn">Submit</ui5-button>
				</div>
			`);

			// Assert
			cy.get("ui5-geomap-container-control .title").should("contain.text", "Report");
			cy.get("ui5-geomap-container-control .icon").should("have.attr", "alt", "icon");
			cy.get("ui5-geomap-container-control #mixInput").should("exist");
			cy.get("ui5-geomap-container-control #mixBtn").should("contain.text", "Submit");
		});

		it("tests text-only content", () => {
			// Arrange
			mountContainer("Plain text content");

			// Assert
			cy.get("ui5-geomap-container-control")
				.should("contain.text", "Plain text content");
		});

		it("tests deeply nested content", () => {
			// Arrange
			mountContainer(`
				<div class="l1">
					<div class="l2">
						<div class="l3">
							<span class="deep">Deep content</span>
						</div>
					</div>
				</div>
			`);

			// Assert
			cy.get("ui5-geomap-container-control .deep")
				.should("contain.text", "Deep content");
		});

		it("tests inline styles content", () => {
			// Arrange
			mountContainer(`
				<div
					class="styled-box"
					style="width: 100px; height: 100px; background: blue; border-radius: 50%;"
				></div>
			`);

			// Assert
			cy.get("ui5-geomap-container-control .styled-box")
				.should("have.css", "width", "100px")
				.and("have.css", "height", "100px")
				.and("have.css", "border-radius", "50%");
		});
	});

	describe("test methods", () => {
		it("tests content update on child add", () => {
			// Arrange
			mountContainer('<div class="initial">Initial</div>');

			cy.get("ui5-geomap-container-control").then(($el) => {
				const el = $el[0] as GeomapContainerControl;
				expect(el.content).to.have.length(1);

				// Act
				const newChild = document.createElement("div");
				newChild.className = "added";
				newChild.textContent = "Added";
				el.appendChild(newChild);
			});

			// Assert
			cy.get("ui5-geomap-container-control").should(($el) => {
				const el = $el[0] as GeomapContainerControl;
				expect(el.content).to.have.length(2);
			});
		});

		it("tests content update on child remove", () => {
			// Arrange
			mountContainer(`
				<div class="first">First</div>
				<div class="second">Second</div>
			`);

			cy.get("ui5-geomap-container-control").then(($el) => {
				const el = $el[0] as GeomapContainerControl;
				expect(el.content).to.have.length(2);

				// Act
				const first = el.querySelector(".first");
				first?.remove();
			});

			// Assert
			cy.get("ui5-geomap-container-control").should(($el) => {
				const el = $el[0] as GeomapContainerControl;
				expect(el.content).to.have.length(1);
			});
		});

		it("tests slot invalidation on content change", () => {
			// Arrange
			mountContainer('<div class="original">Original</div>');

			cy.get("ui5-geomap-container-control .original")
				.should("contain.text", "Original");

			// Act
			cy.get("ui5-geomap-container-control").then(($el) => {
				const el = $el[0] as GeomapContainerControl;
				el.innerHTML = '<div class="replaced">Replaced</div>';
			});

			// Assert
			cy.get("ui5-geomap-container-control .replaced")
				.should("exist")
				.and("contain.text", "Replaced");

			cy.get("ui5-geomap-container-control .original")
				.should("not.exist");
		});

		it("tests content replacement in content property", () => {
			// Arrange
			mountContainer('<div>Old</div>');

			cy.get("ui5-geomap-container-control").then(($el) => {
				const el = $el[0] as GeomapContainerControl;
				expect(el.content).to.have.length(1);

				// Act
				el.innerHTML = "<span>New A</span><span>New B</span>";
			});

			// Assert
			cy.get("ui5-geomap-container-control").should(($el) => {
				const el = $el[0] as GeomapContainerControl;
				expect(el.content).to.have.length(2);
			});
		});
	});

	describe("test events", () => {
		it("tests click event propagation", () => {
			// Arrange
			mountContainer('<button id="innerBtn">Click me</button>');

			const clickSpy = cy.spy().as("clickSpy");

			cy.get("#innerBtn").then(($btn) => {
				$btn[0].addEventListener("click", clickSpy);
			});

			// Act
			cy.get("#innerBtn").click({ force: true });

			// Assert
			cy.get("@clickSpy").should("have.been.calledOnce");
		});

		it("tests input event in slotted form elements", () => {
			// Arrange
			mountContainer('<input id="innerInput" type="text" placeholder="Type here" />');

			// Act & Assert
			cy.get("#innerInput")
				.type("Hello", { force: true })
				.should("have.value", "Hello");
		});

		it("tests UI5 button click event", () => {
			// Arrange
			mountContainer('<ui5-button id="ui5Btn" design="Emphasized">Submit</ui5-button>');

			const clickSpy = cy.spy().as("ui5ClickSpy");

			cy.get("#ui5Btn").then(($btn) => {
				$btn[0].addEventListener("click", clickSpy);
			});

			// Act
			cy.get("#ui5Btn").click({ force: true });

			// Assert
			cy.get("@ui5ClickSpy").should("have.been.calledOnce");
		});
	});
});