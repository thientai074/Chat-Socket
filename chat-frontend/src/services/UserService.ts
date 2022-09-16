import {apiAuthClient, apiClient} from "../http-common";
import {FindActiveUser, UserInfor} from "../types/user-type"

class UserService {
    login(data: UserInfor) {
        return apiAuthClient.post("/user/login", data)
    }

    save(data: UserInfor) {
        return apiClient.post("/user/save", data)
    }

    update(data: UserInfor) {
        return apiClient.post("/user/update", data)
    }

    updateAvatar(data:UserInfor) {
        return apiClient.post("/user/update-avatar", data)
    }

    findNotFriends(data: UserInfor) {
        return apiClient.post("/user/find-not-friends", data)
    }

    findFriends(data: UserInfor) {
        return apiClient.post("/user/find-friends", data)
    }

    findActiveUser(data: FindActiveUser) {
        return apiClient.post("/user/find-active-user", data)
    }
}

export default new UserService()