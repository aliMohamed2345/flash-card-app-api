export var statusCode;
(function (statusCode) {
    statusCode[statusCode["OK"] = 200] = "OK";
    statusCode[statusCode["CREATED"] = 201] = "CREATED";
    statusCode[statusCode["ACCEPTED"] = 202] = "ACCEPTED";
    statusCode[statusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    statusCode[statusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    statusCode[statusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    statusCode[statusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    statusCode[statusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    statusCode[statusCode["CONFLICT"] = 409] = "CONFLICT";
    statusCode[statusCode["GONE"] = 410] = "GONE";
    statusCode[statusCode["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    statusCode[statusCode["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    statusCode[statusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(statusCode || (statusCode = {}));
//# sourceMappingURL=status-code.js.map