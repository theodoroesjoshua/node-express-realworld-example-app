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
var auth_exports = {};
__export(auth_exports, {
  default: () => auth_default
});
module.exports = __toCommonJS(auth_exports);
var import_express_jwt = require("express-jwt");
const getTokenFromHeaders = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Token" || req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};
const auth = {
  required: (0, import_express_jwt.expressjwt)({
    secret: process.env.JWT_SECRET || "superSecret",
    getToken: getTokenFromHeaders,
    algorithms: ["HS256"]
  }),
  optional: (0, import_express_jwt.expressjwt)({
    secret: process.env.JWT_SECRET || "superSecret",
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    algorithms: ["HS256"]
  })
};
var auth_default = auth;
