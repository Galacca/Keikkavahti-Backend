import { Request, Response } from "express";

const healthCheck = async (req: Request, res: Response) => {

    return res
    .status(200)
    .json({ message: "Healthcheck passed" });

}

export default { healthCheck }