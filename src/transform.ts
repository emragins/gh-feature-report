import {Report, Rollup, RollupItem, RollupSummary, Status} from './types'

export function reduce(
  specInput: Report,
  depth: number,
  results: Rollup = null
): Rollup {
  if(specInput == null) return results;
  if(specInput.specs == null) return results;

  if (results == null) {
    results = {
      target: specInput.target,
      build: specInput.build,
      correlationId: specInput.correlationId,
      datetime: specInput.datetime,
      total: 0,
      totalPassed: 0,
      totalFailed: 0,
      totalIgnored: 0,
      rollup: []
    }
  }

  return specInput.specs.reduce((acc: Rollup, spec) => {
    const id = getDepthAppropriateSpecId(spec.id, depth)

    // handle summary-level rollup
    acc.total++
    if (spec.status === Status.Passed) {
      acc.totalPassed++
    } else if (spec.status === Status.Failed) {
      acc.totalFailed++
    } else if (spec.status === Status.Ignored) {
      acc.totalIgnored++
    }

    // handle item-level rollup
    const item = acc.rollup.find(x => x.id === id)
    if (item) {
      item.numTotal++
      if (spec.status === Status.Passed) {
        item.numPass++
      } else if (spec.status === Status.Failed) {
        item.numFail++
        item.failures.push(spec.id)
      }
    } else {
      const newItem = {
        id,
        numTotal: 1,
        numPass: spec.status === Status.Passed ? 1 : 0,
        numFail: spec.status === Status.Failed ? 1 : 0,
        failures: spec.status === Status.Failed ? [spec.id] : []
      }
      acc.rollup.push(newItem)
    }
    return acc
  }, results)
}

export function getDepthAppropriateSpecId(id: string, depth: number): string {
  if (depth === 0) {
    return ''
  } else {
    const parts = id.split('.')
    if (parts.length < depth) {
      return id
    } else {
      return parts.slice(0, depth).join('.')
    }
  }
}
