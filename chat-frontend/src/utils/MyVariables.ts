const clientUrl = import.meta.env.VITE_CLIENT_URL;
const serverUrl = import.meta.env.VITE_SERVER_URL;
const socketUrl = import.meta.env.VITE_SOCKET_URL;
const encryptObject = import.meta.env.VITE_ENCRYPT_OBJECT;
const nameCookie = import.meta.env.VITE_NAME_COOKIE;


//Setup môi trường
export const env = {
    hostClient: clientUrl,
    hostServer: serverUrl,
    hostSocket: socketUrl,
    encryptObject: encryptObject,
    nameCookie: nameCookie,
    dateTimeFormat: "DD-MM-YYYY HH:mm:ss A",
    timeFormat: "HH:mm A",
};

export const REQUIRED = "Vui lòng không bỏ trống ô này";
export const REQUIRED_EMAIL = "Vui lòng nhập đúng Email";
export const MIN_TEXT_LENGTH = 5;
export const MIN_LENGTH =
    "Nhập liệu không được ít hơn " + MIN_TEXT_LENGTH + " ký tự";


