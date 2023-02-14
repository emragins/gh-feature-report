"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const transform_1 = require("./transform");
const fs = __importStar(require("fs/promises"));
const DefaultDepth = 1;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('test');
        try {
            const input = core.getInput('inputFile', { required: true });
            core.debug(`Reading input from ${input}`);
            const file = yield fs.readFile(input);
            const json = JSON.parse(file.toString());
            if (!json)
                throw new Error(`Invalid JSON input: ${input}`);
            const depth = parseInt(core.getInput('depth'), 10) || DefaultDepth;
            const dataRollup = yield (0, transform_1.transform)(json, depth);
            const formatted = JSON.stringify(dataRollup, null, 2);
            // write file
            const output = core.getInput('outputFile', { required: true });
            core.debug(`Writing output to ${output}`);
            fs.writeFile(output, formatted);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
