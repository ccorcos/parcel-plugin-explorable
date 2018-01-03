const { Asset } = require("parcel-bundler")
const HTMLAsset = require("parcel-bundler/src/assets/HTMLAsset")
const parse = require("posthtml-parser")
const api = require("posthtml/lib/api")
const render = require("posthtml-render")
const MarkdownItComponent = require("markdown-it-component")
const MarkdownParser = require("markdown-it-renderer/MarkdownParser").default

module.exports = class MarkdownAsset extends HTMLAsset {
	constructor(name, pkg, options) {
		super(name, pkg, options)
		this.type = "js"
		this.md = new MarkdownParser({}, [MarkdownItComponent({ jsonData: true })])
	}

	parse(code) {
		// Patch HTML asset so we can use XMLMode.
		// https://github.com/parcel-bundler/parcel/blob/master/src/assets/HTMLAsset.js
		const html = this.md.markdownToHtml(code)
		const res = parse({
			lowerCaseTags: false,
			lowerCaseAttributeNames: false,
			xmlMode: true,
		})(html)
		res.walk = api.walk
		res.match = api.match
		return res
	}

	generate() {
		const html = render(fixAst(this.ast))
		const ast = this.md.htmlToAst(html)
		return {
			js: `module.exports=${JSON.stringify(ast, undefined, 2)}`,
		}
	}
}

function fixAst(ast) {
	if (ast && Array.isArray(ast)) {
		for (const child of ast) {
			fixAst(child)
		}
	} else if (ast) {
		const item = ast
		if (item && item.attrs) {
			if (item.attrs["json-data"]) {
				item.attrs["json-data"] = item.attrs["json-data"].replace(
					/"/g,
					"&quot;"
				)
			}
		}
		if (item && item.content && Array.isArray(item.content)) {
			for (const child of item.content) {
				fixAst(child)
			}
		}
	}
	return ast
}
