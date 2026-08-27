/**
 * Different types of features display.
 * @public
 */
enum GeomapDisplayedFeatures {
	/**
	* All features are displayed
	* @public
	*/
	All = "All",
	/**
	* Only not-clustered points are displayed
	* @public
	*/
	NotClustered = "NotClustered",
	/**
	* Only clustered points are displayed
	* @public
	*/
	Clustered = "Clustered",
}

export default GeomapDisplayedFeatures;
