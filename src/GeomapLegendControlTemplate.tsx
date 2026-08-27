import Panel from "@ui5/webcomponents/dist/Panel.js";
import Title from "@ui5/webcomponents/dist/Title.js";
import Icon from "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";

import type { LegendItem } from "./GeomapLegendControl.ts";
import type GeomapLegendControl from "./GeomapLegendControl.ts";

export default function GeomapLegendControlTemplate(this: GeomapLegendControl) {
	return (
		<div
			class={{
				"legend-control": true,
				"legend-control--hidden": this.hidden,
			}}
		>
			<Panel
				collapsed={!this.expanded}
				onToggle={() => { this.toggle(); }}
			>
				<Title slot="header" level="H5" class="legend-header-title">{this.headerTitle}</Title>
				{this.hasItems
					? (
						<div class="legend-list">
							{this.items.map((item: LegendItem) => (
								<div key={item.id} class="legend-item" onClick={() => { this.onItemClick(item); }}>
									{item.icon
										? <Icon
											name={item.icon}
											class="legend-icon"
											style={{ color: item.color }}
										/>
										: <span
											class="legend-color-swatch"
											style={{ backgroundColor: item.color }}
										></span>
									}
									<span class="legend-label">{item.label}</span>
								</div>
							))}
						</div>
					)
					: (
						<div class="legend-empty">No legend items</div>
					)}
			</Panel>
		</div>
	);
}
