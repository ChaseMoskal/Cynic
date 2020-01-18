
import {Tests, suite} from "./cynic.js"

const tests: Tests = {
	"environment test": true,
	"cryptography": {
		"simple hash works": async() => {
			throw new Error("major error!")
		},
		"deliberately fails": async() => {
			try {
				throw new Error("major error!")
				return false
			}
			catch (error) {
				return true
			}
		},
		"digital signatures": {
			"can be signed and verified": true,
			"can detect tampered data": false,
			"can detect tampered keys": true,
		},
		"encrypt/decrypt": true,
	},
	"json rpc": {
		"renraku works from node": true,
		"renraku works in browser": true,
	},
}

;(async() => {
	console.log(await suite("My example test suite", tests))
})()
