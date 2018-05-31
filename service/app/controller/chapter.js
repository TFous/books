'use strict';

const Controller = require('egg').Controller;
const fs = require('fs')

class ChapterController extends Controller {
    async get() {
        const bookCode = this.ctx.request.body.code;
        const chapterIndex = this.ctx.request.body.index;
        console.log(`===============${bookCode}========`)
        var response = { success: false, message: "操作失败" };
        // const bookInfo =await this.ctx.service.chapter.get(bookCode,chapterIndex);
        let dir = '/usr/local/src/novel/downLoad'
        // let dir = 'F:/newWorkSpace/books/crawlerNovel/downLoad/'
        let data = fs.readFileSync(`${dir}${bookCode}/${chapterIndex}.json`,'utf8');
        console.log(data)
        response.data = JSON.parse(data)
        response.message = "操作成功";
        response.success = true;
        this.ctx.status = 200;
        this.ctx.body = response;
    }
}

module.exports = ChapterController;


// exports.get = async function() {
//     const response = {success: false, message: "操作失败" };
//     const userInfo =await this.model.Chapter.find({});
//     response.message = "操作成功";
//     response.success = true;
//     response.data = userInfo;
//     this.body = response;
//     this.status = 200;
// }