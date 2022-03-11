import { ObjectId } from "mongodb";
import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect({ attachParams: true });

handler.use(middleware);

handler.get("api/forms/fill/:_id", async (req, res) => {
  const { _id } = req.params;
  const filter = {
    ["_id"]: new ObjectId(_id),
  };
  let form = await req.db.collection("Forms").findOne(filter);
  form.questions = form.questions.map((question) => {
    if (question.type === "textmath") {
      question.allAnswersMML = [];
    }
    delete question.correctAnswer;
    return question;
  });
  res.status(200).json(JSON.stringify(form));
});

export default handler;
