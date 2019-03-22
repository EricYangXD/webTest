const fucArr = [
    next => {
        setTimeout(() => {
            console.log(1);
            next()
        }, 300)
    },
    next => {
        setTimeout(() => {
            console.log(2);
            next()
        }, 200)
    },
    next => {
        setTimeout(() => {
            console.log(3);
            next()
        }, 100)
    }
]

// var run = arr => {

// }
// 实现一个run方法,使得run(fucArr)能顺序输出1、2、3.


// 1
// var run = arr => {
//     if (arr.length === 0) return;
//     arr[0](() => {
//         run(arr.slice(1));
//     });
// }

// 2
// var run = arr => {
//     const trigger = () => {
//         if (arr.length === 0) return;
//         arr.shift()();
//     };
//     arr = arr.map(val => {
//         return () => val(trigger);
//     });
//     trigger();
// }

// 3
// var run = arr => {
//     const trigger = () => {
//         if (arr.length === 0) return;
//         arr.shift()();
//     };
//     arr = arr.map(val => {
//         return val.bind(null, trigger);
//     });
//     trigger();
// }

// 4
var run = arr => {
    const trigger = () => {
        if (arr.length === 0) return;
        arr.shift()();
    };
    arr = arr.map(val => {
        return () => new Promise(resolve => {
            val(resolve);
        }).then(trigger);
    });
    trigger();
}
// 以上4种方法的输出
run(fucArr);


// 5
// 稍微修改一下输入
// 首先给 applymiddleware（以下简称amw）一个简单的定义，
// amw是接收若干个函数作为参数，最终会返回一个函数，
// 这个函数调用，会按照顺序，依次执行前面作为参数传入的函数。
const fucArr = [
    next => action => {
        setTimeout(() => {
            console.log(action++);
            next(action)
        }, 300)
    },
    next => action => {
        setTimeout(() => {
            console.log(action++);
            next(action)
        }, 200)
    },
    next => action => {
        setTimeout(() => {
            console.log(action++);
            next(action)
        }, 100)
    }
]

var run = arr => {
    var reduceResult = arr.reduce((pre, next) => (...arg) => pre(next(...arg)));
    return reduceResult(() => {});
}
run(fucArr)(1);


// Currying
function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = [].slice.call(arguments);
    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var adder = function () {
        var _adder = function () {
            [].push.apply(_args, [].slice.call(arguments));
            return _adder;
        };
        // 利用隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
        _adder.toString = function () {
            return _args.reduce(function (a, b) {
                return a + b;
            });
        }
        return _adder;
    }
    return adder.apply(null, [].slice.call(arguments));
}
add(1, 2, 3);
add(1)(2)(3);