# Parcel plugin for explorable explanations

Render react components inside markdown.

## Usage

```
yarn add --dev parcel-plugin-explorable
```

```javascript
import ReactRenderer from "markdown-it-renderer/ReactRenderer"
import ast from './mardown.md';

const renderer = new ReactRenderer({
	tag: (name, props, children) => {
		if (name === "Counter") {
			return <Counter {...props} />
		}
	},
})
const rendered = renderer.renderAst(ast)

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.render(<div>{rendered}</div>, root)

```