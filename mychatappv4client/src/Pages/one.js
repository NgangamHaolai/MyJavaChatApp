// count each character in a string
let str =  "Programming";
let count = {};
for(let i=0; i<str.length; i++)
{
    if(count[str[i]])
        count[str[i]]++;
    else
        count[str[i]] = 1
}
console.log(count);

// remove duplicates from an array
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

let unique = [];
for(let i=0; i<arr.length; i++)
{
    if(!unique.includes(arr[i]))
        unique.push(arr.push[i]);
}
console.log('removed duplicates: ',arr);

// sum of an array
let arr2 = [1,2,3,4,5];
let sum = 0;
for(let i=0; i<arr2.length; i++)
{
    sum = sum + arr2[i];
}
console.log('Sum is: ',sum);

// Merge two arrays
let arr_1 = [1,2,3,4];
let arr_2 = [5,6,7,8];

let merged = (arr_1.concat(arr_2)); // using concat()
console.log('Merged: ',merged);

merged = [...arr_1, ...arr_2];  // using spread operator
console.log('Merged: ',merged);

// Sort array
let array = [5,3,8,7,2,4,1];
let sortedArray = array.sort((a,b)=>a-b);
console.log('sorted array: ',sortedArray);

// WITH REDUCE METHODS.....
// 1. Reverse a String
let str11 = "Hello World";
let reversedString = str11.split(" ").reduce((rev, ch)=>
    ch + rev, " ");
console.log('reversed string: ',reversedString);

// 2. Check if a String is a Palindrome
let str12 = "madam";
let res = str12.split(" ").reduce((prev, curr)=>
    curr + prev, " ");
console.log('result: ',res);

// 3.Find Largest no. in an Array.
let arr13 = [1,2,3,4,8,7,6];
let largest = arr13.reduce((prev,curr)=>
{
    return prev > curr ? prev : curr;
});
console.log('largest no. : ',largest);

// 4. Find the occurence of each character
let str10 = "HelloWorld";
let occurence = str10.split("").reduce((prev,curr)=>
{
    prev[curr] = (prev[curr] || 0) + 1;
    return prev;
}, {});
console.log('occurence: ',occurence);

// 5. Remove duplicates from an array
// 6. Sum of array elements
// 7. Merge two arrays
// 8. Find second largest from an Array

// Check is a no. is a strong no.
let num = 123;
while(n>0)
{
    
}