let a = [1,2,3,4,5];
let b = [4];
let filterArr = a.filter((flight) => {
          return  b.find((newObj) => newObj !== flight);
});
console.log(filterArr);

console.log([...filterArr,...b]);