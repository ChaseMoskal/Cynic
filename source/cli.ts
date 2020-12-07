#!/usr/bin/env node

import openUrl from "open"
import commander from "commander"
import {fileURLToPath} from "url"
import {relative, join, dirname} from "path"

import {runNode} from "./internals/runners/run-node.js"
import {cynicTestFileName} from "./internals/constants.js"
import {runServer} from "./internals/runners/run-server.js"
import {dieOnError} from "./internals/toolbox/die-on-error.js"
import {parseBoolean} from "./internals/toolbox/parse-boolean.js"

dieOnError()

commander
	.arguments("<environment> <suitePath>")
	.option("-l, --label <string>", "name of the test suite", "test suite")
	.option("-o, --open <boolean>", "open the browser automatically", "false")
	.option("-p, --port <number>", "port to run puppeteer", "8021")
	.option("-O, --origin <string>", "url origin to test suite page", "http://localhost:8021")
	.option("-c, --cynic-path <string>", "path to cynic library root", "node_modules/cynic")
	.option("-i, --importmap-path <string>", "path to your own import map", undefined)
	.parse(process.argv)

;(async() => {
	let {
		port,
		open,
		label,
		origin,
		cynicPath,
		importmapPath,
	} = commander
	let [environment, suitePath] = commander.args

	if (!environment)
		throw new Error(`1st argument 'environment' required`)

	if (!suitePath)
		throw new Error(`2nd argument 'suitePath' required`)

	port = parseInt(port)
	open = parseBoolean(open)
	environment = environment.toLowerCase()

	if (environment === "node") {
		const importCwd = dirname(fileURLToPath(import.meta.url))
		const absoluteSuite = join(process.cwd(), suitePath)
		const importPath = "./" + relative(
			importCwd,
			absoluteSuite
		)
		const {default: suite} = await import(importPath)
		await runNode(label, suite)
	}
	else if (environment === "browser") {
		runServer({
			port,
			label,
			suitePath,
			cynicPath,
			importmapPath,
		})
		const url = `${origin}/${cynicTestFileName}`
		console.log(`\n Test server running, see ${url}\n`)
		if (open) openUrl(url)
	}
	else if (environment === "puppeteer") {
		const {runPuppeteer} = await import("./internals/runners/run-puppeteer.js")
		await runPuppeteer({
			port,
			label,
			origin,
			suitePath,
			cynicPath,
			importmapPath,
			launchOptions: open
				? {headless: false, devtools: true}
				: {headless: true, devtools: false},
		})
	}
	else throw new Error(`environment must be 'node', 'browser', or 'puppeteer'`)
})()
