// Sort array
let array = [5,3,8,7,2,4,1];
let sortedArray = array.sort((a,b)=>a-b);
console.log('sorted array: ',sortedArray);

// WITH REDUCE METHODS.....
// 1. Reverse a String
let str11 = "Hello World";
let reversedString = str11.split('').reduce((rev, ch)=>
    ch + rev, '');
console.log('reversed string: ',reversedString);

// 2. Check if a String is a Palindrome
let str12 = "madam mosielle";
let res = str12.split('').reduce((prev, curr)=>
    curr + prev, '');
if(res===str12)
    console.log("Palindrome");
console.log('result: ',res);
// using reverse() method
res = str12.split("").reverse().join("");
console.log("reversed:",res)

// 3.Find Largest no. in an Array.
let arr13 = [1,2,3,4,8,7,6];
let largest = arr13.reduce((prev,curr)=>
{
    return prev > curr ? prev : curr;
});
console.log('largest no. : ',largest);
// using naive method
for(let i=0; i<arr13.length; i++)
{
    if(arr13[i] > largest)
        largest = arr13[i];
}
console.log('MAX:',largest);
// using Math.max()
largest = Math.max(...arr13);
console.log("max:",largest)

// 4. Find the occurence of each character
let str10 = "HelloWorld";
let occurence = str10.split("").reduce((prev,curr)=>
{
    prev[curr] = (prev[curr] || 0) + 1;
    return prev;
}, {});
console.log('occurence: ',occurence);
// naive way but I understand this one better.
// count each character in a string
let str =  "Programming";
let storage = {};
for(let i=0; i<str10.length; i++)
{
    if(storage[str[i]])
        storage[str[i]]++;
    else
        storage[str[i]] = 1;
}
console.log("count:",storage)

// 5. Remove duplicates from an array
let arr11 = [1,1,2,4,5,5,6];    // my way
for(let i=0; i<arr11.length; i++)
{
    for(let j=i+1; j<arr11.length; j++)
    {
        if(arr11[i]===arr11[j] && arr11[j]!== Number.MAX_VALUE)
            arr11[j] = Number.MAX_VALUE;
    }
}
let result = [];   
let j = 0;
for(let i=0; i<arr11.length; i++)
{
    if(arr11[i]!==Number.MAX_VALUE)
    {
        result[j++] = arr11[i];
    }
}
console.log(arr11);
console.log(result);
// using reduce
arr11 = [1,1,2,3,4,8,3,7,6];
const res11 = arr11.reduce((acc,curr)=>
{
    if(!acc.includes(curr))
        acc.push(curr);
    return acc;
}, [])
console.log('reduced: ',res11);
// using filter
const res12 = arr11.filter((item,index)=>
{
    return arr11.indexOf(item)===index;
});
console.log("filtered:",res12);
// remove duplicates from an array naive way(teacher)
let arr = [1,2,3,4,5,4,5,6,6];
for(let i=0; i<arr.length; i++)
{
    for(let j=i+1; j<arr.length; j++)
    {
        if(arr[i]===arr[j])
        {
            for(let k=j; k<arr.length-1; k++)
            {
                arr[k]=arr[k+1];
            }
            arr.length--;
            j--;
        }
    }
}
console.log('removed duplicates: ', arr);
// using includes()
let unique = [];
for(let i=0; i<arr.length; i++)
{
    if(!unique.includes(arr[i]))
        unique.push(arr.push[i]);
}
console.log('removed duplicates: ',arr);

// 6. Sum of array elements
let arr14 = [1,1,2,4,5,5,6];
let res14 = arr14.reduce((acc,curr)=>   // using reduce()
{
    return acc+curr;
});
console.log("sum:",res14)
// sum of an array
let arr2 = [1,2,3,4,5];
let sum = 0;
for(let i=0; i<arr2.length; i++)
{
    sum = sum + arr2[i];
}
console.log('Sum is: ',sum);

// 7. Merge two arrays
let arr_1 = [1,2,3,4];
let arr_2 = [5,6,7,8];

let merged = (arr_1.concat(arr_2)); // using concat()
console.log('Merged: ',merged);

merged = [...arr_1, ...arr_2];  // using spread operator
console.log('Merged: ',merged);

// 8. Find second largest from an Array
let arr15 = [1,2,3,45,5100,5,5];
let res15 = arr15.sort((a,b)=>b-a)
console.log(res[1])

// Check is a no. is a strong no.
let n = 145;
let m = n;
let sum2 = 0;
while(n>0)
{
    let k=n%10;
    let val = 1;
    while(k>0)
    {
        val = val*k;
        k--;
    }
    sum2 = sum2 + val;
    n=Math.floor(n/10);
}
if(sum2===m) console.log("Strong number")
    
// check whether a no. is an Armstrong no.
let n1 = 407;
let n2 = n1;
let n3 = n1;
let count1 = 0
let sum1 = 0;
while(n2>0)
{
    count1++;
    n2 = Math.floor(n2/10);
}
console.log("kk",count1);

while(n3>0)
{
    let k = n3%10;
    let val = 1;
    let c = count1;
    while(c>0)
    {
        val = val*k;
        c--;
    }
    sum1 = sum1+val;
    n3 = Math.floor(n3/10);
}
if(n1===sum1) console.log('Armstrong no. it is:',sum1);

// Print the even no.s from 1-20
for(let i=1; i<=20; i++)
{
    if(i%2===0)
        console.log(i)
}

// Print the no.s from 10 to 1
for(let i=10; i>=1; i--)
    console.log(i)

// Print multiplication table of 5
for(let i=1; i<=10; i++)
    console.log("5 X ",i,"=",5*i)

// Higher Order Function
let add = (x,y)=>x+y;
let sub = (x,y)=>x-y;
let mul = (x,y)=>x*y;
let operation = (x,y,operator)=>
{
    return operator(x,y);
}
console.log('add',operation(2,2,add));
console.log('sub',operation(5,3,sub));
console.log('mul',operation(3,4,mul));

console.log('add2:',operation(2,2,(a,b)=>a+b));
console.log('sub2:',operation(5,3,(a,b)=>a-b));
console.log('mul2:',operation(3,4,(a,b)=>a*b));
