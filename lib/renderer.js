"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const TablePlus_js_1 = __importDefault(require("./TablePlus.js"));
module.exports = function (context) {
    context.hooks.addContent('SiteInfoDatabase_TableList_TableListRow[Connect]:Before', (site) => (react_1.default.createElement(TablePlus_js_1.default, { key: "tableplus", site: site })));
};
//# sourceMappingURL=renderer.js.map