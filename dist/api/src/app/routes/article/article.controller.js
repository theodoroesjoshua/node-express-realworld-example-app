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
var article_controller_exports = {};
__export(article_controller_exports, {
  default: () => article_controller_default
});
module.exports = __toCommonJS(article_controller_exports);
var import_express = require("express");
var import_auth = __toESM(require("../auth/auth"));
var import_article = require("./article.service");
const router = (0, import_express.Router)();
router.get("/articles", import_auth.default.optional, async (req, res, next) => {
  try {
    const result = await (0, import_article.getArticles)(req.query, req.auth?.user?.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
router.get(
  "/articles/feed",
  import_auth.default.required,
  async (req, res, next) => {
    try {
      const result = await (0, import_article.getFeed)(
        Number(req.query.offset),
        Number(req.query.limit),
        req.auth?.user?.id
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);
router.post("/articles", import_auth.default.required, async (req, res, next) => {
  try {
    const article = await (0, import_article.createArticle)(req.body.article, req.auth?.user?.id);
    res.status(201).json({ article });
  } catch (error) {
    next(error);
  }
});
router.get(
  "/articles/:slug",
  import_auth.default.optional,
  async (req, res, next) => {
    try {
      const article = await (0, import_article.getArticle)(req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  }
);
router.put(
  "/articles/:slug",
  import_auth.default.required,
  async (req, res, next) => {
    try {
      const article = await (0, import_article.updateArticle)(req.body.article, req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/articles/:slug",
  import_auth.default.required,
  async (req, res, next) => {
    try {
      await (0, import_article.deleteArticle)(req.params.slug, req.auth?.user.id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/articles/:slug/comments",
  import_auth.default.optional,
  async (req, res, next) => {
    try {
      const comments = await (0, import_article.getCommentsByArticle)(req.params.slug, req.auth?.user?.id);
      res.json({ comments });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/articles/:slug/comments",
  import_auth.default.required,
  async (req, res, next) => {
    try {
      const comment = await (0, import_article.addComment)(req.body.comment.body, req.params.slug, req.auth?.user?.id);
      res.json({ comment });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/articles/:slug/comments/:id",
  import_auth.default.required,
  async (req, res, next) => {
    try {
      await (0, import_article.deleteComment)(Number(req.params.id), req.auth?.user?.id);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/articles/:slug/favorite",
  import_auth.default.required,
  async (req, res, next) => {
    try {
      const article = await (0, import_article.favoriteArticle)(req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/articles/:slug/favorite",
  import_auth.default.required,
  async (req, res, next) => {
    try {
      const article = await (0, import_article.unfavoriteArticle)(req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  }
);
var article_controller_default = router;
