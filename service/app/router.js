'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/chapterList', controller.chapterList.get);
  router.post('/api/chapter', controller.chapter.get);
  router.post('/api/book', controller.book.get);
};
