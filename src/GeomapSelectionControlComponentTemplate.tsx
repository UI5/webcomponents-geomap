import Button from "@ui5/webcomponents/dist/Button.js";
import type GeomapSelectionControlComponent from "./GeomapSelectionControlComponent.js";
import type GeomapSelectionMode from "./types/GeomapSelectionMode.js";

type SelectionModeDescriptor = {
	icon: string;
	label: string;
	id?: string;
};

const MODE_DESCRIPTORS: Record<`${GeomapSelectionMode}`, SelectionModeDescriptor> = {
	freehand: { icon: "edit", label: "Freehand drawing tool" },
	polygon: { icon: "cancel-share", label: "Polygon drawing tool" },
	rectangle: { icon: "draw-rectangle", label: "Rectangle drawing tool" },
	circle: { icon: "circle-task", label: "Circle drawing tool" },
	select: { icon: "cursor-arrow", label: "Selection tool", id: "selectionMode-select" },
};

export default function GeomapSelectionControlComponentTemplate(this: GeomapSelectionControlComponent) {
	return <>
		<div class="ui5-geomap-selection-control-component">
			{this.effectiveModes.map(mode => {
				const descriptor = MODE_DESCRIPTORS[mode];
				return <Button
					id={descriptor.id}
					icon={descriptor.icon}
					data-ui5-mode={mode}
					accessible-name={descriptor.label}
					tooltip={descriptor.label}
					onClick={this.setSelectionMode}
				></Button>;
			})}

			<Button id="selectionBtn" icon="delete" accessible-name="Delete" tooltip="Delete" onClick={this.endDraw}></Button>
		</div>
	</>;
}
