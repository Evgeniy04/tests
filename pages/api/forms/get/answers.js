import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect({ attachParams: true });

handler.use(middleware);

handler.get(async (req, res) => {
  let answersId = [];
  const result = await req.db.collection("Answers").find({});
  await result.forEach(async (doc) => {
    answersId.push(doc._id.toString());
  });
  res.status(200).json(JSON.stringify(answersId));
});

export default handler;
