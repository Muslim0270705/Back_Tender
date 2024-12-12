import { Request, Response, Router } from "express";
import userRoute from "../user";
import emailRoute from "../email";
import registerRoute from "../register";
import applicationRoute from "../application";
import executorRoute from "../executor";
import adminRoute from "../admin";

const api = Router()
  .use("/user", userRoute)
  .use("/email", emailRoute)
  .use("/register", registerRoute)
  .use("/application", applicationRoute)
  .use("/executor", executorRoute)
  .use("/admin", adminRoute);

api.use((_: Request, res: Response) => {
  res.status(404).json({ error: "API not found" });
});

export default Router().use("/tender/api", api);
