/**
 * @fileOverview 默认配置文件
 * @name config.default.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

module.exports = app => {

  const exports = {};

  exports.bodyFilter = {
    header: 'AA-Filter'.toLowerCase(),
    json: ['application/json']
  };

  return exports;

};
