import jwt from "jsonwebtoken";
import {errResponse} from "../msg/message";
import {env} from "../utils/myVariables";

export const authorizationServices = async function (
    authorization: string
): Promise<string> {
    let userId = "";
    try {
        const jwtAccessToken = env.JWT_ACCESS_KEY;
        await jwt.verify(
            authorization,
            jwtAccessToken,
            async function (err, decoded: any) {
                if (err || !decoded) {
                    return errResponse("Internal Server Error");
                } else {
                    userId = decoded.id;
                }
            }
        );
    } catch (e: unknown) {
        return userId;
    }
    return userId;
};