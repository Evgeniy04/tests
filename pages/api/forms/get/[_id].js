import { ObjectId } from "mongodb";
import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect({ attachParams: true });

handler.use(middleware);

handler.get("api/forms/get/:_id", async (req, res) => {
  const { _id } = req.params;
  const filter = {
    ["_id"]: new ObjectId(_id),
  };
  let form = await req.db.collection("Answers").findOne(filter);
  res.status(200).json(JSON.stringify(form));
});

export default handler;
