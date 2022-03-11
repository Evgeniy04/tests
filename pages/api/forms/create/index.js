import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect({ attachParams: true });

handler.use(middleware);

handler.post(async (req, res) => {
  const { form } = req.body;
  const result = await req.db.collection("Forms").insertOne(form);
  res
    .status(200)
    .json(JSON.stringify({ status: "ok", _id: result.insertedId }));
});

export default handler;
