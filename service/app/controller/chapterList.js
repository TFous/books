'use strict';

const Controller = require('egg').Controller;

class ChapterListController extends Controller {
    async get() {
        // const bookCode = this.ctx.params.id;
        const bookCode = this.ctx.request.body.code;
        var response = { success: false, message: "操作失败" };
        const bookInfo =await this.ctx.service.chapterList.get(bookCode);
        response.message = "操作成功";
        response.success = true;
        response.data = bookInfo[0];

        this.ctx.body = response;
        this.ctx.status = 200;

    }
}

module.exports = ChapterListController;


// exports.get = async function() {
//     const response = {success: false, message: "操作失败" };
//     const userInfo =await this.model.Chapter.find({});
//     response.message = "操作成功";
//     response.success = true;
//     response.data = userInfo;
//     this.body = response;
//     this.status = 200;
// }