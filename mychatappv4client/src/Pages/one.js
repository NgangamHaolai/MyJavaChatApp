
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

// Check if a no. is a strong no.
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

let x1 = ()=>
{
    console.log("parent()");
    let y1 = ()=>
    {
        console.log("child()");
        let z1 = ()=>
        {
            console.log("inner child()");
        }
        z1();
    }
    y1();
}
x1();

let x2 = 10;
let a2 = ()=>
{
    console.log(x2);    // 10
    let b2 = ()=>
    {
        let y2 = 20;
        console.log(y2);    // 20
        console.log(x2);    // 10
    }
    b2();
}
a2();

// JavaScript Corrying/curring
let data = ()=>
{
    console.log("parent");
    return function data2()
    {
        console.log("this is data2");
        return function data3()
        {
            console.log("this is data3");
        }
    }
}
data()()()

function counter()
{
    let count=0;
    return function increment()
    {
        count++;
        console.log("C:",count);  
        return function decrement()
        {
            count--;
            console.log("c:",count);
        }
    }
}
let data1 = counter()
data1 = counter()
console.log("data1:",data1);
// data1()  // calls increment once
// data1()  // calls increment twice
// data1()  // calls increment thrice
data1()()   // calls increment -> decrement

function counter2()
{
    let count=0;
    let increment = ()=>
    {
        count++;
        console.log(count);
    }
    let decrement = ()=>
    {
        count--;
        console.log(count);
    }
    return {increment,decrement}
}
let data2 = counter2()
console.log(data2.increment(), data2.decrement());
data2.increment
data2.decrement

function multiplier(number)
{
    return function factorial(factor)
    {
        return number*factor;
    }
}
let double = multiplier(5)
console.log(double(2));
let triple = multiplier(10)
console.log(triple(3));

// How to make private varibales

let str1 = "hello world";
let str2 = 'hello world again in single-quotes';
let str3 = `hello hello world again in back-ticks : ${str1}`;   // String interpolation
console.log(str1); console.log(typeof str1);
console.log(str2); console.log(typeof str2);
console.log(str3); console.log(typeof str3);

let str4 = new String("hello world using new-keyword");
console.log(str4); console.log(typeof str4);

let str5 = String("hello world using String constructor")
console.log(str5); console.log(typeof str5);

// let str6 = "hello world";
// console.log(str6[10]);
// console.log(str6.length);
// for(let i=0; i<str.length; i++)
//     console.log(str6[i]);
// Taking user prompt
// let str6 = prompt('Enter the String');
// function reverse(str6)
// {
//     for(let i=str6.length-1; i>=0; i--)
//         console.log('str[',i,']',str6[i]);
// }
// reverse("hello world");

// Find the factorial of 5
let n4 = 5;
let fact = 1;
for(let i=1; i<=n4; i++)
{
    fact = fact*i;
}
console.log(`factorial of ${n4} is: `,fact);

// Count the no. of digits in a no.
let n5 = 12345;
let count = 0;
while(n5>0)
{
    count++;
    n5 = Math.floor(n5/10);
}
console.log("count is:",count);

// Check prime no. between 1-20
for(let i=1; i<=20; i++)
{
    let prime = true;
    for(let j=2; j<=i/2; j++)
    {
        if(i%j===0)
        {
            prime=false;
            break;
        }
    }
    if(prime)
        console.log(i);
}

// WAP to calculate the final saalry category based on:
// 1. Basic salary
// 2. Experience in years
// 3. Performance rating (1-5)

// WAP that takes a students marks 0-100 and prints the grade on following conditions:
// 90 and above - A grade
// 75 - 89 - B grade
// 60 - 74 - C grade
// 40 - 59 - D grade
// below 40 - Fail

// WAP that determines fixed result based on Marks 0 to 100, attendance based on percentage, has projects (true) or (false)
// if marks < 35 Fail
// if marks >= 35:
    // i) if attendence < 75% Fail
    // ii) if attendence >=75%:
        // if marks >=90 and and has project "outstanding with project"

    
    let str16 = "Hello world";  // all to uppercase
    let arr10 = str16.split("");
    let res10 = arr10.map(x=>x.toUpperCase());
    let res1010 = res10.join("");
    console.log(res1010);

    let arr18 = [4,3,2,1];  // convert to string
    arr18.map(x=>{
        console.log(x.toString());
    });
    
    let arr17 = ["hi", "hello"] // find length of each
    arr17.map(x=>{
        console.log(x.length);
    });

    let arr19 = [1,2,3,4,5];
    arr19.map(x=>
    {
        x%2==0 ? console.log("double:",x*x) : console.log(x);
    });

    // Reverse each word in a sTring.
    let s
    // replace the odd no. with 0 in an array.
    // multilpy the no. by its index.
    // add the previous element.
    // repeat each word by its length
    // extract the first letter of each word.
    // reverse only words with length greater than 3

    let str17 = " Hell ";
    let str18 = 'hello world again in single-quotes';
    let str19 = `hello hello world again in back-ticks hello :: ${str17}`;
    console.log("******");
    console.log(str19.slice(-3));
    console.log(str19.substring(-3));
    console.log(str18.split(''));
    console.log(str17.trimEnd().length);
    console.log(str17.trimStart().length);
    console.log(str17.trim().length);
    let str20 = new String("Bye bye");
    console.log(typeof(str20));
    let str21 = str20.toString();
    console.log(typeof(str21));
    let arr20 = [1,2,3,4,5];
    let res20 = arr20.map(x=>x>2);
    let res21 = arr20.filter(x=>x>3)
    let res22 = arr20.reduce((accu,curr)=>accu+curr);
    arr20.forEach(x=>console.log("->",x));
    console.log(res20);
    console.log(res21);
    console.log(res22);
    let s20 = 20;
    let test = function()
    {
        let s20 =  10;
        console.log(s);
    }
    test();

    // (function()
    // {
    //     let f2=()=>
    //     {
    //         console.log("f2")
    //     }
    //     f2();
    //     console.log("f1")
    // })()   
    
    (function()
    {
        let s = "secret"
        function f2(secret) 
        {
            console.log(secret)
        }
        f2(s);
    })();

    // let operation1 = (a,b,operator)=>{
    //     return operator(a,b);
    // }
    // let operator = (a,b)=>a+b;

    // console.log(operation1(10,20,(a,b)=>a+b));
    console.log(operation(10,20,(a,b)=>a+b));
    
    let obj = {
        "name": "John",
        "age": 30,
        "city": "New York",
        "skills": ["JavaScript", "React", "Node.js"],
        "address": {
            "street": "123 Main St",
            "zip": "10001"
        },
        data:function(){
            console.log("This is a method inside the object");
        },
        job: ()=>{
            console.log("MMA Fighter");
        },
        passion(){
            console.log("Movies and Chocolate");
        },
        obj:{
            firstname: "John",
            'lastname': "Doe",
        }
    }
    console.log(obj);
    obj.skills.map(x=>console.log(x));
    obj.data();
    obj.job();
    obj.passion();
    console.log(obj.obj.lastname);
    
let age = 100;
let obj2 = {
    age: 30,
    data:function(){
        console.log(this.age);
    },
    getAge: ()=>{
        console.log(this.age);
    }
}

let obj3={
    a:10,
    b:20,
    c:30
}
// it does not change original array it returns nested array
let data3 = Object.entries(obj3);
console.log("data3",data3);
// checking original array object
console.log(obj3);
// changing the indexing
data3[0][0]="d"
console.log("data3:",data3);

// it does not change original object
// it converts array back to object ki
// it returns new Object
obj3 = Object.fromEntries(data3)
console.log(obj3);

// let obj4={
//     a:200,b:300
// }
// Object.freeze(obj4)  // freeze()
// obj4.a=100;
// console.log("obj4:",obj4);

// let obj5={ a:"100", b:"200"}
// Object.seal(obj5)   // seal()
// // can't add can't delete can only modify
// delete obj5.a;
// obj5.a="String"
// console.log("obj5",obj5);

let car={
    "name": "BMW",
    prive:1000,
    speed:"100km/hr"
}
let car2={...car,
    color:"blue"
}
console.log("car2",car2)
let arr6=['this','is'];
let [a,b]=arr //desctructuring
let arr7=[...arr6,"js"]
console.log("arr7",arr7);

let arr8=[1,2,3,4,5]
let arr9=[...arr8]
console.log("arr9",arr9);
