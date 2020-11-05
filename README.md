# egg-body-filter #
基于[eggjs](https://eggjs.org/zh-cn/index.html)的响应body内容过滤插件。

## 安装 ##
```bash
npm install git+ssh://git@github.com:kiba-zhao/egg-body-filter.git --save
```

## 启用 ##
设置启用plugin: `config/plugin.js`
```javascript
exports.bodyFilter = {
  enable:true,
  package:'egg-body-filter'
};
```

## 配置 (可选) ##
配置过滤规则: `config/config.default.js`
```javascript
exports.bodyFilter = {
  header: 'AA-Filter'.toLowerCase(),
  json: ['application/json']
};
```

## 使用 ##
启用eggjs服务后，在http请求头中，使用AA-Filter头指定响应body的内容
```bash
npm i
npm run dev
```

### 示例 ###
响应完整内容
```json
{
   "id":"id0001",
   "title":"title0001",
   "authors":[
       {"name":"name001","age":1,"nickname":"nickname001"},
       {"name":"name002","age":2,"nickname":"nickname002"},
       {"name":"name003","age":3,"nickname":"nickname003"},
       {"name":"name004","age":4,"nickname":"nickname004"}
   ]
}
```
http请求示例
```bash
# 只返回title属性
curl -X GET "url" -H  "accept: application/json" -H  "AA-Filter: title"

# 只返回title,authors属性
curl -X GET "url" -H  "accept: application/json" -H  "AA-Filter: title,authors"

# 只返回title和authors中的name和age属性
curl -X GET "url" -H  "accept: application/json" -H  "AA-Filter: title,authors.*.name,authors.*.age"

# 只返回title,和第一条authors内容
curl -X GET "url" -H  "accept: application/json" -H  "AA-Filter: title,authors.0"

# 只返回title,和最后一条authors内容
curl -X GET "url" -H  "accept: application/json" -H  "AA-Filter: title,authors.-1"
```

## 说明 ##
插件读取配置中指定的http header头内容，作为响应内容过滤的规则。使用逗号分割多个属性。



