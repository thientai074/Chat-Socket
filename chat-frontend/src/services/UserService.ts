import {apiAuthClient, apiClient} from "../http-common";
import {FindActiveUser, UserInfor} from "../types/user-type"

class UserService {
    login(data: UserInfor) {
        return apiAuthClient.post("/user/login", data)
    }

    save(data: UserInfor) {
        return apiClient('').post("/user/save", data)
    }

    findOne(data: UserInfor, token: string) {
        return apiClient(token).post("/user/find-one", data)
    }

    update(data: UserInfor, token: string) {
        return apiClient(token).post("/user/update", data)
    }

    updateAvatar(data:UserInfor, token: string) {
        return apiClient(token).post("/user/update-avatar", data)
    }

    findNotFriends(data: UserInfor, token: string) {
        return apiClient(token).post("/user/find-not-friends", data)
    }

    findFriends(data: UserInfor, token: string) {
        return apiClient(token).post("/user/find-friends", data)
    }

    findActiveUser(data: FindActiveUser, token: string) {
        return apiClient(token).post("/user/find-active-user", data)
    }
}

export default new UserService()