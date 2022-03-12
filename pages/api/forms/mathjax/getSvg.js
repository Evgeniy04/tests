import nextConnect from "next-connect";
import middleware from "../../middleware/database";
import mjAPI from "mathjax-node";

const handler = nextConnect({ attachParams: true });

mjAPI.config({ displayErrors: false });
mjAPI.start();
handler.use(middleware);

handler.post(async (req, res) => {
  let { mml } = req.body;

  await mjAPI.typeset(
    {
      ex: 5.5,
      width: 0,
      math: mml,
      format: "MathML",
      useGlobalCache: false,
      svg: true,
    },
    function (data) {
      res.status(200).json(JSON.stringify(data));
    }
  );
});

export default handler;
