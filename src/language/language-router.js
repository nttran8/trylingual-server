const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  // Retrieve the user's language from db
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`
      });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/head", async (req, res, next) => {
  try {
    const nextWord = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id
    );
    res.json({ nextWord });
    next();
  } catch (err) {
    next(err);
  }
});

languageRouter.post("/guess", async (req, res, next) => {
  try {
    const guess = req.body.guess;
  } catch (err) {
    next(err);
  }
});

module.exports = languageRouter;
