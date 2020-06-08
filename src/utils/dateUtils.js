export const getHoursAndMinutesAfterFormat = (jsonDate) => {
    return jsonDate !== null ? new Date(jsonDate).toString().substr(16,5) : "-";
};

// getCurrentUTCTime - FlightATDTime/(FlightETATime - FlightATDTime)

const getTestTime = () => {
    //2020-03-15 01:30:00
    return new Date(2020, 2, 12, 14, 55, 0, 0); 
}

export const getAircraftPositionBasedOnFlightObj = (fltObj, isTest) => {
    if(isTest) return (( getTestTime().getTime() - getDateFromJsonField(fltObj.atd).getTime() ) / ( getDateFromJsonField(fltObj.eta).getTime() - getDateFromJsonField(fltObj.atd).getTime()));

    return (( getCurrentTimeInUTC().getTime() - getDateFromJsonField(fltObj.atd).getTime() ) /
                ( getDateFromJsonField(fltObj.eta).getTime() - getDateFromJsonField(fltObj.atd).getTime()));
};

const getCurrentTimeInUTC = () => {
    var date = new Date(); 
    var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return new Date(now_utc);
}

export const getDateFromJsonField = inputJsonDate => new Date(inputJsonDate);

export const getUTCDate = (jsonDate) => {
    let dateParsed =  new Date(jsonDate);
   return `${addZero(dateParsed.getDate())}-${addZero(dateParsed.getMonth())}-${addZero(dateParsed.getFullYear())}`
};

const addZero = (inData) => {
    return inData.length === 1 ? `0${inData}` : inData ;
};
