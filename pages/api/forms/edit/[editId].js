import { ObjectId } from "mongodb";
import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect({ attachParams: true });

handler.use(middleware);

handler.get("api/forms/edit/:editId", async (req, res) => {
  const { editId } = req.params;
  const filter = {
    ["editId"]: new ObjectId(editId),
  };
  let form = await req.db.collection("Forms").findOne(filter);
  res.status(200).json(JSON.stringify(form));
});

export default handler;
