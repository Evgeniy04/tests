import { MongoClient } from "mongodb";
import nextConnect from "next-connect";
import { mongo_db } from "../../../constants/api";

const client = new MongoClient(mongo_db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  if (!client.isConnected) await client.connect();
  req.dbClient = client;
  req.db = client.db("Main");
  return next();
}

const middleware = nextConnect();
middleware.use(database);

export default middleware;
