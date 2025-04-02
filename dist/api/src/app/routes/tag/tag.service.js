var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var tag_service_exports = {};
__export(tag_service_exports, {
  default: () => tag_service_default
});
module.exports = __toCommonJS(tag_service_exports);
var import_prisma_client = __toESM(require("../../../prisma/prisma-client"));
const getTags = async (id) => {
  const queries = [];
  queries.push({ demo: true });
  if (id) {
    queries.push({
      id: {
        equals: id
      }
    });
  }
  const tags = await import_prisma_client.default.tag.findMany({
    where: {
      articles: {
        some: {
          author: {
            OR: queries
          }
        }
      }
    },
    select: {
      name: true
    },
    orderBy: {
      articles: {
        _count: "desc"
      }
    },
    take: 10
  });
  return tags.map((tag) => tag.name);
};
var tag_service_default = getTags;
