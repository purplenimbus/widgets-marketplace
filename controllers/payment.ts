import { HttpStatusCode } from "../enums/http";
import { Response } from "express";
import Widget from "../models/widget";
import { AppRequest } from "../middleware/auth";
import { PaymentService } from "../services";

class PaymentController {
  create = async (req: AppRequest, res: Response) => {
    

    try {
      const widget = await Widget.findByPk(req.body.widgetId);
      const paymentService = new PaymentService(widget!, req.user);

      res.status(HttpStatusCode.OK).json(await paymentService.create());
    } catch (error) {
      res.status(HttpStatusCode.ERROR).json();
    }
  };
}

export default new PaymentController();
