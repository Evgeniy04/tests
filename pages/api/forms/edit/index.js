import { ObjectId } from "mongodb";
import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect({ attachParams: true });

handler.use(middleware);

handler.post(async (req, res) => {
  let { form } = req.body;

  let filter = {
    ["_id"]: new ObjectId(form._id),
  };
  let _id = form._id;
  delete form._id;
  form.editId = new ObjectId(form.editId);
  const options = { upsert: true };
  await req.db.collection("Forms").updateOne(
    filter,
    {
      $set: form,
    },
    options
  );

  filter = {
    ["_id"]: new ObjectId(_id),
  };
  let newForm = await req.db.collection("Forms").findOne(filter);

  res
    .status(200)
    .json(
      JSON.stringify({ status: "ok", _id: newForm._id, editId: newForm.editId })
    );
});

export default handler;
