### 深入理解js构造函数 ###
#### JavaScript对象的创建方式 ####

    在JavaScript中，创建对象的方式包括两种：对象字面量和使用new表达式。对象字面量是一种灵活方便的书写方式，例如：

    var o1 = {
        p:"I’m in Object literal",
        alertP:function(){
            alert(this.p);
        }
    }

    这样，就用对象字面量创建了一个对象o1，它具有一个成员变量p以及一个成员方法alertP。这种写法不需要定义构造函数，因此不在本文的讨论范围之内。这种写法的缺点是，每创建一个新的对象都需要写出完整的定义语句，不便于创建大量相同类型的对象，不利于使用继承等高级特性。

    new表达式是配合构造函数使用的，例如new String("a string")，调用内置的String函数构造了一个字符串对象。下面我们用构造函数的方式来重新创建一个实现同样功能的对象，首先是定义构造函数，然后是调用new表达式：

    function CO(){
        this.p = "I’m in constructed object";
        this.alertP = function(){
            alert(this.p);
        }
    }
    var o2 = newCO();

    那么，在使用new操作符来调用一个构造函数的时候，发生了什么呢？其实很简单，就发生了四件事：

    var obj  ={};
    obj.__proto__ = CO.prototype;
    CO.call(obj);
    return obj;

    第一行，创建一个空对象obj。

    第二行，将这个空对象的__proto__成员指向了构造函数对象的prototype成员对象，这是最关键的一步，具体细节将在下文描述。

    第三行，将构造函数的作用域赋给新对象，因此CA函数中的this指向新对象obj，然后再调用CO函数。于是我们就给obj对象赋值了一个成员变量p，这个成员变量的值是” I’min constructed object”。

    第四行，返回新对象obj。当构造函数里包含返回语句时情况比较特殊，这种情况会在下文中说到。

#### 正确定义JavaScript构造函数 ####

    不同于其它的主流编程语言，JavaScript的构造函数并不是作为类的一个特定方法存在的；当任意一个普通函数用于创建一类对象时，它就被称作构造函数，或构造器。一个函数要作为一个真正意义上的构造函数，需要满足下列条件：

    1、 在函数内部对新对象（this）的属性进行设置，通常是添加属性和方法。

    2、 构造函数可以包含返回语句（不推荐），但返回值必须是this，或者其它非对象类型的值。

    上文定义的构造函数CO就是一个标准的、简单的构造函数。下面例子定义的函数C1返回了一个对象，我们可以使用new表达式来调用它，该表达式可以正确返回一个对象：

    function C1(){
        var o = {
            p:"I’m p in C1.",
            q:"I’m nothing."
        }
        return o;
    }
    var o1 = new C1();
    alert(o1.p);//I’m p in C1

    但这种方式并不是值得推荐的方式，因为对象o1的原型是函数C1内部定义的对象o的原型，也就是Object.prototype。这种方式相当于执行了正常new表达式的前三步，而在第四步的时候返回了C1函数的返回值。该方式同样不便于创建大量相同类型的对象，不利于使用继承等高级特性，并且容易造成混乱，应该摒弃。

    一个构造函数在某些情况下完全可以作为普通的功能函数来使用，这是JavaScript灵活性的一个体现。下例定义的C2就是一个“多用途”函数：

    function C2(a, b){
        this.p = a + b;
        this.alertP = function(){
            alert(this.p);
        }
        return this.p;//此返回语句在C2作为构造函数时没有意义
    }
    alert(C2(9,8));//17
    var c2 = new C2(2,3);
    c2.alertP();//5
    alert(c2.p);//5
    alert(C2(2,3));//5

    该函数既可以用作构造函数来构造一个对象，也可以作为普通的函数来使用。用作普通函数时，它接收两个参数，并返回两者的相加的结果。为了代码的可读性和可维护性，建议作为构造函数的函数不要掺杂除构造作用以外的代码；同样的，一般的功能函数也不要用作构造对象。

### 推荐的方式——构造与原型混合模式创建对象 ###
    我们结合原型模式在共享方法属性以及构造函数模式在实例方法属性方面的优势，使用以下的方法创建对象：

    //我们希望每个stu拥有属于自己的name和age属性
    function Student(name, age) {
    this.name = name;
    this.age = age;
    }

    //所有的stu应该共享一个alertName()方法
    Student.prototype = {
    constructor : Student,
    alertName : function() {
                    alert(this.name);
                }
    }

    var stu1 = new Student("Jim", 20);
    var stu2 = new Student("Tom", 21);

    stu1.alertName();  //Jim  实例属性
    stu2.alertName();  //Tom  实例属性

    alert(stu1.alertName == stu2.alertName);  //true  共享函数

    以上，在构造函数中定义实例属性，在原型中定义共享属性的模式，是目前使用最广泛的方式。通常情况下，我们都会默认使用这种方式来定义引用类型变量。

#### 为什么要使用构造函数 ####
    执行var o2 = new CO();创建对象的时候，发生了四件事情：

    var obj  ={};
    obj.__proto__ = CO.prototype;
    CO.call(obj);
    return obj;

    我们说最重要的是第二步，将新生成的对象的__prop__属性赋值为构造函数的prototype属性，使得通过构造函数创建的所有对象可以共享相同的原型。这意味着同一个构造函数创建的所有对象都继承自一个相同的对象，因此它们都是同一个类的对象。
    在JavaScript标准中，并没有__prop__这个属性，不过它现在已经是一些主流的JavaScript执行环境默认的一个标准属性，用于指向构造函数的原型。该属性是默认不可见的，而且在各执行环境中实现的细节不尽相同，例如IE浏览器中不存在该属性。我们只要知道JavaScript对象内部存在指向构造函数原型的指针就可以了，这个指针是在调用new表达式的时候自动赋值的，并且我们不应该去修改它。
    在构造对象的四个步骤中，我们可以看到，除第二步以外，别的步骤我们无须借助new表达式去实现，因此new表达式不仅仅是对这四个步骤的简化，也是要实现继承的必经之路。

#### 容易混淆的地方 ####
    关于JavaScript的构造函数，有一个容易混淆的地方，那就是原型的constructor属性。在JavaScript中，每一个函数都有默认的原型对象属性prototype，该对象默认包含了两个成员属性：constructor和__proto__。关于原型的细节就不在本文赘述了，我们现在关心的是这个constructor属性。
    按照面向对象的习惯性思维，我们说构造函数相当于“类”的定义，从而可能会认为constructor属性就是该类实际意义上的构造函数，在new表达式创建一个对象的时候，会直接调用constructor来初始化对象，那就大错特错了。new表达式执行的实际过程已经在上文中介绍过了（四个步骤），其中用于初始化对象的是第三步，调用的初始化函数正是“类函数”本身，而不是constructor。如果没有考虑过这个问题，这一点可能不太好理解，那就让我们举个例子来说明一下吧：
    function C3(a, b){
        this.p = a + b;
        this.alertP = function(){
            alert(this.p);
        }
    }
    //我们定义一个函数来覆盖C3原型中的constructor，试图改变属性p的值
    function fake(){
        this.p = 100;
    }
    C3.prototype.constructor = fake; //覆盖C3原型中的constructor
    var c3 = new C3(2,3);
    c3.alertP();//结果仍然为5

    上述代码手动改变了C3原型中的constructor函数，然而却没有对c3对象的创建产生实质的影响，可见在new表达式中，起初始化对象作用的只能是构造函数本身。那么constructor属性的作用是什么呢？一般来说，我们可以使用constructor属性来测试对象的类型：

    var myArray = [1,2,3];
    (myArray.constructor == Array); // true

    这招对于简单的对象是管用的，涉及到继承或者跨窗口等复杂情况时，可能就没那么灵光了：

    function f() { this.foo = 1;}
    function s() { this.bar = 2; }
    s.prototype = new f(); // s继承自f

    var son = new s(); // 用构造函数s创建一个子类对象
    (son.constructor == s); // false
    (son.constructor == f); // true

    这样的结果可能跟你的预期不相一致，所以使用constructor属性的时候一定要小心，或者干脆不要用它。

引用地址：http://www.2cto.com/kf/201402/281841.html

#### 一个JS题目 ####
    function Foo(){
        getName=function(){
            alert(1);
        }
        return this;
    }
    Foo.getName=function(){
        alert(2);
    }
    Foo.prototype.getName=function(){
        alert(3);
    }
    var getName=function(){
        alert(4);
    }
    function getName(){
        alert(5);
    }

    Foo.getName();//2  -->Foo()上存储的静态属性
    getName();//4  -->变量定义提升
    Foo().getName();//1  -->初始化Foo()函数，this指向window，getName是全局变量，向上查找getName，并将原来的值覆盖为1
    getName();//1  -->全局变量污染
    new Foo.getName();//2  -->运算符优先级，实际执行：new (Foo.getName)()
    new Foo().getName();//3  -->实际执行：(new Foo()).getName()，构造函数返回值问题，在这里返回的是实例化对象，由于构造函数没有为实例化对象添加任何属性，所以从当前对象的原型对象(prototype)中寻找getName
    new new Foo().getName();//3  -->实际执行：new ((new Foo()).getName)()

#### 柯里化 Currying####
> 柯里化，即Currying，可以使函数变得更加灵活。我们可以一次性传入多个参数调用它；也可以只传入一部分参数来调用它，让它**返回一个函数**去处理剩下的参数。

    var add=function(x){
        return function(y){
            return x+y;
        };
    };
    console.log(add(1)(1)); // 输出2
    var add1=add(1);
    console.log(add1(1)); // 输出2
    var add10=add(10);
    console.log(add10(1)); // 输出11

* 代码中，我们可以一次性传入2个1作为参数add(1)(1)，也可以传入1个参数之后获取add1与add10函数，这样使用起来非常灵活。

#### apply, call与bind方法 ####
> JavaScript开发者有必要理解apply、call与bind方法的不同点。它们的共同点是第一个参数都是this，即函数运行时依赖的上下文。
三者之中，call方法是最简单的，它等价于指定this值调用函数：

    var user = {
        name: "Rahul Mhatre",
        whatIsYourName: function() {
            console.log(this.name);
        }
    };
    user.whatIsYourName(); // 输出"Rahul Mhatre",
    var user2 = {
        name: "Neha Sampat"
    };
    user.whatIsYourName.call(user2); // 输出"Neha Sampat"
    apply方法与call方法类似。两者唯一的不同点在于，apply方法使用数组指定参数，而call方法每个参数单独需要指定：

    apply(thisArg, [argsArray])
    call(thisArg, arg1, arg2, …)
    var user = {
        greet: "Hello!",
        greetUser: function(userName) {
            console.log(this.greet + " " + userName);
        }
    };
    var greet1 = {
        greet: "Hola"
    };
    user.greetUser.call(greet1, "Rahul"); // 输出"Hola Rahul"
    user.greetUser.apply(greet1, ["Rahul"]); // 输出"Hola Rahul"
    使用bind方法，可以为函数绑定this值，然后作为一个新的函数返回：

    var user = {
        greet: "Hello!",
        greetUser: function(userName) {
        console.log(this.greet + " " + userName);
        }
    };
    var greetHola = user.greetUser.bind({greet: "Hola"});
    var greetBonjour = user.greetUser.bind({greet: "Bonjour"});
    greetHola("Rahul") // 输出"Hola Rahul"
    greetBonjour("Rahul") // 输出"Bonjour Rahul"

#### Memoization ####
> Memoization用于优化比较耗时的计算，通过将计算结果缓存到内存中，这样对于同样的输入值，下次只需要中内存中读取结果。

    function memoizeFunction(func){
        var cache = {};
        return function(){
            var key = arguments[0];
            if (cache[key]){
                return cache[key];
            }else{
                var val = func.apply(this, arguments);
                cache[key] = val;
                return val;
            }
        };
    }
    var fibonacci = memoizeFunction(function(n){
        return (n === 0 || n === 1) ? n : fibonacci(n - 1) + fibonacci(n - 2);
    });
    console.log(fibonacci(100)); // 输出354224848179262000000
    console.log(fibonacci(100)); // 输出354224848179262000000
    代码中，第2次计算fibonacci(100)则只需要在内存中直接读取结果。

#### 函数重载 ####
>所谓函数重载(method overloading)，就是函数名称一样，但是输入输出不一样。或者说，允许某个函数有各种不同输入，根据不同的输入，返回不同的结果。凭直觉，函数重载可以通过if…else或者switch实现，这就不去管它了。jQuery之父John Resig提出了一个非常巧(bian)妙(tai)的方法，利用了闭包。
> 从效果上来说，people对象的find方法允许3种不同的输入: 0个参数时，返回所有人名；1个参数时，根据firstName查找人名并返回；2个参数时，根据完整的名称查找人名并返回。
难点在于，people.find只能绑定一个函数，那它为何可以处理3种不同的输入呢？它不可能同时绑定3个函数find0,find1与find2啊！这里的关键在于old属性。
> 由addMethod函数的调用顺序可知，people.find最终绑定的是find2函数。然而，在绑定find2时，old为find1；同理，绑定find1时，old为find0。3个函数find0,find1与find2就这样通过闭包链接起来了。
根据addMethod的逻辑，当f.length与arguments.length不匹配时，就会去调用old，直到匹配为止。

    function addMethod(object, name, f){
        var old = object[name];
        object[name] = function(){
            // f.length为函数定义时的参数个数
            // arguments.length为函数调用时的参数个数
            if (f.length === arguments.length){
                return f.apply(this, arguments);
            }else if (typeof old === "function"){
                return old.apply(this, arguments);
            }
        };
    }
    // 不传参数时，返回所有name
    function find0(){
        return this.names;
    }
    // 传一个参数时，返回firstName匹配的name
    function find1(firstName){
        var result = [];
        for (var i = 0; i < this.names.length; i++){
            if (this.names[i].indexOf(firstName) === 0){
                result.push(this.names[i]);
            }
        }
        return result;
    }
    // 传两个参数时，返回firstName和lastName都匹配的name
    function find2(firstName, lastName){
        var result = [];
        for (var i = 0; i < this.names.length; i++){
            if (this.names[i] === (firstName + " " + lastName)){
                result.push(this.names[i]);
            }
        }
        return result;
    }
    var people = {
        names: ["Dean Edwards", "Alex Russell", "Dean Tom"]
    };
    addMethod(people, "find", find0);
    addMethod(people, "find", find1);
    addMethod(people, "find", find2);
    console.log(people.find()); // 输出["Dean Edwards", "Alex Russell", "Dean Tom"]
    console.log(people.find("Dean")); // 输出["Dean Edwards", "Dean Tom"]
    console.log(people.find("Dean", "Edwards")); // 输出["Dean Edwards"]
