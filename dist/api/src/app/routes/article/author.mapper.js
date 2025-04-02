var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var author_mapper_exports = {};
__export(author_mapper_exports, {
  default: () => author_mapper_default
});
module.exports = __toCommonJS(author_mapper_exports);
const authorMapper = (author, id) => ({
  username: author.username,
  bio: author.bio,
  image: author.image,
  following: id ? author?.followedBy.some((followingUser) => followingUser.id === id) : false
});
var author_mapper_default = authorMapper;
