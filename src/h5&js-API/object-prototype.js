try {
    console.log(alert(asdf));
} catch (e) {
    console.log(e);
} finally {
    console.log('finally');
}
var obj = {};
obj.attribute = 'trash';
console.log(obj.__proto__);
console.log(Object.prototype);
console.log(obj.__proto__ === Object.prototype);

function Dog(name) {
    this.name = name;
}

Dog.prototype.callName = function() {
    console.log(this.name, 'wangwang');
}

let dog = new Dog("Three SBs");
dog.printName = function() {
    console.log(this.name);
}
dog.callName();
dog.printName();

console.log(s);
var s = 1;

var b;
console.log(b);
b = 2;

var a = {
    name: 'A',
    fn: function() {
        console.log(this.name);
    }
}
a.fn(); //A

a.fn.call({ name: 'B' }); //B

var fn1 = a.fn;
fn1(); //undefined

var name = "C";
fn1(); //C