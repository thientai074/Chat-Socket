import { Request, Response } from "express";
import {
  findListConversationServices,
  saveConversationServices,
  deleteConversationServices,
  unblockConversationServices,
  blockConversationServices
} from "../services/ConversationService";
import * as response from "../msg/message";
import { errorUnknown } from "../utils/myVariables";
import { authorizationServices } from "../services/AuthorizationService";
import { errJwtNotVerify } from "../msg/message";
import {
  IConversation,
  ISearchConversation,
} from "../models/Interface/IConversation";

export const saveConversation = async function (req: Request, res: Response) {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return errJwtNotVerify(res);
    }

    const verify = await authorizationServices(authorization);

    if (verify) {
      const { receiverId } = req.body;
      const itemService = await saveConversationServices(verify, receiverId);
      return res.json(itemService);
    } else {
      return errJwtNotVerify(res);
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return response.err(err, res);
  }
};

// Find All conversations of one user
export const findListConversation = async function (
  req: Request,
  res: Response
) {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return errJwtNotVerify(res);
    }

    const verify = await authorizationServices(authorization);

    if (verify) {
      const item = req.body as ISearchConversation;
      const itemService = await findListConversationServices(verify, item);
      return res.json(itemService);
    } else {
      return errJwtNotVerify(res);
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return response.err(err, res);
  }
};

export const deleteConversation = async function (req: Request, res: Response) {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return errJwtNotVerify(res);
    }

    const verify = await authorizationServices(authorization);

    if (verify) {
      const item = req.body as IConversation;
      const itemService = await deleteConversationServices(item);
      return res.json(itemService);
    } else {
      return errJwtNotVerify(res);
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return response.err(err, res);
  }
};

export const blockConversation = async function (req: Request, res: Response) {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return errJwtNotVerify(res);
    }

    const verify = await authorizationServices(authorization);

    if (verify) {
      const item = req.body as IConversation;
      const itemService = await blockConversationServices(verify, item);
      return res.json(itemService);
    } else {
      return errJwtNotVerify(res);
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return response.err(err, res);
  }
};

export const unblockConversation = async function (
  req: Request,
  res: Response
) {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return errJwtNotVerify(res);
    }

    const verify = await authorizationServices(authorization);

    if (verify) {
      const item = req.body as IConversation;
      const itemService = await unblockConversationServices(verify, item);
      return res.json(itemService);
    } else {
      return errJwtNotVerify(res);
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return response.err(err, res);
  }
};
