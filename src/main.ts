import * as core from '@actions/core'
import * as glob from '@actions/glob'
import {reduce} from './transform'
import * as fs from 'fs/promises'
import {Report, Rollup} from './types'

const DefaultDepth = 1

async function run(): Promise<void> {
  console.log('test')
  try {
    const inputPattern = core.getInput('inputFilePattern', {required: true})
    const depth = parseInt(core.getInput('depth'), 10) || DefaultDepth

    core.debug(`Reading input from ${inputPattern}`)

    const globber = await glob.create(inputPattern)

    const dataRollup = await injestFiles(globber.globGenerator(), depth)

    const formatted = JSON.stringify(dataRollup, null, 2)

    // write file
    const output = core.getInput('outputFile', {required: true})
    core.debug(`Writing output to ${output}`)
    fs.writeFile(output, formatted)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function injestFiles(
  filePaths: AsyncGenerator,
  depth: number
): Promise<Rollup> {
  let dataRollup: Rollup = null

  while (true) {
    const filePath = await filePaths.next()
    if (filePath.done) break

    const file = await fs.readFile(filePath.value)
    const json = JSON.parse(file.toString())
    validateReportSchema(json)

    dataRollup = reduce(json, depth, dataRollup)
  }

  return dataRollup;
}

function validateReportSchema(report: Report) {
  if (report == null) {
    throw new Error('Report is null')
  }
  if (report.specs == null) {
    throw new Error('Report specs are null')
  }
}

run()
