import {transform, splitIdByDepth} from '../src/transform'
import {describe, it, expect, test} from '@jest/globals'
import {Report, Spec, Status} from '../src/__types__'

test('throws invalid file', async () => {})

var input: Report = {
  target: 'target_',
  build: 'build_',
  correlationId: 'correlationId_',
  datetime: 'datetime_',
  total: 1,
  totalPassed: 2,
  totalFailed: 3,
  totalIgnored: 4,
  specs: []
}

describe('flat spec', () => {
  input.specs.push(newSpec(1, 1, 1, Status.Passed))
  input.specs.push(newSpec(1, 1, 2, Status.Failed))
  input.specs.push(newSpec(1, 1, 3, Status.Passed))
  input.specs.push(newSpec(1, 2, 1, Status.Failed))
  input.specs.push(newSpec(1, 2, 2, Status.Passed))
  input.specs.push(newSpec(2, 1, 1, Status.Passed))
  input.specs.push(newSpec(2, 1, 2, Status.Passed))


  it('copies summary data', async () => {
    const expected = {
      target: 'target_',
      build: 'build_',
      correlationId: 'correlationId_',
      datetime: 'datetime_',
      total: 1,
      totalPassed: 2,
      totalFailed: 3,
      totalIgnored: 4
    }

    const actual = await transform(input, 1)

    expect(actual).toMatchObject(expected)
  })

  it('lists rollup', async () => {
    const actual = await transform(input, 1)

    expect(actual.rollup).toContainEqual({
      id: '1',
      numTotal: 5,
      numPass: 3,
      numFail: 2,
      failures: ['1.1.2', '1.2.1']
    })
    expect(actual.rollup).toContainEqual({
      id: '2',
      numTotal: 2,
      numPass: 2,
      numFail: 0,
      failures: []
    })
  })

  function newSpec(
    top: number | string,
    middle: number | string,
    lower: number | string,
    status: Status
  ): Spec {
    return {
      id: `${top}.${middle}.${lower}`,
      status: status,
      fulfilled_by: `fulfilled_by_${top}_${middle}_${lower}`
    }
  }
})

describe('splitId', () => {
  it('returns empty string for level 0', () => {
    expect(splitIdByDepth('1.2.3', 0)).toEqual('')
  })

  it('returns "1" for level 1', () => {
    expect(splitIdByDepth('1.2.3', 1)).toEqual('1')
  })

  it('returns "1.2" for level 2', () => {
    expect(splitIdByDepth('1.2.3', 2)).toEqual('1.2')
  })

  it('returns "1.2.3" for level 3', () => {
    expect(splitIdByDepth('1.2.3', 3)).toEqual('1.2.3')
  })

  it('returns "1.2.3" for level 4', () => {
    expect(splitIdByDepth('1.2.3', 4)).toEqual('1.2.3')
  })
})
