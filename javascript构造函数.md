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

    new表达式是配合构造函数使用的，例如new String(“a string”)，调用内置的String函数构造了一个字符串对象。下面我们用构造函数的方式来重新创建一个实现同样功能的对象，首先是定义构造函数，然后是调用new表达式：

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
