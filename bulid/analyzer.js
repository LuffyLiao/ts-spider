"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs")); // node中的核心模块，判断文件是否存在
var cheerio_1 = __importDefault(require("cheerio"));
// implements 类实现接口
var DoAnalyzer = /** @class */ (function () {
    function DoAnalyzer() {
        this.url = "http://www.meinv.hk/";
    }
    /**
     * 获取数据中想要的内容
     * @param html
     */
    DoAnalyzer.prototype.getInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var items = $('.posts-default');
        var beauties = [];
        items.map(function (index, element) {
            var name = $(element).find('.posts-default-title h2').eq(0).text();
            var desc = $(element).find('.posts-default-content .posts-text').eq(0).text();
            var src = $(element).find('.posts-default-img .thumbnail').eq(0).attr('src');
            beauties.push({ name: name, desc: desc, src: src });
        });
        return {
            time: new Date().getTime(),
            data: beauties
        };
    };
    /**
     * 获取的数据
     */
    DoAnalyzer.prototype.generateJsonContent = function (result, filePath) {
        var fileContent = {};
        // 如果文件存在,读取内容，放到
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[result.time] = result.data;
        return fileContent;
    };
    DoAnalyzer.prototype.analyze = function (html, filePath) {
        var info = this.getInfo(html);
        var fileContent = this.generateJsonContent(info, filePath);
        return JSON.stringify(fileContent);
    };
    return DoAnalyzer;
}());
exports.default = DoAnalyzer;
