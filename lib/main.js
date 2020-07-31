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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://getflywheel.github.io/local-addon-api/modules/_local_main_.html
const LocalMain = __importStar(require("@getflywheel/local/main"));
function default_1(context) {
    const { electron } = context;
    const { ipcMain } = electron;
    LocalMain.addIpcAsyncListener('get-random-count', () => __awaiter(this, void 0, void 0, function* () {
        return Math.floor(Math.random() * 100);
    }));
    ipcMain.on('save-count', (event, siteId, count) => __awaiter(this, void 0, void 0, function* () {
        LocalMain.sendIPCEvent('instructions');
        LocalMain.getServiceContainer().cradle.localLogger.log('info', `Saving count ${count} for site ${siteId}.`);
        LocalMain.SiteData.updateSite(siteId, {
            id: siteId,
            count,
        });
    }));
}
exports.default = default_1;
//# sourceMappingURL=main.js.map