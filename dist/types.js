"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
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
var Status;
(function (Status) {
    Status["Passed"] = "passed";
    Status["Failed"] = "failed";
    Status["Ignored"] = "ignored";
})(Status = exports.Status || (exports.Status = {}));
