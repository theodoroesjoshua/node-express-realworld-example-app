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
var article_service_exports = {};
__export(article_service_exports, {
  addComment: () => addComment,
  createArticle: () => createArticle,
  deleteArticle: () => deleteArticle,
  deleteComment: () => deleteComment,
  favoriteArticle: () => favoriteArticle,
  getArticle: () => getArticle,
  getArticles: () => getArticles,
  getCommentsByArticle: () => getCommentsByArticle,
  getFeed: () => getFeed,
  unfavoriteArticle: () => unfavoriteArticle,
  updateArticle: () => updateArticle
});
module.exports = __toCommonJS(article_service_exports);
var import_slugify = __toESM(require("slugify"));
var import_prisma_client = __toESM(require("../../../prisma/prisma-client"));
var import_http_exception = __toESM(require("../../models/http-exception.model"));
var import_profile = __toESM(require("../profile/profile.utils"));
var import_article = __toESM(require("./article.mapper"));
const buildFindAllQuery = (query, id) => {
  const queries = [];
  const orAuthorQuery = [];
  const andAuthorQuery = [];
  orAuthorQuery.push({
    demo: {
      equals: true
    }
  });
  if (id) {
    orAuthorQuery.push({
      id: {
        equals: id
      }
    });
  }
  if ("author" in query) {
    andAuthorQuery.push({
      username: {
        equals: query.author
      }
    });
  }
  const authorQuery = {
    author: {
      OR: orAuthorQuery,
      AND: andAuthorQuery
    }
  };
  queries.push(authorQuery);
  if ("tag" in query) {
    queries.push({
      tagList: {
        some: {
          name: query.tag
        }
      }
    });
  }
  if ("favorited" in query) {
    queries.push({
      favoritedBy: {
        some: {
          username: {
            equals: query.favorited
          }
        }
      }
    });
  }
  return queries;
};
const getArticles = async (query, id) => {
  const andQueries = buildFindAllQuery(query, id);
  const articlesCount = await import_prisma_client.default.article.count({
    where: {
      AND: andQueries
    }
  });
  const articles = await import_prisma_client.default.article.findMany({
    where: { AND: andQueries },
    orderBy: {
      createdAt: "desc"
    },
    skip: Number(query.offset) || 0,
    take: Number(query.limit) || 10,
    include: {
      tagList: {
        select: {
          name: true
        }
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true
        }
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true
        }
      }
    }
  });
  return {
    articles: articles.map((article) => (0, import_article.default)(article, id)),
    articlesCount
  };
};
const getFeed = async (offset, limit, id) => {
  const articlesCount = await import_prisma_client.default.article.count({
    where: {
      author: {
        followedBy: { some: { id } }
      }
    }
  });
  const articles = await import_prisma_client.default.article.findMany({
    where: {
      author: {
        followedBy: { some: { id } }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    skip: offset || 0,
    take: limit || 10,
    include: {
      tagList: {
        select: {
          name: true
        }
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true
        }
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true
        }
      }
    }
  });
  return {
    articles: articles.map((article) => (0, import_article.default)(article, id)),
    articlesCount
  };
};
const createArticle = async (article, id) => {
  const { title, description, body, tagList } = article;
  const tags = Array.isArray(tagList) ? tagList : [];
  if (!title) {
    throw new import_http_exception.default(422, { errors: { title: ["can't be blank"] } });
  }
  if (!description) {
    throw new import_http_exception.default(422, { errors: { description: ["can't be blank"] } });
  }
  if (!body) {
    throw new import_http_exception.default(422, { errors: { body: ["can't be blank"] } });
  }
  const slug = `${(0, import_slugify.default)(title)}-${id}`;
  const existingTitle = await import_prisma_client.default.article.findUnique({
    where: {
      slug
    },
    select: {
      slug: true
    }
  });
  if (existingTitle) {
    throw new import_http_exception.default(422, { errors: { title: ["must be unique"] } });
  }
  const {
    authorId,
    id: articleId,
    ...createdArticle
  } = await import_prisma_client.default.article.create({
    data: {
      title,
      description,
      body,
      slug,
      tagList: {
        connectOrCreate: tags.map((tag) => ({
          create: { name: tag },
          where: { name: tag }
        }))
      },
      author: {
        connect: {
          id
        }
      }
    },
    include: {
      tagList: {
        select: {
          name: true
        }
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true
        }
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true
        }
      }
    }
  });
  return (0, import_article.default)(createdArticle, id);
};
const getArticle = async (slug, id) => {
  const article = await import_prisma_client.default.article.findUnique({
    where: {
      slug
    },
    include: {
      tagList: {
        select: {
          name: true
        }
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true
        }
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true
        }
      }
    }
  });
  if (!article) {
    throw new import_http_exception.default(404, { errors: { article: ["not found"] } });
  }
  return (0, import_article.default)(article, id);
};
const disconnectArticlesTags = async (slug) => {
  await import_prisma_client.default.article.update({
    where: {
      slug
    },
    data: {
      tagList: {
        set: []
      }
    }
  });
};
const updateArticle = async (article, slug, id) => {
  let newSlug = null;
  const existingArticle = await await import_prisma_client.default.article.findFirst({
    where: {
      slug
    },
    select: {
      author: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });
  if (!existingArticle) {
    throw new import_http_exception.default(404, {});
  }
  if (existingArticle.author.id !== id) {
    throw new import_http_exception.default(403, {
      message: "You are not authorized to update this article"
    });
  }
  if (article.title) {
    newSlug = `${(0, import_slugify.default)(article.title)}-${id}`;
    if (newSlug !== slug) {
      const existingTitle = await import_prisma_client.default.article.findFirst({
        where: {
          slug: newSlug
        },
        select: {
          slug: true
        }
      });
      if (existingTitle) {
        throw new import_http_exception.default(422, { errors: { title: ["must be unique"] } });
      }
    }
  }
  const tagList = Array.isArray(article.tagList) && article.tagList?.length ? article.tagList.map((tag) => ({
    create: { name: tag },
    where: { name: tag }
  })) : [];
  await disconnectArticlesTags(slug);
  const updatedArticle = await import_prisma_client.default.article.update({
    where: {
      slug
    },
    data: {
      ...article.title ? { title: article.title } : {},
      ...article.body ? { body: article.body } : {},
      ...article.description ? { description: article.description } : {},
      ...newSlug ? { slug: newSlug } : {},
      updatedAt: /* @__PURE__ */ new Date(),
      tagList: {
        connectOrCreate: tagList
      }
    },
    include: {
      tagList: {
        select: {
          name: true
        }
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true
        }
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true
        }
      }
    }
  });
  return (0, import_article.default)(updatedArticle, id);
};
const deleteArticle = async (slug, id) => {
  const existingArticle = await await import_prisma_client.default.article.findFirst({
    where: {
      slug
    },
    select: {
      author: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });
  if (!existingArticle) {
    throw new import_http_exception.default(404, {});
  }
  if (existingArticle.author.id !== id) {
    throw new import_http_exception.default(403, {
      message: "You are not authorized to delete this article"
    });
  }
  await import_prisma_client.default.article.delete({
    where: {
      slug
    }
  });
};
const getCommentsByArticle = async (slug, id) => {
  const queries = [];
  queries.push({
    author: {
      demo: true
    }
  });
  if (id) {
    queries.push({
      author: {
        id
      }
    });
  }
  const comments = await import_prisma_client.default.article.findUnique({
    where: {
      slug
    },
    include: {
      comments: {
        where: {
          OR: queries
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          body: true,
          author: {
            select: {
              username: true,
              bio: true,
              image: true,
              followedBy: true
            }
          }
        }
      }
    }
  });
  const result = comments?.comments.map((comment) => ({
    ...comment,
    author: {
      username: comment.author.username,
      bio: comment.author.bio,
      image: comment.author.image,
      following: comment.author.followedBy.some((follow) => follow.id === id)
    }
  }));
  return result;
};
const addComment = async (body, slug, id) => {
  if (!body) {
    throw new import_http_exception.default(422, { errors: { body: ["can't be blank"] } });
  }
  const article = await import_prisma_client.default.article.findUnique({
    where: {
      slug
    },
    select: {
      id: true
    }
  });
  const comment = await import_prisma_client.default.comment.create({
    data: {
      body,
      article: {
        connect: {
          id: article?.id
        }
      },
      author: {
        connect: {
          id
        }
      }
    },
    include: {
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true
        }
      }
    }
  });
  return {
    id: comment.id,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    body: comment.body,
    author: {
      username: comment.author.username,
      bio: comment.author.bio,
      image: comment.author.image,
      following: comment.author.followedBy.some((follow) => follow.id === id)
    }
  };
};
const deleteComment = async (id, userId) => {
  const comment = await import_prisma_client.default.comment.findFirst({
    where: {
      id,
      author: {
        id: userId
      }
    },
    select: {
      author: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });
  if (!comment) {
    throw new import_http_exception.default(404, {});
  }
  if (comment.author.id !== userId) {
    throw new import_http_exception.default(403, {
      message: "You are not authorized to delete this comment"
    });
  }
  await import_prisma_client.default.comment.delete({
    where: {
      id
    }
  });
};
const favoriteArticle = async (slugPayload, id) => {
  const { _count, ...article } = await import_prisma_client.default.article.update({
    where: {
      slug: slugPayload
    },
    data: {
      favoritedBy: {
        connect: {
          id
        }
      }
    },
    include: {
      tagList: {
        select: {
          name: true
        }
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true
        }
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true
        }
      }
    }
  });
  const result = {
    ...article,
    author: (0, import_profile.default)(article.author, id),
    tagList: article?.tagList.map((tag) => tag.name),
    favorited: article.favoritedBy.some((favorited) => favorited.id === id),
    favoritesCount: _count?.favoritedBy
  };
  return result;
};
const unfavoriteArticle = async (slugPayload, id) => {
  const { _count, ...article } = await import_prisma_client.default.article.update({
    where: {
      slug: slugPayload
    },
    data: {
      favoritedBy: {
        disconnect: {
          id
        }
      }
    },
    include: {
      tagList: {
        select: {
          name: true
        }
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true
        }
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true
        }
      }
    }
  });
  const result = {
    ...article,
    author: (0, import_profile.default)(article.author, id),
    tagList: article?.tagList.map((tag) => tag.name),
    favorited: article.favoritedBy.some((favorited) => favorited.id === id),
    favoritesCount: _count?.favoritedBy
  };
  return result;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addComment,
  createArticle,
  deleteArticle,
  deleteComment,
  favoriteArticle,
  getArticle,
  getArticles,
  getCommentsByArticle,
  getFeed,
  unfavoriteArticle,
  updateArticle
});
