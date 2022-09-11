import { Conversation } from "../models/ConversationModel";
import { ISearchConversation } from "../models/Interface/IConversation";
import { errResponse, okResponse, dataNotFoundResponse } from "../msg/message";
import { errorUnknown } from "../utils/myVariables";

export const saveConversationServices = async function (
  verify: string,
  receiverId: string
) {
  const itemFind = await Conversation.findOneAndRemove({
    members: [verify, receiverId],
  });

  const anotherItemFind = await Conversation.findOne({
    members: [receiverId, verify],
  });

  if (itemFind || anotherItemFind) {
    return errResponse("Already add friend this user");
  }
  if (!itemFind && !anotherItemFind) {
    try {
      const itemCreate = new Conversation({
        members: [verify, receiverId],
      });
      await itemCreate.save();
      return okResponse(itemCreate);
    } catch (e: unknown) {
      let err: string;
      if (e instanceof Error) {
        err = e.message;
      } else {
        err = errorUnknown;
      }
      return errResponse(err);
    }
  }
};

export const findListConversationServices = async function (
  verify: string,
  data: ISearchConversation
) {
  try {
    let condition: any[] = [];

    // Search conversation condition
    if (data.username !== "") {
      condition = [
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
        {
          $project: {
            userObjId: { $toObjectId: "$members" },
          },
        },
        {
          $lookup: {
            localField: "userObjId",
            from: "users",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $project: {
            conversationStringId: { $toString: "$_id" },
            userDetails: 1,
            _id: 1,
            members: 1,
            messages: 1,
            lastMessage: 1,
            unreadMessage: 1,
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "conversationStringId",
            foreignField: "conversationId",
            as: "messages",
          },
        },
        { $addFields: { lastMessage: { $last: "$messages" } } },
        {
          $project: {
            userDetails: 1,
            _id: 1,
            members: 1,
            lastMessage: 1,
            unreadMessage: {
              $filter: {
                input: "$messages",
                as: "item",
                cond: { $eq: ["$$item.read", false] },
              },
            },
          },
        },
        {
          $project: {
            unreadMessage: 1,
            _id: 1,
            members: 1,
            lastMessage: 1,
            userDetails: {
              $filter: {
                input: "$userDetails",
                as: "item",
                cond: {
                  $regexMatch: {
                    input: "$$item.username",
                    regex: data.username,
                  },
                },
              },
            },
          },
        },
        {
          $match: {
            userDetails: { $ne: [] },
          },
        },
      ];
    }

    // All conversation condition
    if (data.username === "" || !data.username) {
      condition = [
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
        {
          $project: {
            userObjId: { $toObjectId: "$members" },
          },
        },
        {
          $lookup: {
            localField: "userObjId",
            from: "users",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $project: {
            conversationStringId: { $toString: "$_id" },
            userDetails: 1,
            _id: 1,
            members: 1,
            messages: 1,
            lastMessage: 1,
            unreadMessage: 1,
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "conversationStringId",
            foreignField: "conversationId",
            as: "messages",
          },
        },
        { $addFields: { lastMessage: { $last: "$messages" } } },
        {
          $project: {
            userDetails: 1,
            _id: 1,
            members: 1,
            lastMessage: 1,
            unreadMessage: {
              $filter: {
                input: "$messages",
                as: "item",
                cond: { $eq: ["$$item.read", false] },
              },
            },
          },
        },    
        {
          $sort: {
            "lastMessage.createdAt": -1,
          },
        },
      ];
    }

    const itemFind = await Conversation.aggregate(condition);

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
