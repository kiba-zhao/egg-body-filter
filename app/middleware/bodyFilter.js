'use strict';

const { array: isArray, object: isObject, } = require('is');
const NODE_SPLIT = '.';
const PATH_SPLIT = ',';
const PATH_ROOT = '$';

function buildJsonArray(jsonNode, cache, node, key, child, ...args) {
  const index = parseInt(child);
  let start;
  let end;
  if (isNaN(index)) {
    start = 0;
    end = node.length;
  } else {
    start = index < 0 ? node.length + index : index;
    end = start + 1;
  }

  for (let i = start; i < end; i++) {
    let childKey = `${key}.${i}`;
    let isNew = cache[childKey] === undefined;
    let childJsonNode = buildChildJsonNode(cache, node, childKey, i, ...args);
    if (isNew && childJsonNode !== undefined)
      jsonNode.push(childJsonNode);
  }

  return jsonNode;
}

function buildJsonObject(jsonNode, cache, node, key, child, ...args) {
  const childKey = `${key}.${child}`;
  const childJsonNode = buildChildJsonNode(cache, node, childKey, child, ...args);
  if (childJsonNode !== undefined)
    jsonNode[child] = childJsonNode;

  return jsonNode;
}

function buildJsonNode(cache, node, key, child, ...args) {
  let jsonNode = cache[key];
  if (isArray(node)) {
    jsonNode = buildJsonArray(jsonNode || [], cache, node, key, child, ...args);
  } else if (node[child] !== undefined) {
    jsonNode = buildJsonObject(jsonNode || {}, cache, node, key, child, ...args);
  } else {
    return jsonNode;
  }
  cache[key] = jsonNode;
  return jsonNode;
}

function buildChildJsonNode(cache, node, childKey, child, ...args) {
  return args.length > 0 ? buildJsonNode(cache, node[child], childKey, ...args) : node[child];
}



module.exports = config => {

  return async function(ctx, next) {

    await next();

    const rule = ctx.get(config.header);
    if (rule !== undefined && rule.length > 0 && config.json !== undefined && config.json.includes(ctx.type)) {
      const json = ctx.body;
      const paths = rule.split(PATH_SPLIT);
      if (paths.length > 0) {
        const jsonCache = {};
        for (let path of paths) {
          buildJsonNode(jsonCache, json, PATH_ROOT, ...path.split(NODE_SPLIT));
        }
        ctx.body = jsonCache[PATH_ROOT];
      } else if (isArray(json)) {
        ctx.body = [];
      } else if (isObject(json)) {
        ctx.body = {};
      } else {
        ctx.body = null;
      }
    }

  };

};
