export const sort = ({inputList, objectProp, typeOfProp, conversionRequired = false, isAscending = true, isNewCopyOfArr}) => {
          
          if(isNewCopyOfArr) return inputList.slice().sort((obj1, obj2) => convertAndSortInput(conversionRequired, objectProp, obj1, obj2, typeOfProp, isAscending));
          
          return inputList.sort((obj1, obj2) => convertAndSortInput(conversionRequired, objectProp, obj1, obj2, typeOfProp, isAscending));
};

const convertAndSortInput = (conversionRequired, objectProp, obj1, obj2, typeOfProp, isAscending) => {
          let compObj1 = conversionRequired ? convertObj(read_prop(obj1, objectProp), typeOfProp) : read_prop(obj1, objectProp) ;
          let compObj2 = conversionRequired ? convertObj(read_prop(obj2, objectProp), typeOfProp) : read_prop(obj1, objectProp) ;

          if(typeOfProp === 'string') return isAscending ? compObj1.localeCompare(compObj2) : compObj2.localeCompare(compObj1);

          return isAscending ? compObj1 - compObj2 : compObj2 - compObj1;
}

const read_prop = (obj, prop) => {
          return obj[prop];
};
        
const convertObj = (inputData, conversionType) => {
          switch (conversionType) {
                    case "date":
                              return new Date(inputData);
                              break;
                    case "number":
                              return Number(inputData);
                              break;
                    default:
                              return inputData;
          }
};