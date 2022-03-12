import { ObjectId } from "mongodb";
import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect({ attachParams: true });

handler.use(middleware);

handler.post(async (req, res) => {
  let { form } = req.body;
  form.editId = new ObjectId();
  let result = await req.db.collection("Forms").insertOne(form);

  const filter = {
    ["_id"]: new ObjectId(result.insertedId),
  };
  let newForm = await req.db.collection("Forms").findOne(filter);

  res.status(200).json(
    JSON.stringify({
      status: "ok",
      _id: newForm._id,
      editId: newForm.editId,
    })
  );
});

export default handler;
