var student = {
    name: "crys",
    age: 12,
    showInfo: function (){
        console.log(this, this.name, this.age);
        function test2(){
            console.log("test2", this)
        }
        test2(); // this = window đối vs es5
        test2(); // this = undefined đối vs es6

    }
}

student.showInfo; // this = student
function test(){

}

// window: global object
// var a = 10;
 //cosole.log(a, window.a);
 test(); // => sinh ra this



 // SCOPE: là phạm vi truy cập của biến global scope vs function scope (local scope)
 

 var a = 10;
 var b = 20;

 function test (){
    var d = 10;
    console.log(d);
    console.log(a);

 }
 // biến ở function nào thì dùng ở function đó

 function test2 (){
    var d = 20;
 }
 text();

// Function con thì có thể truy cập tới biến của function cha, nhưng k có ngược lại
 // Lexical scope: nơi định nghĩa ra function sẽ quyết định các biến function đó đc phép dùng
var e = 15;
function test3(){
    console.log(e);
}
test3();

function test4(){
    var f = 18;
    function test5(){
        console.log(f);
    }
    test5();
}

var k = 12;
function test7(){
    console.log(k);
}

function test8(){
    var k = 20;
    test7();
}
test8(); // k = 12


// Dynamic scope (this): nơi chạy function sẽ quyết định this là cái gì
function test9(){
   console.log(this);
}
test9(); // this = window

var obj = {
    name: "crys",
    age: 12,
    test: test9,
};
obj.test() // this = obj
