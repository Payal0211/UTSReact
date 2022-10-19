export function errorDebug(error, identityCode) {
    let err = new Error();
    const message = `
        Identity Code  📢 :: ${identityCode}
        StackTrace 🚀 :: ${err.stack}
    `
    const errorResult = {
        'statusCode': error.message,
        'responseBody': error.data,
        'stackTrace': message
    }

    return errorResult;
}