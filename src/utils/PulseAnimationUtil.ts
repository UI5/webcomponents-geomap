import type { Pulse } from "../types/utils.js";
import { getSelectionStyles } from "../config/Config.js";
import hexToRgb from "./hexToRgb.js";

export interface PulseAnimationOptions {
	lng: number;
	lat: number;
	size?: number;
	speed?: number;
	direction?: 0 | 1;
}

interface CircleConfig {
	radius: number;
	opacity: number;
}

export class PulseAnimationUtil {
	/**
	 * Triggers a pulsing circle animation on the map for 5 seconds.
	 * The animation shows a circle with border that expands and fades out.
	 *
	 * @param map The map instance
	 * @param options Animation options
	 * @returns Cleanup function to manually stop the animation
	 */
	static triggerPulseAnimation(map: any, options: PulseAnimationOptions): () => void {
		const {
			lng,
			lat,
			size = 200,
			speed = 1500,
			direction = 1,
		} = options;

		if (!map) {
			return () => {};
		}

		if (!lng || !lat) {
			return () => {};
		}

		const oStyles = getSelectionStyles();
		const color = hexToRgb(`${oStyles.bounceColor}`);

		const animationId = `pulse-animation-${Date.now()}`;
		const sourceId = `${animationId}-source`;
		const layerId = `${animationId}-layer`;
		const imageId = `${animationId}-image`;

		const animationDuration = 5000; // 5 seconds
		const pulseDuration = speed; // Each pulse cycle duration
		const startTime = performance.now();

		// Create a canvas for drawing the animation
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		const context = canvas.getContext("2d")!;

		// Implementation of StyleImageInterface for MapLibre
		const pulsingDot = {
			width: size,
			height: size,
			data: new Uint8Array(size * size * 4),

			// Called once before every frame where the icon will be used
			render: () => {
				const elapsed = performance.now() - startTime;

				// Stop animation after 5 seconds
				if (elapsed >= animationDuration) {
					PulseAnimationUtil._cleanupPulseAnimation(map, sourceId, layerId, imageId);
					return false;
				}

				PulseAnimationUtil._renderPulse(context, size, elapsed, pulseDuration, direction, color);

				// Update image data
				const imageData = context.getImageData(0, 0, size, size);
				(pulsingDot as any).data = imageData.data;

				// Trigger map repaint for smooth animation
				map.triggerRepaint();

				return true;
			},
		};

		try {
			// Add the animated image to the map
			map.addImage(imageId, pulsingDot as Pulse, { pixelRatio: 2 });

			// Create a GeoJSON source with the spot's location
			map.addSource(sourceId, {
				type: "geojson",
				data: {
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [lng, lat],
					},
					properties: {},
				},
			});

			// Add a symbol layer to display the animation
			map.addLayer({
				id: layerId,
				type: "symbol",
				source: sourceId,
				layout: {
					"icon-image": imageId,
					"icon-allow-overlap": true,
					"icon-ignore-placement": true,
				},
			});

			// Cleanup after animation duration
			const timeoutId = setTimeout(() => {
				PulseAnimationUtil._cleanupPulseAnimation(map, sourceId, layerId, imageId);
			}, animationDuration + 100); // Small buffer to ensure cleanup

			// Return cleanup function for manual cleanup
			return () => {
				clearTimeout(timeoutId);
				PulseAnimationUtil._cleanupPulseAnimation(map, sourceId, layerId, imageId);
			};
		} catch (error) {
			PulseAnimationUtil._cleanupPulseAnimation(map, sourceId, layerId, imageId);
			return () => {};
		}
	}

	/**
	 * Calculates circle configurations based on direction and animation progress
	 * @private
	 */
	private static _getCircleConfigs(size: number, t: number, direction: 0 | 1): { outer: CircleConfig; inner: CircleConfig } {
		const maxRadius = (size / 2) * 0.8;
		const minRadius = (size / 2) * 0.2;

		if (direction === 1) {
			// Outside-in: start from large radius and shrink to small
			return {
				outer: {
					radius: maxRadius * (1 - t) + minRadius,
					opacity: 1 - t,
				},
				inner: {
					radius: minRadius,
					opacity: 0.5 + 0.4 * t,
				},
			};
		}
		// Inside-out: expand from small to large
		return {
			outer: {
				radius: maxRadius * t + minRadius,
				opacity: 1,
			},
			inner: {
				radius: minRadius,
				opacity: 0.9,
			},
		};
	}

	/**
	 * Draws a circle with the given configuration
	 * @private
	 */
	private static _drawCircle(
		context: CanvasRenderingContext2D,
		centerX: number,
		centerY: number,
		radius: number,
		color: { r: number; g: number; b: number } | null,
		opacity: number,
	) {
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, Math.PI * 2);
		context.fillStyle = "rgba(255,99,71,0)"; // Transparent fill
		context.fill();
		context.strokeStyle = `rgba(${color!.r}, ${color!.g}, ${color!.b}, ${opacity})`;
		context.lineWidth = 2;
		context.stroke();
	}

	/**
	 * Renders the pulse animation on the canvas
	 * @private
	 */
	private static _renderPulse(
		context: CanvasRenderingContext2D,
		size: number,
		elapsed: number,
		pulseDuration: number,
		direction: 0 | 1,
		color: { r: number; g: number; b: number } | null,
	) {
		const t = (elapsed % pulseDuration) / pulseDuration;
		const centerX = size / 2;
		const centerY = size / 2;

		// Clear canvas
		context.clearRect(0, 0, size, size);

		// Get circle configurations based on direction
		const { outer, inner } = PulseAnimationUtil._getCircleConfigs(size, t, direction);

		// Draw outer circle
		PulseAnimationUtil._drawCircle(context, centerX, centerY, outer.radius, color, outer.opacity);

		// Draw inner circle
		PulseAnimationUtil._drawCircle(context, centerX, centerY, inner.radius, color, inner.opacity);
	}

	/**
	 * Private method to clean up animation resources
	 * @private
	 */
	private static _cleanupPulseAnimation(map: any, sourceId: string, layerId: string, imageId: string) {
		if (!map) { return; }

		try {
			// Remove layer if it exists
			if (map.getLayer(layerId)) {
				map.removeLayer(layerId);
			}

			// Remove source if it exists
			if (map.getSource(sourceId)) {
				map.removeSource(sourceId);
			}

			// Remove image if it exists
			if (map.hasImage(imageId)) {
				map.removeImage(imageId);
			}
		} catch (error) {
			// "Error during pulse animation cleanup:", error
		}
	}
}
