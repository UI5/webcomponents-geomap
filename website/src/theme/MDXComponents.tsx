import MDXComponents from "@theme-original/MDXComponents";
import MDXTable from "./Table";
import BrowserOnly from '@docusaurus/BrowserOnly';

const BrowserOnlyEditor = (props) => {
	return (
	  <BrowserOnly>
		{() => {
			const Editor = require("@site/src/components/Editor").default;
			return <Editor {...props} />
		}}
	  </BrowserOnly>
	);
  };

export default {
	...MDXComponents,
	Editor: BrowserOnlyEditor,
	table: MDXTable,
};
