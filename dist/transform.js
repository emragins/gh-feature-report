"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitIdByDepth = exports.transform = void 0;
const types_1 = require("./types");
function transform(specInput, rollupLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            if (specInput == null) {
                throw new Error('specInput is null');
            }
            const [rollupItems, rollupSummary] = performRollup(specInput, rollupLevel);
            const rollup = {
                target: specInput.target,
                build: specInput.build,
                correlationId: specInput.correlationId,
                datetime: specInput.datetime,
                total: rollupSummary.total,
                totalPassed: rollupSummary.totalPassed,
                totalFailed: rollupSummary.totalFailed,
                totalIgnored: rollupSummary.totalIgnored,
                rollup: rollupItems
            };
            resolve(rollup);
        });
    });
}
exports.transform = transform;
function performRollup(specInput, rollupLevel) {
    return specInput.specs.reduce((acc, spec) => {
        const id = splitIdByDepth(spec.id, rollupLevel);
        // handle summary-level rollup
        acc[1].total++;
        if (spec.status === types_1.Status.Passed) {
            acc[1].totalPassed++;
        }
        else if (spec.status === types_1.Status.Failed) {
            acc[1].totalFailed++;
        }
        else if (spec.status === types_1.Status.Ignored) {
            acc[1].totalIgnored++;
        }
        // handle item-level rollup
        const item = acc[0].find(x => x.id === id);
        if (item) {
            item.numTotal++;
            if (spec.status === types_1.Status.Passed) {
                item.numPass++;
            }
            else if (spec.status === types_1.Status.Failed) {
                item.numFail++;
                item.failures.push(spec.id);
            }
        }
        else {
            const newItem = {
                id,
                numTotal: 1,
                numPass: spec.status === types_1.Status.Passed ? 1 : 0,
                numFail: spec.status === types_1.Status.Failed ? 1 : 0,
                failures: spec.status === types_1.Status.Failed ? [spec.id] : []
            };
            acc[0].push(newItem);
        }
        return acc;
    }, [[], { total: 0, totalPassed: 0, totalFailed: 0, totalIgnored: 0 }]);
}
function splitIdByDepth(id, depth) {
    if (depth === 0) {
        return '';
    }
    else {
        const parts = id.split('.');
        if (parts.length < depth) {
            return id;
        }
        else {
            return parts.slice(0, depth).join('.');
        }
    }
}
exports.splitIdByDepth = splitIdByDepth;
