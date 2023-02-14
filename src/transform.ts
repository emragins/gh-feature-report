import {Report, Rollup, RollupItem, RollupSummary, Status} from './types'

export async function transform(
  specInput: Report,
  rollupLevel: number
): Promise<Rollup> {
  return new Promise(resolve => {
    if (specInput == null) {
      throw new Error('specInput is null')
    }

    const [rollupItems, rollupSummary] = performRollup(specInput, rollupLevel)

    const rollup: Rollup = {
      target: specInput.target,
      build: specInput.build,
      correlationId: specInput.correlationId,
      datetime: specInput.datetime,
      total: rollupSummary.total,
      totalPassed: rollupSummary.totalPassed,
      totalFailed: rollupSummary.totalFailed,
      totalIgnored: rollupSummary.totalIgnored,
      rollup: rollupItems
    }

    resolve(rollup)
  })
}

function performRollup(
  specInput: Report,
  rollupLevel: number
): [RollupItem[], RollupSummary] {
  return specInput.specs.reduce(
    (acc: [RollupItem[], RollupSummary], spec) => {
      const id = splitIdByDepth(spec.id, rollupLevel)

      // handle summary-level rollup
      acc[1].total++
      if (spec.status === Status.Passed) {
        acc[1].totalPassed++
      } else if (spec.status === Status.Failed) {
        acc[1].totalFailed++
      } else if (spec.status === Status.Ignored) {
        acc[1].totalIgnored++
      }

      // handle item-level rollup
      const item = acc[0].find(x => x.id === id)
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
        acc[0].push(newItem)
      }
      return acc
    },
    [[], {total: 0, totalPassed: 0, totalFailed: 0, totalIgnored: 0}]
  )
}

export function splitIdByDepth(id: string, depth: number): string {
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
