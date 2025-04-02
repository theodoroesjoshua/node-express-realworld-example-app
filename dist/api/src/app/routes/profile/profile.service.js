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
var profile_service_exports = {};
__export(profile_service_exports, {
  followUser: () => followUser,
  getProfile: () => getProfile,
  unfollowUser: () => unfollowUser
});
module.exports = __toCommonJS(profile_service_exports);
var import_prisma_client = __toESM(require("../../../prisma/prisma-client"));
var import_profile = __toESM(require("./profile.utils"));
var import_http_exception = __toESM(require("../../models/http-exception.model"));
const getProfile = async (usernamePayload, id) => {
  const profile = await import_prisma_client.default.user.findUnique({
    where: {
      username: usernamePayload
    },
    include: {
      followedBy: true
    }
  });
  if (!profile) {
    throw new import_http_exception.default(404, {});
  }
  return (0, import_profile.default)(profile, id);
};
const followUser = async (usernamePayload, id) => {
  const profile = await import_prisma_client.default.user.update({
    where: {
      username: usernamePayload
    },
    data: {
      followedBy: {
        connect: {
          id
        }
      }
    },
    include: {
      followedBy: true
    }
  });
  return (0, import_profile.default)(profile, id);
};
const unfollowUser = async (usernamePayload, id) => {
  const profile = await import_prisma_client.default.user.update({
    where: {
      username: usernamePayload
    },
    data: {
      followedBy: {
        disconnect: {
          id
        }
      }
    },
    include: {
      followedBy: true
    }
  });
  return (0, import_profile.default)(profile, id);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  followUser,
  getProfile,
  unfollowUser
});
