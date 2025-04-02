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
var profile_controller_exports = {};
__export(profile_controller_exports, {
  default: () => profile_controller_default
});
module.exports = __toCommonJS(profile_controller_exports);
var import_express = require("express");
var import_auth = __toESM(require("../auth/auth"));
var import_profile = require("./profile.service");
const router = (0, import_express.Router)();
router.get(
  "/profiles/:username",
  import_auth.default.optional,
  async (req, res, next) => {
    try {
      const profile = await (0, import_profile.getProfile)(req.params.username, req.auth?.user?.id);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/profiles/:username/follow",
  import_auth.default.required,
  async (req, res, next) => {
    try {
      const profile = await (0, import_profile.followUser)(req.params?.username, req.auth?.user?.id);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/profiles/:username/follow",
  import_auth.default.required,
  async (req, res, next) => {
    try {
      const profile = await (0, import_profile.unfollowUser)(req.params.username, req.auth?.user?.id);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  }
);
var profile_controller_default = router;
