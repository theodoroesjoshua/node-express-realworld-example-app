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
var article_mapper_exports = {};
__export(article_mapper_exports, {
  default: () => article_mapper_default
});
module.exports = __toCommonJS(article_mapper_exports);
var import_author = __toESM(require("./author.mapper"));
const articleMapper = (article, id) => ({
  slug: article.slug,
  title: article.title,
  description: article.description,
  body: article.body,
  tagList: article.tagList.map((tag) => tag.name),
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  favorited: article.favoritedBy.some((item) => item.id === id),
  favoritesCount: article.favoritedBy.length,
  author: (0, import_author.default)(article.author, id)
});
var article_mapper_default = articleMapper;
