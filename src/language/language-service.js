const LinkedList = require("./LinkedList");

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "word.id",
        "word.language_id",
        "word.original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },

  getLanguageHead(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id })
      .first();
  },

  createLinkedListFrom(language, words) {
    const SLL = new LinkedList();
    SLL.user_id = language.user_id; // just added
    SLL.id = language.id;
    SLL.name = language.name;
    SLL.total_score = language.total_score;
    let word = { next: language.head };
    while (word.next) {
      word = words.find(w => w.id === word.next);
      SLL.insertLast({
        id: word.id,
        original: word.original,
        translation: word.translation,
        memory_value: word.memory_value,
        correct_count: word.correct_count,
        incorrect_count: word.incorrect_count
      });
    }
    return SLL;
  },

  updateWord(db, id, data) {
    return db
      .from("word")
      .where({ id })
      .update({ ...data });
  },

  updateTotalScore(db, user_id) {
    // Get current score and increment 1
    const total_score =
      db
        .from("language")
        .select("total_score")
        .where({ user_id }) + 1;

    return db
      .from("language")
      .where({ user_id })
      .update({ total_score });
  },
  getTotalScore(db, user_id) {
    return db
      .from("language")
      .select("language.total_score")
      .where("language.user_id", user_id)
      .first();
  },

  getOnDeck(db, head) {
    return db
      .from("word")
      .select("translation", "original", "correct_count", "incorrect_count")
      .where("word.id", head)
      .then(word => {
        return {
          answer: word[0].translation,
          nextWord: word[0].original,
          wordCorrectCount: word[0].correct_count,
          wordIncorrectCount: word[0].incorrect_count
        };
      });
  },

  persistLinkedList(db, linkedLanguage, updatedNodes) {
    return db.transaction(trx =>
      Promise.all([
        db
          .from("language")
          .transacting(trx)
          // if there are many users, we have to update scores based on the user
          // .where("id", linkedLanguage.id)
          .where("user_id", linkedLanguage.user_id)
          .update({
            total_score: linkedLanguage.total_score,
            head: linkedLanguage.head.value.id
          }),

        // we don't need to update each word = 10x
        // we just need to update 2 words - the current word and the
        ...linkedLanguage.forEach(node => {
          if (updatedNodes.includes(node.id)) {
            // just added
            db.from("word")
              .transacting(trx)
              .where("id", node.value.id)
              .update({
                memory_value: node.value.memory_value,
                correct_count: node.value.correct_count,
                incorrect_count: node.value.incorrect_count,
                next: node.next ? node.next.value.id : null
              });
          }
        })
      ])
    );
  }
};

module.exports = LanguageService;
