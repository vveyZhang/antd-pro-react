export const validateMoeny = (name) => (rule, value, callback) => {
  
    if (value <= 0) {
        callback(`${name}必须大于0`);
    }
    callback()
}
export const validateNumber = (name) => (rule, value, callback) => {

    if (value <= 0) {
        callback(`${name}必须大于0`);
    }
    callback()
}