import bcrypt from "bcryptjs";
import { User } from "../models/UserModel";
import { Conversation } from "../models/ConversationModel";
import { IConversation } from "../models/Interface/IConversation";
import jwt from "jsonwebtoken";
import { env, errorUnknown } from "../utils/myVariables";
import { IFindActiveUser, IUser } from "../models/Interface/IUser";
import mongoose from "mongoose";
import { okResponse, errResponse, dataNotFoundResponse } from "../msg/message";

// create new User
export const saveUserServices = async function (data: IUser): Promise<any> {
  try {
    const exitedUser = await User.findOne({ email: data.email });
    if (exitedUser) {
      return errResponse("This email already exists");
    }

    const exitedAnotherUser = await User.findOne({ username: data.username });
    if (exitedAnotherUser) {
      return errResponse("This username already exists");
    }

    if (!exitedUser && !exitedAnotherUser) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(data.password, salt);

      const itemCreate = await new User({
        username: data.username,
        email: data.email,
        password: hashed,
        avatar: data.avatar,
      });

      await itemCreate.save();
      return okResponse(itemCreate);
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};

//  Get All Users
export const findAllUsersServices = async function () {
  try {
    const itemFind = await User.find().sort({ username: 1 });

    if (itemFind) {
      return okResponse(itemFind);
    } else {
      return dataNotFoundResponse();
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};

//   Get one user
export const findOneUserServices = async function (verify: string) {
  try {
    const itemFind = await User.findOne({
      _id: new mongoose.Types.ObjectId(verify),
    });

    if (itemFind) {
      return okResponse(itemFind);
    } else {
      return dataNotFoundResponse();
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};

//   Delete User
export const removeUserServices = async function (data: IUser) {
  try {
    const itemDelete = await User.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(data._id),
    });
    if (itemDelete) {
      //Trả kết quả
      return okResponse(itemDelete);
    } else {
      return dataNotFoundResponse();
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};

//   Update User
export const updateUserServices = async function (verify: string, data: IUser) {
  try {
    const itemUpdate = await User.findOne({
      _id: new mongoose.Types.ObjectId(verify),
    });
    if (itemUpdate) {
      itemUpdate.lastActive = new Date(Date.now());

      await itemUpdate.save();

      return okResponse(itemUpdate);
    } else {
      return dataNotFoundResponse();
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};

export const updateAvatarUserServices = async function (
  verify: string,
  data: IUser
) {
  try {
    const itemUpdate = await User.findOne({
      _id: new mongoose.Types.ObjectId(verify),
    });
    if (itemUpdate) {
      itemUpdate.avatar = data.avatar;
      await itemUpdate.save();

      return okResponse(itemUpdate);
    } else {
      return dataNotFoundResponse();
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};

export const findNotFriendsServices = async function (
  verify: string,
  data: IUser
) {
  try {
    let condition: any[] = [];
    let friendListId: string[] = [];
    const conversations = await Conversation.aggregate([
      {
        $match: {
          members: { $in: [verify] },
        },
      },
      {
        $unwind: "$members",
      },
      {
        $match: {
          members: { $nin: [verify] },
        },
      },
    ]);

    conversations.map((conversation: IConversation) => {
      const FriendId = String(conversation.members);
      friendListId.push(FriendId);
    });

    friendListId.push(verify);

    if (data.username === "" || !data.username) {
      condition = [
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
            isAdmin: 1,
            userStringId: { $toString: "$_id" },
          },
        },
        {
          $match: {
            userStringId: { $nin: friendListId },
          },
        },
      ];
    }

    if (data.username !== "") {
      condition = [
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
            isAdmin: 1,
            userStringId: { $toString: "$_id" },
          },
        },
        {
          $match: {
            userStringId: { $nin: friendListId },
          },
        },
        {
          $match: { username: { $regex: data.username, $options: "$i" } },
        },
      ];
    }

    const itemFind = await User.aggregate(condition);

    if (itemFind) {
      return okResponse(itemFind);
    } else {
      return dataNotFoundResponse();
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};

export const findFriendsServices = async function (verify: string) {
  try {
    let friendListId: string[] = [];
    const conversations = await Conversation.aggregate([
      {
        $match: {
          members: { $in: [verify] },
        },
      },
      {
        $unwind: "$members",
      },
      {
        $match: {
          members: { $nin: [verify] },
        },
      },
    ]);

    conversations.map((conversation: IConversation) => {
      const FriendId = String(conversation.members);
      friendListId.push(FriendId);
    });

    const itemFind = await User.aggregate([
      {
        $project: {
          _id: 1,
          username: 1,
          avatar: 1,
          isAdmin: 1,
          lastActive: 1,
          userStringId: { $toString: "$_id" },
        },
      },
      {
        $match: {
          userStringId: { $in: friendListId },
        },
      },
    ]);

    if (itemFind) {
      return okResponse(itemFind);
    } else {
      return dataNotFoundResponse();
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};

export const findActiveUserServices = async function (
  verify: string,
  data: IFindActiveUser
) {
  try {
    let friendListId: string[] = [];
    const conversations = await Conversation.aggregate([
      {
        $match: {
          members: { $in: [verify] },
        },
      },
      {
        $unwind: "$members",
      },
      {
        $match: {
          members: { $nin: [verify] },
        },
      },
    ]);

    conversations.map((conversation: IConversation) => {
      const FriendId = String(conversation.members);
      friendListId.push(FriendId);
    });

    const itemFind = await User.aggregate([
      {
        $project: {
          _id: 1,
          username: 1,
          avatar: 1,
          isAdmin: 1,
          userStringId: { $toString: "$_id" },
        },
      },
      {
        $match: {
          userStringId: { $in: data.activeUserArray },
        },
      },
      {
        $match: {
          userStringId: { $in: friendListId },
        },
      },
    ]);
    if (itemFind) {
      return okResponse(itemFind);
    } else {
      return dataNotFoundResponse();
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};

export const loginUserServices = async function (data: IUser) {
  try {
    const jwtAccessToken = env.JWT_ACCESS_KEY;
    const itemFind = await User.findOne({ email: data.email });
    const userInfor = await User.findOne({ email: data.email }).select(
      "-password"
    );

    if (itemFind) {
      const validPassword =
        itemFind && (await bcrypt.compare(data.password, itemFind.password));

      if (!validPassword) {
        return errResponse("Incorrect email or password");
      }

      if (itemFind && validPassword) {
        //Generate access token
        const accessToken: string = jwt.sign(
          {
            id: itemFind._id,
            email: itemFind.email,
          },
          jwtAccessToken,
          { expiresIn: "1d" }
        );
        return okResponse({ accessToken, userInfor });
      }
    } else {
      return dataNotFoundResponse();
    }
  } catch (e: unknown) {
    let err: string;
    if (e instanceof Error) {
      err = e.message;
    } else {
      err = errorUnknown;
    }
    return errResponse(err);
  }
};
