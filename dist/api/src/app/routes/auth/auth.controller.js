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
var auth_controller_exports = {};
__export(auth_controller_exports, {
  default: () => auth_controller_default
});
module.exports = __toCommonJS(auth_controller_exports);
var import_express = require("express");
var import_auth = __toESM(require("./auth"));
var import_auth2 = require("./auth.service");
const router = (0, import_express.Router)();
router.post("/users", async (req, res, next) => {
  try {
    const user = await (0, import_auth2.createUser)({ ...req.body.user, demo: false });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});
router.post("/users/login", async (req, res, next) => {
  try {
    const user = await (0, import_auth2.login)(req.body.user);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});
router.get("/user", import_auth.default.required, async (req, res, next) => {
  try {
    const user = await (0, import_auth2.getCurrentUser)(req.auth?.user?.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});
router.put("/user", import_auth.default.required, async (req, res, next) => {
  try {
    const user = await (0, import_auth2.updateUser)(req.body.user, req.auth?.user?.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});
var auth_controller_default = router;
