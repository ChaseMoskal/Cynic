
# 🧐 cynic

*dead-simple async run-anywhere js testing framework*

- tests are just async functions, return booleans to pass or fail
- run in node, browser, puppeteer, or elsewhere
- no goofy assertion library: just return results or throw errors

## get cynical and make a test suite

1. install cynic into your project

    ```sh
    npm install --save-dev cynic
    ```

2. define a test suite, like `cool.test.ts`

    ```js
    import {Suite} from "cynic"
    export default <Suite>{
      "alpha system": {
        "can sum two numbers": async() => {
          const a = 1
          const b = 2
          return (a + b) === 3
        },
        "can sum three numbers": async() => {
          const a = 1
          const b = 2
          const c = 3
          return (a + b + c) === 6
        }
      },
      "bravo system": {
        "can subtract numbers": async() => {
          const a = 3
          const b = 1
          return (a - b) === 2
        },
        "can multiply numbers": async() => {
          const a = 2
          const b = 3
          return (a * b) === 6
        },
      }
    }
    ```

## execute your cynical test suite anywhere

- node

    ```js
    import suite from "./cool.test.js"
    import {runNode} from "cynic/dist/run-node.js"
    runNode("my example test suite (node)", suite)
    ```

- browser

    ```js
    import suite from "./cool.test.js"
    import {runBrowser} from "cynic/dist/run-browser.js"
    runBrowser("my example test suite (browser)", suite)
    ```

- puppeteer

    ```js
    import {runPuppeteer} from "cynic/dist/run-puppeteer.js"
    runPuppeteer({
      port: 8021,
      url: `http://localhost:8021/`
    })
    ```

- anywhere that you can execute es modules or commonjs

    ```js
    import {test} from "cynic"
    import suite from "./cool.test.js"
    ;(async() => {

      // run the test suite
      const {report, ...stats} = await test(label, suite)

      // emit the report text to console
      console.log(report)

      // programmatically handle test suite success
      if (stats.failed === 0) {
        console.log(`success! all ${stats.total} tests passed!`)
      }

      // handle test suite failure
      else {
        console.log(`failed! ${stats.failed} of ${stats.total} tests failed`)
      }
    })()
    ```

    see which stats are available in the `Stats` interface in [interfaces.ts](./source/interfaces.ts)

## so what do the console reports look like?

- report of successful run (all tests returned true)

    ```
    my example test suite
    
      ▽ alpha system
        ✓ can sum two numbers
        ✓ can sum three numbers
      ▽ bravo system
        ✓ can subtract numbers
        ✓ can multiply numbers
    
    0 failed tests
    0 thrown errors
    4 passed tests
    4 total tests
    0.00 seconds
    ```

- report where one test had failed (returned false)

    ```
    example suite
    
      ▽ alpha system
        ✓ can sum two numbers
    
    ═══ ✘ can sum three numbers
    
      ▽ bravo system
        ✓ can subtract numbers
        ✓ can multiply numbers
    
    1 failed tests
    0 thrown errors
    3 passed tests
    4 total tests
    0.00 seconds
    ```

- report where one test failed by throwing an error

    ```
    example suite
    
      ▽ alpha system
        ✓ can sum two numbers
    
    ═══ ✘ can sum three numbers
    ――――― Error: unable to process numbers
    
      ▽ bravo system
        ✓ can subtract numbers
        ✓ can multiply numbers
    
    1 failed tests
    1 thrown errors
    3 passed tests
    4 total tests
    0.00 seconds
    ```
