// import * as process from 'process'
// import * as cp from 'child_process'
// import * as path from 'path'
// import {expect, test} from '@jest/globals'


// // this is having issues with the cp.execFileSync call, and it doesn't give errors
// // shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', async () => {
//   process.env['INPUT_INPUTFILE'] = 'sample_input.json'
//   process.env['INPUT_DEPTH'] = '1'
//   process.env['INPUT_OUTPUTFILE'] = 'output.json'
//   const nodeProcessPath = process.execPath
//   const ip = path.join(__dirname, '..', 'dist', 'main.js')

//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(nodeProcessPath, [ip], options).toString())
// })
