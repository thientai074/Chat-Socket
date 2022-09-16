import {Request, Response} from "express";
import {
    findNotFriendsServices,
    updateUserServices,
    updateAvatarUserServices,
    removeUserServices,
    findOneUserServices,
    findAllUsersServices,
    saveUserServices,
    loginUserServices,
    findFriendsServices,
    findActiveUserServices
} from "../services/UserService";
import {env, errorUnknown} from "../utils/myVariables";
import {IFindActiveUser, IUser} from "../models/Interface/IUser";
import * as response from "../msg/message";
import {authorizationServices} from "../services/AuthorizationService";
import {errJwtNotVerify, errResponse} from "../msg/message";

// create User
export const saveUser = async function (req: Request, res: Response) {
    try {
        const item = req.body as IUser;

        if (!item.username || !item.email || !item.password || !item.avatar) {
            return errResponse("Missing name or email or password or avartar");
        }

        if (item.username.length < 5) {
            return errResponse("Username must has at least 5 letters");
        }

        const itemService = await saveUserServices(item);
        return res.json(itemService);
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

// GetAllUsers
export const findAllUsers = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const itemService = await findAllUsersServices();
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

// find User
export const findOneUser = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const item = req.body as IUser;
            const itemService = await findOneUserServices(item);
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

// Remove user
export const removeUser = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const item = req.body as IUser;
            const itemService = await removeUserServices(item);
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

// update user
export const updateUser = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);
        if (verify) {
            const item = req.body as IUser;
            const itemService = await updateUserServices(verify, item);
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

export const updateAvatarUser = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);
        if (verify) {
            const item = req.body as IUser;
            const itemService = await updateAvatarUserServices(verify, item);
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

// Get not Friend
export const findNotFriends = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const item = req.body as IUser;
            const itemService = await findNotFriendsServices(verify, item);
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

// findFriends
export const findFriends = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const itemService = await findFriendsServices(verify);
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

export const findActiveUser = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const item = req.body as IFindActiveUser;
            const itemService = await findActiveUserServices(verify, item);
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
}

// Login
export const loginUser = async function (req: Request, res: Response) {
    try {
        const item = req.body as IUser;
        const CHAT_APP = env.CHAT_APP;

        if (!item.email || !item.password) {
            return errResponse("Missing email or password");
        }

        const itemService = await loginUserServices(item);
        res.cookie(CHAT_APP, itemService?.values?.accessToken);
        return res.json(itemService);
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