export const _isNull = function (value) {
    if (value === null || value === undefined || value === "") return true;
    else return false;
}
export const _isNotEmpty = function (value) {
    if (typeof value == 'object') {
        if (Array.isArray(value)) {
            if (value != null && value != undefined && value.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            if (value != null && value != undefined) {
                return true;
            } else {
                return false;
            }
        }
    } else {
        if (value != null && value != undefined && value != "") {
            return true;
        } else {
            return false;
        }
    }
}