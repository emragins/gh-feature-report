import {Report, Rollup, RollupItem, Status} from './__types__'

export async function transform(
  specInput: Report,
  rollupLevel: number
): Promise<Rollup> {
  return new Promise(resolve => {
    if (specInput == null) {
      throw new Error('specInput is null')
    }

    const rollup: Rollup = {
      target: specInput.target,
      build: specInput.build,
      correlationId: specInput.correlationId,
      datetime: specInput.datetime,
      total: specInput.total,
      totalPassed: specInput.totalPassed,
      totalFailed: specInput.totalFailed,
      totalIgnored: specInput.totalIgnored,
      rollup: performRollup(specInput, rollupLevel)
    }

    resolve(rollup)
  })
}

function performRollup(specInput: Report, rollupLevel: number): RollupItem[] {
  return specInput.specs.reduce((acc: RollupItem[], spec) => {
        const id = splitIdByDepth(spec.id, rollupLevel)
        const item = acc.find(x => x.id === id)
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
                id: id,
                numTotal: 1,
                numPass: spec.status === Status.Passed ? 1 : 0,
                numFail: spec.status === Status.Failed ? 1 : 0,
                failures: spec.status === Status.Failed ? [spec.id] : []
            }
            acc.push(newItem)
        }
        return acc
    }, [])
}

export function splitIdByDepth(id: string, depth: number) {
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
