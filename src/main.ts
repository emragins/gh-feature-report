import * as core from '@actions/core'
import {transform} from './transform'
import * as fs from 'fs/promises'

const DefaultDepth = 1

async function run(): Promise<void> {
  console.log('test')
  try {
    const input = core.getInput('inputFile', {required: true})
    core.debug(`Reading input from ${input}`)
    const file = await fs.readFile(input)
    const json = JSON.parse(file.toString())
    if (!json) throw new Error(`Invalid JSON input: ${input}`)

    const depth = parseInt(core.getInput('depth'), 10) || DefaultDepth
    const dataRollup = await transform(json, depth)

    const formatted = JSON.stringify(dataRollup, null, 2)

    // write file
    const output = core.getInput('outputFile', {required: true})
    core.debug(`Writing output to ${output}`)
    fs.writeFile(output, formatted)

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
