class Api {
    constructor() {
        this.user = { id: 1, name: 'test' }
        this.friends = [this.user, this.user, this.user]
        this.photo = 'not a real photo'
    }
    getUser() {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.user), 200)
        })
    }
    getFriends(userId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.friends.slice()), 200)
        })
    }
    getPhoto(userId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.photo), 200)
        })
    }
    throwError() {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Intentional Error')), 200)
        })
    }
}


// 嵌套Promise
function callbackHell() {
    const api = new Api()
    let user, friends
    api.getUser().then(function(returnedUser) {
        user = returnedUser
        api.getFriends(user.id).then(function(returnedFriends) {
            friends = returnedFriends
            api.getPhoto(user.id).then(function(photo) {
                console.log('callbackHell', { user, friends, photo })
            })
        })
    })
}



// 链式Promise
function promiseChain() {
    const api = new Api()
    let user, friends
    api.getUser()
        .then((returnedUser) => {
            user = returnedUser
            return api.getFriends(user.id)
        })
        .then((returnedFriends) => {
            friends = returnedFriends
            return api.getPhoto(user.id)
        })
        .then((photo) => {
            console.log('promiseChain', { user, friends, photo })
        })
}
// Promise的最佳特性之一，就是可以在then回调函数中，return一个新的Promise，这样就可以将这些Promise链接起来，只有一层嵌套。链式Promise比嵌套Promise简单很多，但是还是很多冗余。


// Async/Await
// 不使用回调函数可以吗？当然可以！使用Async/Await的话，7行代码就可以搞定。
async function asyncAwaitIsYourNewBestFriend() {
    const api = new Api()
    const user = await api.getUser()
    const friends = await api.getFriends(user.id)
    const photo = await api.getPhoto(user.id)
    console.log('asyncAwaitIsYourNewBestFriend', { user, friends, photo })
}
// 使用await关键词时，赋值操作将等到异步操作结束时才进行。这样，看起来与同步代码无异，实际执行事实上是异步的。


// 2. 简化循环
// Async / Await可以让一些复杂操作， 比如循环变得简单。 例如， 当我们需要获取某个user的所有friends的friends列表， 应该怎样操作呢？
// 使用Promise
function promiseLoops() {
    const api = new Api()
    api.getUser()
        .then((user) => {
            return api.getFriends(user.id)
        })
        .then((returnedFriends) => {
            const getFriendsOfFriends = (friends) => {
                if (friends.length > 0) {
                    let friend = friends.pop()
                    return api.getFriends(friend.id)
                        .then((moreFriends) => {
                            console.log('promiseLoops', moreFriends)
                            return getFriendsOfFriends(friends)
                        })
                }
            }
            return getFriendsOfFriends(returnedFriends)
        })
}
// 我们使用了递归函数getFriendsOfFriends来获取friends - of - friends， 知道friends数组为空。 如此简单的任务， 这样写显然过于复杂了。

// 使用Promise.all() 来实现的话， 则并非循环， 而是并发执行。

// 使用Async / Await
// This could be so much easier.
async function asyncAwaitLoops() {
    const api = new Api()
    const user = await api.getUser()
    const friends = await api.getFriends(user.id)

    for (let friend of friends) {
        let moreFriends = await api.getFriends(friend.id)
        console.log('asyncAwaitLoops', moreFriends)
    }
}
// 这时， 可以直接使用for循环来实现， 非常简单。

// 3. 简化并发
// 使用循环逐个获取friends - of - friends显然太慢， 采用并发方式更为简单。
// 使用Promise.all()来实现的话，则并非循环，而是并发执行。
async function asyncAwaitLoopsParallel() {
    const api = new Api()
    const user = await api.getUser()
    const friends = await api.getFriends(user.id)
    const friendPromises = friends.map(friend => api.getFriends(friend.id))
    const moreFriends = await Promise.all(friendPromises)
    console.log('asyncAwaitLoopsParallel', moreFriends)
}
// 为了实现并发， 只需要将Promise数组作为Promise.all() 的参数即可。 这样， 只需要await一个Promise， 而这个Promise会在所有并发操作结束时resolve。

// 4. 简化错误处理
// 使用回调函数处理Promise错误
function callbackErrorHell() {
    const api = new Api()
    let user, friends
    api.getUser().then(function(returnedUser) {
        user = returnedUser
        api.getFriends(user.id).then(function(returnedFriends) {
            friends = returnedFriends
            api.throwError().then(function() {
                console.log('Error was not thrown')
                api.getPhoto(user.id).then(function(photo) {
                    console.log('callbackErrorHell', { user, friends, photo })
                }, function(err) {
                    console.error(err)
                })
            }, function(err) {
                console.error(err)
            })
        }, function(err) {
            console.error(err)
        })
    }, function(err) {
        console.error(err)
    })
}
// 这样做非常糟糕， 代码非常冗余， 可读性也很差。

// 使用catch方法处理Promise错误
function callbackErrorPromiseChain() {
    const api = new Api()
    let user, friends
    api.getUser()
        .then((returnedUser) => {
            user = returnedUser
            return api.getFriends(user.id)
        })
        .then((returnedFriends) => {
            friends = returnedFriends
            return api.throwError()
        })
        .then(() => {
            console.log('Error was not thrown')
            return api.getPhoto(user.id)
        })
        .then((photo) => {
            console.log('callbackErrorPromiseChain', { user, friends, photo })
        })
        .catch((err) => {
            console.error(err)
        })
}
// 这样处理好多了，仅仅需要在Promise链的最后，使用catch方法处理所有错误。

// 使用Try/Catch处理Async/Await错误
async function aysncAwaitTryCatch() {
    try {
        const api = new Api()
        const user = await api.getUser()
        const friends = await api.getFriends(user.id)

        await api.throwError()
        console.log('Error was not thrown')

        const photo = await api.getPhoto(user.id)
        console.log('async/await', { user, friends, photo })
    } catch (err) {
        console.error(err)
    }
}
// 对于Async / Await代码， 使用Try / Catch即可处理， 和同步代码一样， 更加简单。

// 5. 简化代码组织

// 使用async关键词定义的函数都会返回Promise， 这样可以更方便地组织代码。
// 例如， 在之前的示例中， 我们可以将获取的user信息return， 而不是直接打印； 然后， 我们可以通过返回的Promise来获取user信息。
async function getUserInfo() {
    const api = new Api()
    const user = await api.getUser()
    const friends = await api.getFriends(user.id)
    const photo = await api.getPhoto(user.id)
    return { user, friends, photo }
}

function promiseUserInfo() {
    getUserInfo().then(({ user, friends, photo }) => {
        console.log('promiseUserInfo', { user, friends, photo })
    })
}

// 使用Async / Await语法， 则更加简单：
async function awaitUserInfo() {
    const { user, friends, photo } = await getUserInfo()
    console.log('awaitUserInfo', { user, friends, photo })
}

// 如何获取多个user的信息？
async function getLotsOfUserData() {
    const users = []
    while (users.length < 10) {
        users.push(await getUserInfo())
    }
    console.log('getLotsOfUserData', users)
}

// 如何并发？ 如何处理错误？
async function getLotsOfUserDataFaster() {
    try {
        const userPromises = Array(10).fill(getUserInfo())
        const users = await Promise.all(userPromises)
        console.log('getLotsOfUserDataFaster', users)
    } catch (err) {
        console.error(err)
    }
}


// var skills = ["HTML", "JAVA", "JavaScript", "PHP", "C++", "CSS"];
// var answer = [true, false, true, false, false, true];
// var addString = "",
//     removeString = "";
// var num = skills.length;
// while (num > 0) {
//     num--;
//     if (skills[num] == "JAVA" || skills[num] == "PHP" || skills[num] == "C++") {
//         removeString += skills[num] + " ";
//     } else {
//         addString += skills[num] + " ";
//     }
// }
// console.log("Must have skills: " + addString + ", but " + removeString + " not");
// var dict = [];
// // var dict = new Dictionary();
// skills.forEach(function(skill, index) {
//     dict[skill] = answer[index];
// });
// for (let i in dict) {
//     console.log(i + ":" + dict[i])
// }

{
    var name = "window";
    var object1 = {
        name: "obj",
        getName: function() {
            return function() {
                return this.name;
            };
        }
    }
    console.log(object1.getName()());
}