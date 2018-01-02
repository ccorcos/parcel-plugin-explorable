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
		return super.parse(this.md.markdownToHtml(code))
	}

	generate() {
		const html = this.isAstDirty ? render(this.ast) : this.contents
		const ast = this.md.htmlToAst(html)
		return {
			js: `module.exports=${JSON.stringify(ast, undefined, 2)}`,
		}
	}
}
