function makeInputVerifier(minimum, maximum) {
  // write your code here
  let min = minimum;
  let max = maximum;
console.log('aksjhdfjk')
    return (input) => {

console.log(input)
        if(input<min) return "Input is less than minimum value";
        if(input>max) return "Input is more than maximum value";
        if(input<=max && input>=min) return "Input is more than maximum value";
    }
}

function main() {

  const min = 10;
  const max = 20;
  const verify = makeInputVerifier(min, max);

  console.log(verify)
    
  const input = 15
  const result = verify(input);

 console.log(result)
}

main();