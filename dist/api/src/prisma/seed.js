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
var seed_exports = {};
__export(seed_exports, {
  generateArticle: () => generateArticle,
  generateComment: () => generateComment,
  generateUser: () => generateUser
});
module.exports = __toCommonJS(seed_exports);
var import_falso = require("@ngneat/falso");
var import_client = require("@prisma/client");
var import_auth = require("../app/routes/auth/auth.service");
var import_article = require("../app/routes/article/article.service");
const prisma = new import_client.PrismaClient();
const generateUser = async () => (0, import_auth.createUser)({
  username: (0, import_falso.randFullName)(),
  email: (0, import_falso.randEmail)(),
  password: (0, import_falso.randPassword)(),
  image: "https://api.realworld.io/images/demo-avatar.png",
  demo: true
});
const generateArticle = async (id) => (0, import_article.createArticle)(
  {
    title: (0, import_falso.randPhrase)(),
    description: (0, import_falso.randParagraph)(),
    body: (0, import_falso.randLines)({ length: 10 }).join(" "),
    tagList: (0, import_falso.randWord)({ length: 4 })
  },
  id
);
const generateComment = async (id, slug) => (0, import_article.addComment)((0, import_falso.randParagraph)(), slug, id);
const main = async () => {
  try {
    const users = await Promise.all(Array.from({ length: 12 }, () => generateUser()));
    users?.map((user) => user);
    for await (const user of users) {
      const articles = await Promise.all(Array.from({ length: 12 }, () => generateArticle(user.id)));
      for await (const article of articles) {
        await Promise.all(users.map((userItem) => generateComment(userItem.id, article.slug)));
      }
    }
  } catch (e) {
    console.error(e);
  }
};
main().then(async () => {
  await prisma.$disconnect();
}).catch(async () => {
  await prisma.$disconnect();
  process.exit(1);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateArticle,
  generateComment,
  generateUser
});
