export const sort = ({inputList, objectProp, typeOfProp, conversionRequired = false, isAscending = true, isNewCopyOfArr}) => {
          if(inputList === null || inputList === undefined) return inputList;
          if(isNewCopyOfArr) return inputList.slice().sort((obj1, obj2) => convertAndSortInput(conversionRequired, objectProp, obj1, obj2, typeOfProp, isAscending));
          
          return inputList.sort((obj1, obj2) => convertAndSortInput(conversionRequired, objectProp, obj1, obj2, typeOfProp, isAscending));
};

const convertAndSortInput = (conversionRequired, objectProp, obj1, obj2, typeOfProp, isAscending) => {
          let compObj1 = conversionRequired ? convertObj(read_prop(obj1, objectProp), typeOfProp) : read_prop(obj1, objectProp) ;
          let compObj2 = conversionRequired ? convertObj(read_prop(obj2, objectProp), typeOfProp) : read_prop(obj2, objectProp) ;

          if(typeOfProp === 'string') return isAscending ? compObj1.localeCompare(compObj2) : compObj2.localeCompare(compObj1);
          if(typeOfProp === 'boolean') return (compObj1===compObj2) ? 0 : compObj1 ? -1 : 1;
          if(typeOfProp === 'number') return  isAscending ? (Number(compObj1) > Number(compObj2)? 1 : -1) : (Number(compObj1) > Number(compObj2)? -1 : 1);

          return isAscending ? compObj1 - compObj2 : compObj2 - compObj1;
}

const read_prop = (obj, prop) => {
          let nestedProps = prop.split('.');
          let returnValue;
           nestedProps.forEach((inprop, index) => {
                    obj = obj[nestedProps[index]];
                    if(index === nestedProps.length-1) returnValue = obj
          });
          return returnValue;
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