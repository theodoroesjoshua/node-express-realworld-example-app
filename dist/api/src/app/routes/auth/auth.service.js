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
var auth_service_exports = {};
__export(auth_service_exports, {
  createUser: () => createUser,
  getCurrentUser: () => getCurrentUser,
  login: () => login,
  updateUser: () => updateUser
});
module.exports = __toCommonJS(auth_service_exports);
var bcrypt = __toESM(require("bcryptjs"));
var import_prisma_client = __toESM(require("../../../prisma/prisma-client"));
var import_http_exception = __toESM(require("../../models/http-exception.model"));
var import_token = __toESM(require("./token.utils"));
const checkUserUniqueness = async (email, username) => {
  const existingUserByEmail = await import_prisma_client.default.user.findUnique({
    where: {
      email
    },
    select: {
      id: true
    }
  });
  const existingUserByUsername = await import_prisma_client.default.user.findUnique({
    where: {
      username
    },
    select: {
      id: true
    }
  });
  if (existingUserByEmail || existingUserByUsername) {
    throw new import_http_exception.default(422, {
      errors: {
        ...existingUserByEmail ? { email: ["has already been taken"] } : {},
        ...existingUserByUsername ? { username: ["has already been taken"] } : {}
      }
    });
  }
};
const createUser = async (input) => {
  const email = input.email?.trim();
  const username = input.username?.trim();
  const password = input.password?.trim();
  const { image, bio, demo } = input;
  if (!email) {
    throw new import_http_exception.default(422, { errors: { email: ["can't be blank"] } });
  }
  if (!username) {
    throw new import_http_exception.default(422, { errors: { username: ["can't be blank"] } });
  }
  if (!password) {
    throw new import_http_exception.default(422, { errors: { password: ["can't be blank"] } });
  }
  await checkUserUniqueness(email, username);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await import_prisma_client.default.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      ...image ? { image } : {},
      ...bio ? { bio } : {},
      ...demo ? { demo } : {}
    },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      image: true
    }
  });
  return {
    ...user,
    token: (0, import_token.default)(user.id)
  };
};
const login = async (userPayload) => {
  const email = userPayload.email?.trim();
  const password = userPayload.password?.trim();
  if (!email) {
    throw new import_http_exception.default(422, { errors: { email: ["can't be blank"] } });
  }
  if (!password) {
    throw new import_http_exception.default(422, { errors: { password: ["can't be blank"] } });
  }
  const user = await import_prisma_client.default.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      bio: true,
      image: true
    }
  });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token: (0, import_token.default)(user.id)
      };
    }
  }
  throw new import_http_exception.default(403, {
    errors: {
      "email or password": ["is invalid"]
    }
  });
};
const getCurrentUser = async (id) => {
  const user = await import_prisma_client.default.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      image: true
    }
  });
  return {
    ...user,
    token: (0, import_token.default)(user.id)
  };
};
const updateUser = async (userPayload, id) => {
  const { email, username, password, image, bio } = userPayload;
  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  const user = await import_prisma_client.default.user.update({
    where: {
      id
    },
    data: {
      ...email ? { email } : {},
      ...username ? { username } : {},
      ...password ? { password: hashedPassword } : {},
      ...image ? { image } : {},
      ...bio ? { bio } : {}
    },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      image: true
    }
  });
  return {
    ...user,
    token: (0, import_token.default)(user.id)
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser
});
