import { PulseAnimationUtil } from "../../src/utils/PulseAnimationUtil.js";

describe("PulseAnimationUtil", () => {
	let mockMap: any;
	let mockCanvas: HTMLCanvasElement;
	let mockContext: CanvasRenderingContext2D;

	beforeEach(() => {
		// Create mock canvas and context
		mockCanvas = document.createElement('canvas');
		mockContext = mockCanvas.getContext('2d')!;

		// Spy on canvas context methods
		cy.spy(mockContext, 'clearRect');
		cy.spy(mockContext, 'beginPath');
		cy.spy(mockContext, 'arc');
		cy.spy(mockContext, 'fill');
		cy.spy(mockContext, 'stroke');
		cy.spy(mockContext, 'getImageData');

		// Mock document.createElement to return our mock canvas
		cy.stub(document, 'createElement').withArgs('canvas').returns(mockCanvas);

		// Create comprehensive mock map
		mockMap = {
			addImage: cy.stub(),
			addSource: cy.stub(),
			addLayer: cy.stub(),
			triggerRepaint: cy.stub(),
			getLayer: cy.stub().returns(null),
			getSource: cy.stub().returns(null),
			hasImage: cy.stub().returns(false),
			removeLayer: cy.stub(),
			removeSource: cy.stub(),
			removeImage: cy.stub(),
			getContainer: cy.stub().returns(document.createElement('div')),
			getCanvas: cy.stub().returns(mockCanvas)
		};
	});

	afterEach(() => {
		// Restore stubs
		if (document.createElement.restore) {
			document.createElement.restore();
		}
	});

	describe("triggerPulseAnimation", () => {
		it("should create animation resources with default parameters", () => {
			// Act
			const cleanup = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51
			});

			// Assert
			expect(mockMap.addImage).to.have.been.called;
			expect(mockMap.addSource).to.have.been.called;
			expect(mockMap.addLayer).to.have.been.called;

			// Verify the source is created with correct GeoJSON data
			const sourceCall = mockMap.addSource.getCall(0);
			expect(sourceCall.args[1].type).to.equal('geojson');
			expect(sourceCall.args[1].data.geometry.coordinates).to.deep.equal([11, 51]);

			// Verify the layer is created with correct properties
			const layerCall = mockMap.addLayer.getCall(0);
			expect(layerCall.args[0].type).to.equal('symbol');
			expect(layerCall.args[0].layout['icon-allow-overlap']).to.be.true;
			expect(layerCall.args[0].layout['icon-ignore-placement']).to.be.true;

			// Verify cleanup function is returned
			expect(cleanup).to.be.a('function');
		});

		it("should create animation resources with custom parameters", () => {
			// Act
			const cleanup = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 10,
				lat: 50,
				size: 300,
				speed: 2000,
				direction: 0
			});

			// Assert
			expect(mockMap.addImage).to.have.been.called;
			expect(mockMap.addSource).to.have.been.called;
			expect(mockMap.addLayer).to.have.been.called;

			// Verify canvas size matches custom size
			expect(mockCanvas.width).to.equal(300);
			expect(mockCanvas.height).to.equal(300);

			// Verify cleanup function is returned
			expect(cleanup).to.be.a('function');
		});

		it("should handle missing map gracefully", () => {
			// Act
			const cleanup = PulseAnimationUtil.triggerPulseAnimation(null, {
				lng: 11,
				lat: 51
			});

			// Assert
			expect(cleanup).to.be.a('function');
			expect(mockMap.addImage).to.not.have.been.called;
			expect(mockMap.addSource).to.not.have.been.called;
			expect(mockMap.addLayer).to.not.have.been.called;
		});

		it("should handle missing coordinates gracefully", () => {
			// Act - missing lng
			let cleanup = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 0,
				lat: 51
			});

			// Assert
			expect(cleanup).to.be.a('function');
			expect(mockMap.addImage).to.not.have.been.called;

			// Reset mocks
			mockMap.addImage.resetHistory();

			// Act - missing lat
			cleanup = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 0
			});

			// Assert
			expect(cleanup).to.be.a('function');
			expect(mockMap.addImage).to.not.have.been.called;
		});

		it("should handle map errors gracefully", () => {
			// Arrange
			mockMap.addImage.throws(new Error("Map error"));

			// Act
			const cleanup = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51
			});

			// Assert
			expect(cleanup).to.be.a('function');
			expect(mockMap.addImage).to.have.been.called;
		});

		it("should validate render function behavior with direction 1 (outside-in)", () => {
			// Arrange
			let capturedPulsingDot: any;
			mockMap.addImage.callsFake((id: string, pulsingDot: any) => {
				capturedPulsingDot = pulsingDot;
			});

			// Mock performance.now to control timing
			const mockPerformanceNow = cy.stub(performance, 'now');
			mockPerformanceNow.returns(0); // Start time

			// Act
			PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51,
				direction: 1
			});

			// Assert - verify pulsingDot object structure
			expect(capturedPulsingDot).to.exist;
			expect(capturedPulsingDot.width).to.equal(200);
			expect(capturedPulsingDot.height).to.equal(200);
			expect(capturedPulsingDot.data).to.be.instanceOf(Uint8Array);
			expect(capturedPulsingDot.render).to.be.a('function');

			// Test render method during animation phase (within 5 seconds)
			mockPerformanceNow.returns(1000); // 1 second elapsed
			const renderResult = capturedPulsingDot.render();
			expect(renderResult).to.be.true;
			expect(mockMap.triggerRepaint).to.have.been.called;

			// Verify canvas drawing operations
			expect(mockContext.clearRect).to.have.been.called;
			expect(mockContext.beginPath).to.have.been.called;
			expect(mockContext.arc).to.have.been.called;
			expect(mockContext.stroke).to.have.been.called;

			// Test render method after animation ends (after 5 seconds)
			mockPerformanceNow.returns(6000); // 6 seconds elapsed
			const renderResultAfterEnd = capturedPulsingDot.render();
			expect(renderResultAfterEnd).to.be.false;

			// Restore stub
			mockPerformanceNow.restore();
		});

		it("should validate render function behavior with direction 0 (inside-out)", () => {
			// Arrange
			let capturedPulsingDot: any;
			mockMap.addImage.callsFake((id: string, pulsingDot: any) => {
				capturedPulsingDot = pulsingDot;
			});

			// Mock performance.now to control timing
			const mockPerformanceNow = cy.stub(performance, 'now');
			mockPerformanceNow.returns(0); // Start time

			// Act
			PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51,
				direction: 0
			});

			// Assert - verify pulsingDot object structure
			expect(capturedPulsingDot).to.exist;
			expect(capturedPulsingDot.render).to.be.a('function');

			// Test render method during animation phase
			mockPerformanceNow.returns(1000); // 1 second elapsed
			const renderResult = capturedPulsingDot.render();
			expect(renderResult).to.be.true;
			expect(mockMap.triggerRepaint).to.have.been.called;

			// Verify canvas drawing operations
			expect(mockContext.clearRect).to.have.been.called;
			expect(mockContext.beginPath).to.have.been.called;
			expect(mockContext.arc).to.have.been.called;
			expect(mockContext.stroke).to.have.been.called;

			// Restore stub
			mockPerformanceNow.restore();
		});

		it("should provide working cleanup function", () => {
			// Arrange
			mockMap.getLayer.returns({ id: "test-layer" });
			mockMap.getSource.returns({ type: "geojson" });
			mockMap.hasImage.returns(true);

			// Act
			const cleanup = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51
			});

			// Manually call cleanup
			cleanup();

			// Assert - cleanup methods should be called
			// Note: We can't easily test the exact IDs since they're generated with timestamps,
			// but we can verify the cleanup function doesn't throw errors
			expect(cleanup).to.not.throw();
		});

		it("should handle cleanup with missing resources gracefully", () => {
			// Arrange
			mockMap.getLayer.returns(null);
			mockMap.getSource.returns(null);
			mockMap.hasImage.returns(false);

			// Act
			const cleanup = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51
			});

			// Manually call cleanup
			cleanup();

			// Assert - should not throw errors
			expect(cleanup).to.not.throw();
		});

		it("should handle cleanup errors gracefully", () => {
			// Arrange
			mockMap.getLayer.returns({ id: "test-layer" });
			mockMap.getSource.returns({ type: "geojson" });
			mockMap.hasImage.returns(true);
			mockMap.removeLayer.throws(new Error("Remove layer error"));
			mockMap.removeSource.throws(new Error("Remove source error"));
			mockMap.removeImage.throws(new Error("Remove image error"));

			// Act
			const cleanup = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51
			});

			// Manually call cleanup - should not throw errors
			expect(() => cleanup()).to.not.throw();
		});

		it("should handle cleanup with missing map gracefully", () => {
			// Act
			const cleanup = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51
			});

			// Simulate map being destroyed
			mockMap = null;

			// Manually call cleanup - should not throw errors
			expect(() => cleanup()).to.not.throw();
		});
	});

	describe("animation timing and lifecycle", () => {
		it("should automatically cleanup after animation duration", (done) => {
			// Arrange
			const mockPerformanceNow = cy.stub(performance, 'now');
			mockPerformanceNow.returns(0);

			let capturedPulsingDot: any;
			mockMap.addImage.callsFake((id: string, pulsingDot: any) => {
				capturedPulsingDot = pulsingDot;
			});

			// Act
			PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51
			});

			// Simulate animation end
			mockPerformanceNow.returns(6000); // 6 seconds elapsed (past 5 second duration)

			// Call render to trigger cleanup
			const renderResult = capturedPulsingDot.render();

			// Assert
			expect(renderResult).to.be.false;

			// Restore stub
			mockPerformanceNow.restore();
			done();
		});

		it("should handle multiple concurrent animations", () => {
			// Act - create multiple animations
			const cleanup1 = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 10,
				lat: 50
			});

			const cleanup2 = PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 20,
				lat: 60
			});

			// Assert
			expect(mockMap.addImage.callCount).to.equal(2);
			expect(mockMap.addSource.callCount).to.equal(2);
			expect(mockMap.addLayer.callCount).to.equal(2);

			// Verify both cleanup functions work
			expect(cleanup1).to.be.a('function');
			expect(cleanup2).to.be.a('function');
			expect(() => cleanup1()).to.not.throw();
			expect(() => cleanup2()).to.not.throw();
		});
	});

	describe("canvas rendering", () => {
		it("should create canvas with correct dimensions", () => {
			// Act
			PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51,
				size: 150
			});

			// Assert
			expect(mockCanvas.width).to.equal(150);
			expect(mockCanvas.height).to.equal(150);
		});

		it("should call canvas drawing methods during render", () => {
			// Arrange
			let capturedPulsingDot: any;
			mockMap.addImage.callsFake((id: string, pulsingDot: any) => {
				capturedPulsingDot = pulsingDot;
			});

			const mockPerformanceNow = cy.stub(performance, 'now');
			mockPerformanceNow.returns(0);

			// Act
			PulseAnimationUtil.triggerPulseAnimation(mockMap, {
				lng: 11,
				lat: 51
			});

			mockPerformanceNow.returns(1000);
			capturedPulsingDot.render();

			// Assert
			expect(mockContext.clearRect).to.have.been.calledWith(0, 0, 200, 200);
			expect(mockContext.beginPath).to.have.been.called;
			expect(mockContext.arc).to.have.been.called;
			expect(mockContext.fill).to.have.been.called;
			expect(mockContext.stroke).to.have.been.called;
			expect(mockContext.getImageData).to.have.been.calledWith(0, 0, 200, 200);

			// Restore stub
			mockPerformanceNow.restore();
		});
	});
});
