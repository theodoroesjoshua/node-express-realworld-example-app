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
var profile_utils_exports = {};
__export(profile_utils_exports, {
  default: () => profile_utils_default
});
module.exports = __toCommonJS(profile_utils_exports);
const profileMapper = (user, id) => ({
  username: user.username,
  bio: user.bio,
  image: user.image,
  following: id ? user?.followedBy.some((followingUser) => followingUser.id === id) : false
});
var profile_utils_default = profileMapper;
