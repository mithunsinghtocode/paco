export const getHoursAndMinutesAfterFormat = (jsonDate) => {
    return jsonDate !== null ? new Date(jsonDate).toString().substr(16,5) : "-";
};

// getCurrentUTCTime - FlightATDTime/(FlightETATime - FlightATDTime)

export const getTestTime = (testDateTime) => {
    //2020-03-15 01:30:00
    if(testDateTime === undefined || testDateTime === null) return new Date(2020, 2, 12, 14, 55, 0, 0); 
    return new Date(testDateTime.year, testDateTime.mon-1, testDateTime.dd, testDateTime.hh, testDateTime.mm, testDateTime.ss, 0); 
}

export const getAircraftPositionBasedOnFlightObj = (fltObj, isTest) => {
    if(isTest) return (( getTestTime(undefined).getTime() - getDateFromJsonField(fltObj.atd).getTime() ) / ( getDateFromJsonField(fltObj.eta).getTime() - getDateFromJsonField(fltObj.atd).getTime()));

    return (( new Date(getCurrentTimeInUTC(isTest, undefined)).getTime() - getDateFromJsonField(fltObj.atd).getTime() ) /
                ( getDateFromJsonField(fltObj.eta).getTime() - getDateFromJsonField(fltObj.atd).getTime()));
};

export const getCurrentTimeInUTC = (isTest, testDateTime) => {
    Date.prototype.getUTCTime = function(){ 
        return this.getTime()+(this.getTimezoneOffset()*60000); 
      };
    // var date = new Date(); 
    // var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    // date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    // return new Date(now_utc).toUTCString();
    if(isTest) return getTestTime(testDateTime);
    return new Date().getUTCTime();
}

export const getDateFromJsonField = inputJsonDate => new Date(inputJsonDate);

export const getUTCDate = (jsonDate) => {
    let dateParsed =  new Date(jsonDate);
   return `${addZero(dateParsed.getDate())}-${addZero(dateParsed.getMonth())}-${addZero(dateParsed.getFullYear())}`
};

const addZero = (inData) => {
    return inData.length === 1 ? `0${inData}` : inData ;
};

export const getMock2hTimeFromDateTime = (dateObj, hours) => {
    return dateObj !== null && dateObj !== undefined && hours!==null ? new Date( new Date(dateObj).getTime() + hours*60*60*1000 ) : "-";
}
export const convertMillisecondsToHoursAndMinutesAfterFormat = (duration) => {
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24) ;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    return hours+":"+minutes;
};