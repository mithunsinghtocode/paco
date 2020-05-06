export const getHoursAndMinutesAfterFormat = (jsonDate) => {
    return jsonDate !== null ? new Date(jsonDate).toString().substr(16,5) : "-";
};

export const getUTCDate = (jsonDate) => {
    let dateParsed =  new Date(jsonDate);
   return `${addZero(dateParsed.getDate())}-${addZero(dateParsed.getMonth())}-${addZero(dateParsed.getFullYear())}`
};

const addZero = (inData) => {
    return inData.length === 1 ? `0${inData}` : inData ;
};
