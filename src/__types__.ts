


// JSON
//{
//    target: "Visual Studio 2022",
//    build: "1.2.3",
//    correlationId: "49837437",
//    datetime: "2023-01-30T12:12:12",
//    total: 12,
//    totalPassed: 1,
//    totalFailed: 0,
//    totalIgnored: 0,
//    specs: [
//      {
//        id: "auth.login.start.clicking_on_button_opens_popup",
//        status: "passed|failed|ignored",
//        fulfilled_by: "GitHub.Copilot.SpecSample.TestA",
//      },
//    }
// }
//
export enum Status {
    Passed = "passed",
    Failed = "failed",
    Ignored = "ignored"
}

// typescript representation
export interface Spec {
    id: string
    status: 'passed' | 'failed' | 'ignored'
    fulfilled_by: string
  }
  
  export interface Report {
    target: string
    build: string
    correlationId: string
    datetime: string
    total: number
    totalPassed: number
    totalFailed: number
    totalIgnored: number
    specs: Spec[]
  }
  
  export interface RollupItem
{
    id: string
    numTotal: number
    numPass: number
    numFail: number
    failures: string[]
}

  export interface Rollup {
    target: string
    build: string
    correlationId: string
    datetime: string
    total: number
    totalPassed: number
    totalFailed: number
    totalIgnored: number
    rollup: RollupItem[]
  }