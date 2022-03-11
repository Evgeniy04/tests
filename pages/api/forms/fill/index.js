import { ObjectId } from "mongodb";
import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect({ attachParams: true });

handler.use(middleware);

handler.get(async (req, res) => {
  let formsId = [];
  const result = await req.db.collection("Forms").find({});
  await result.forEach((doc) => {
    formsId.push(doc._id.toString());
  });
  res.status(200).json(JSON.stringify(formsId));
});

handler.post(async (req, res) => {
  let { form } = req.body;
  let requestForm = { ...form };
  let totalPoints = 0;
  let ofPoints = 0;

  const filter = {
    ["_id"]: new ObjectId(form.formId),
  };
  let fullForm = await req.db.collection("Forms").findOne(filter);

  form.answersOnQuestions.forEach(async (questionFill, index) => {
    let fullFormQuestion = fullForm.questions[index];
    const correctAnswer = fullFormQuestion.correctAnswer;
    const allAnswersMML = fullFormQuestion.allAnswersMML;
    requestForm.answersOnQuestions[index].correctAnswer = correctAnswer;
    requestForm.answersOnQuestions[index].allAnswersMML = allAnswersMML;

    // Кол-во полученных баллов, максимальное кол-во возможных баллов, баллов за вопрос, правильный ли ответ
    const points = +fullFormQuestion.points;
    const check = fullFormQuestion.check;
    const isObligatory = fullFormQuestion.isObligatory;

    ofPoints += points;
    requestForm.answersOnQuestions[index].check = check;
    requestForm.answersOnQuestions[index].isObligatory = isObligatory;
    if (check) {
      if (
        questionFill.type === "checkbox"
          ? JSON.stringify(questionFill.answers) ===
            JSON.stringify(correctAnswer)
          : questionFill.answers === correctAnswer
      ) {
        totalPoints += points;
        requestForm.answersOnQuestions[index].points = points;
        requestForm.answersOnQuestions[index].correctly = true;
      } else {
        requestForm.answersOnQuestions[index].points = 0;
        requestForm.answersOnQuestions[index].correctly = false;
      }
    }
  });

  requestForm.totalPoints = +totalPoints;
  requestForm.ofPoints = +ofPoints;

  const result = await req.db.collection("Answers").insertOne(requestForm);
  res
    .status(200)
    .json(JSON.stringify({ status: "ok", _id: result.insertedId }));
});

export default handler;
