---
title: Promise总结(二)
author: Licodeao
publishDate: "2022-4-02"
img: /assets/articles/javascript.jpeg
img_alt: Promise总结(二)
description: |
  Promise总结(二)
categories:
  - ECMAScript
tags:
  - ECMAScript
  - JavaScript
---

​ 在 Node.js 的**util 模块**中存在着`util.promisify()`方法，它**接收**一个**遵循常见的错误优先**的**回调风格**的函数**作为最后一个参数**，并**返回一个 promise 版本**。

​ 该方法的好处就是**将原来的回调风格的函数转变成 Promise 风格的函数**，简化了一部分代码，但局限性就是该方法只能在 Node 环境下的 util 模块使用。

​ 这形容词有点多了呀，什么意思呢？其实，就是把使用 fs 模块操作文件的代码（**错误优先的函数**）**传入进去作为参数**，`fs.readFile('文件名', (err, data)=>{ ... })`，**error 参数在前**，这种就叫做**错误优先**。

```javascript
const fs = require("fs");
const util = require("util");
// 返回一个新的函数，也就是说此时mineReadFile是函数
let mineReadFile = util.promisify(fs.readFile);
// 当调用mineReadFile函数时，它会返回一个Promise对象
mineReadFile("./content.txt").then(
  (value) => {
    console.log(value.toString());
  },
  (reason) => {
    console.log(reason);
  }
);
```

## Promise 的状态（面试知识点）

**Promise 的状态**：**Promise 实例对象中的一个属性 => PromiseState**

​ Promise 的状态分为 3 种：

1. 处于**pending 状态(等待或未完成)** => **实例化 Promise 后**
2. 处于**fulfilled/resolved 状态(已成功)** => **执行 resolve()后**
3. 处于**rejected 状态(已失败)** => **执行 reject()后**

> 注意：**Promise 的状态一旦发生变化，就不会再改变了**！
>
> 且**状态改变只能是从 pending -> fulfilled/resolved**或者**pending -> rejected**

```javascript
// 实例化Promise，此时处于pending状态
const p = new Promise((resolve, reject) => {
      resolve(); -> 执行resolve()，此时处于fulfilled/resolved状态(pending -> fulfilled/resolved)
      reject(); -> 执行rejected()，此时处于rejected状态(pending -> rejected)
});
```

**Promise 对象的值**：**Promise 实例对象中的另一个属性 => PromiseResult**，其保存的是**异步任务成功或失败的结果**。

​ 如何更改值？只能通过 resolve()和 reject()修改。

​ 知道了结果保存的地方，那么再来梳理一下整个流程：

​ 首先，实例化 Promise 对象，导致对象中的 PromiseState 属性的值为 pending => 执行 resolve 方法或 reject 方法并传入执行成功或失败的结果 => 当执行成功或失败后，PromiseResult 属性保存了相应的结果作为值 => 调用 then 方法，将 PromiseResult 属性的值取出来进行下一步处理，同时返回一个新的 Promise 对象。

![](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-1024x269.png)

## Promise 相关`API`（面试知识点）

1. **Promise 构造函数**：Promise(executor) { ... }

   (1)executor 函数：**执行器函数** (resolve, reject) => { ... }

   (2)resolve 函数：内部定义成功时我们调用的函数，value => { ... }

   (3)reject 函数：内部定义失败时我们调用的函数，reason => { ... }

   > 注意：**executor 函数会在 Promise 内部立即同步调用**，**异步操作在执行器函数中进行**。

   ```javascript
   这里可能会看的迷糊，首先来认识一下什么是executor执行器函数？
     从上面我们可以看出，executor执行器函数是Promise构造函数的参数
   const p = new Promise((resolve, reject) => { ... });
     那么也就是说，这里的executor执行器函数指的是 (resolve, reject) => { ... } 这个整体作为了Promise构造函数的参数，直白点就是new Promise()括号里面的区域。
     上面也提到了executor执行器函数在Promise内部是同步调用的，也就是说它执行时并不会进入队列中。因此，我们只要牢牢记住executor执行器函数是Promise构造函数的参数，就能区分出哪个是执行器函数。
   const p = new Promise((resolve, reject) => {
      console.log(111);
   });
   console.log(222);
   在控制台进行输出时，会看到先输出111，再输出222
   这说明了：当代码运行到了console.log(111)这条语句时，执行器函数在Promise内部立即同步调用，而异步操作则被放在了执行器函数中进行。
   ```

2. **`Promise.prototype.then`方法**：(`onResolved, onRejected`) => { ... }

   (1)`onResolved`函数：成功时的回调函数，value => { ... }

   (2)`onRejected`函数：失败时的回调函数，reason => { ... }

   (3)不管是成功时的回调函数还是失败时的回调函数，都将**返回一个新的 Promise 对象**

3. **`Promise.prototype.catch`方法：`onRejected` => { ... }**

   (1)`onRejected`函数：失败时的回调函数，reason => { ... }

   (2)catch 方法只能在 Promise 实例对象处于 rejected 状态下，才能捕捉错误，**其内部也是由 then 方法实现的**。

4. **`Promise.resolve`方法：value => { ... }**

   (1)value: 成功的数据或 Promise 对象

   (2)同时**返回一个成功/**失败的 Promise 对象

   ```javascript
   let p1 = Promise.resolve();
   // 如果传入的参数是非Promise类型的对象，则返回的结果是成功的Promise对象
   let p2 = Promise.resolve(666);
   console.log(p2); -> 此时p2的PromiseState为fulfilled状态
   // 如果传入的参数是Promise对象，则参数的结果决定了resolve的结果
   let p3 = Promise.resolve(new Promise((resolve, reject) => {
       resolve('ok');
   }));
   console.log(p3); -> 此时p3的PromiseState为fulfilled状态
   反之，reject('Error') -> 此时p3的PromiseState为rejected状态
   ```

5. **`Promise.reject`方法：reason=> { ... }**

   (1)reason: 失败的原因

   (2)**返回一个失败的 Promise 对象**

   ```javascript
   let p4 = Promise.reject(new Promise((resolve, reject) => {
       resolve('ok');
     }));
   即使传入的是一个成功的Promise对象，其PromiseState的值都会是rejected，但PromiseResult的值由传入的参数决定
   ```

6. **`Promise.all`方法：promises => { ... }**

   (1)promises: 包含 n 个 promise 的数组

   (2)返回一个新的 promise，**只有所有的 promise 都成功才成功**，**只要有一个失败了就直接失败**

   ```javascript
   let p1 = new Promise((resolve, reject) => {
     resolve("ok");
   });
   let p2 = Promise.resolve("Success");
   let p3 = Promise.resolve("Oh");
   const result = Promise.all([p1, p2, p3]);
   console.log(result);
   ```

7. **`Promise.race`方法：promises => { ... }**

​ (1)promises: 包含 n 个 promise 的数组

​ (2)返回一个新的 promise，**第一个完成的 promise 的结果状态就是最终的结果状态**

```javascript
let p1 = new Promise((resolve, reject)=> {
    resolve('ok');
})
let p2 = Promise.resolve('Success');
let p3 = Promise.resolve('Oh');
const result = Promise.race([p1, p2, p3]);
console.log(result); -> p1的状态决定了结果
--------------------------------------------
let p1 = new Promise((resolve, reject)=> {
    setTimeout(() => {
      resolve('ok');
  }, 1000)
})
let p2 = Promise.resolve('Success');
let p3 = Promise.resolve('Oh');
const result = Promise.race([p1, p2, p3]);
console.log(result); -> p2的状态决定了结果
```

---

## Promise 关键问题

​ A. **如何改变 Promise 的状态？**

​ 1.**resolve()**：pending -> fulfilled/resolved

​ 2.**reject()**：pending -> rejected

​ 3.**抛出异常 throw**：如果当前是 pending 就会变为 rejected

​ B. **一个 Promise 指定多个成功/失败回调函数，都会调用吗？**

​ 当 promise 改变为对应状态时都会调用

​ C. **改变 promise 状态和指定回调函数谁先谁后？**

​ 1.都有可能，**正常情况下是先指定回调再改变状态**，但也可以先改变状态再指定回调

​ 2.**如何先改变状态再执行回调？**

​ (1)在**执行器函数中直接调用 resolve()、reject()**，因为**执行器函数会在 Promise 内部立即同步调用**，因此会导致先改变状态后指定回调。

​ (2)延迟更长时间才调用 then()

​ 3.什么时候才能得到数据？

​ (1)如果先指定的回调，那**只有当状态发生改变时，才能调用回调函数**，进而得到数据

​ (2)如果先改变的状态，那当指定回调时，就会调用回调函数，进而得到数据

​ (3)总之就是：**在执行器函数中可以进行同步/异步操作，但只有当状态发生改变时，才能调用回调函数，然后得到数据。**

​ D. **promise.then()返回的新 promise 的结果状态由什么决定？**

​ (1)由**then()指定的回调函数执行的结果**决定

​ (2)详细说明：

```javascript
1.如果抛出异常，返回的新promise的状态变为rejected
2.如果返回的是非promise的任意值，新promise的状态变为resolved
3.如果返回的是一个promise，此promise的结果就会变为新promise的结果
```

​ E. **promise 如何串连多个操作任务？**

​ 由于 then()返回的是一个新的 promise 对象，因此可以使用**then 的链式调用串连多个同步/异步任务。**

```javascript
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok');
  }, 1000)
});
p.then(value => {
   return new Promise((resolve, reject) => {
     resolve('success');
  });
}).then(value => {
   console.log(value); -> success
}).then(value => {
   console.log(value); -> undefined
})
为什么输出的是success和undefined呢？
  因为在实例对象p的then方法中我们返回了一个新的Promise对象，它的状态为resolved，此时的value保存的是ok字符串，新的Promise对象在resolved状态下，向它的then方法传递了success字符串，因此之前value保存的ok字符串被更新了，替换成了success字符串，因此then方法输出的是success。而我们又知道then方法会返回一个新的Promise对象，而这个新promise的状态由它指定的回调函数的返回值来决定，而在新的promise中，并没有给出返回值，因此会返回undefined。而undefined并不是promise对象，结合之前的"如果返回的是非promise的任意值，新promise的状态变为resolved"这个规则，因此这个新promise的状态为resolved，并且value的值就为返回的undefined，最后输出undefined。
```

​ F. **Promise 的异常穿透？**

```javascript
什么叫异常穿透？
  就是在then的链式调用中，前面任何操作出现了异常，都会传到链式调用的最后失败回调中处理

let p = new Promise((resolve, reject) => {
    setTimeout(() => {
      throw '出问题啦!';
  }, 1000)
});
p.then(value => {
   return new Promise((resolve, reject) => {
     resolve('success');
  });
}).then(value => {
   console.log(value); -> success
}).then(value => {
   console.log(value); -> undefined
}).catch(reason => {
   console.log(reason); -> 出问题啦!
})
```

​ G. **中断 Promise 链？**

```javascript
什么是Promise链？
  由于then方法会返回一个新的promise对象，在then链式调用的过程中，就会形成Promise链
如何中断Promise链？
  有且只有一种方法：返回一个处于pending状态的Promise对象
那么为什么是pending状态下的Promise对象，而不是false啥的？
  因为false并不是一个Promise对象，属于非Promise对象的任意值一类，因此会返回一个处于resolved状态且值为undefined的Promise对象，所以不会中止Promise链。
  如果返回的是pending状态下的Promise对象，那么此时then返回的也会是pending状态下的Promise对象，这说明了状态并没有改变。而之前提到：只有当状态改变时，才能调用相应的回调函数，所以pending状态下的Promise对象会中止Promise链。
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok');
  }, 1000)
});
p.then(value => {
   // 中断Promise
   return new Promise(() => {});
}).then(value => {
   console.log(value);
}).then(value => {
   console.log(value); -> undefined
})
```

## 手写(自定义)Promise（面试知识点）

```javascript
我们通过引入js文件的方式来使用手写的Promise，因此注意下面代码分为两部分，以此来对比和模仿。
<html>
  <head>
    <script src="./promise.js"></script>
  </head>
  <body>
    <script>
       let p = new Promise((resolve, reject) => {
           resolve('ok');
       }).then(value => {
          console.log(value);
       }, reason => {
          console.log(reason);
       });
    </script>
  <body>
</html>

<script>
   // 手写Promise的突破点就在于其构造函数
   // 此函数会覆盖原来的构造函数
   function Promise(executor){
      // 添加属性
      this.PromiseState = 'pending';
      this.PromiseResult = null;
      // 声明属性
      this.callbacks = [];
      // 保存实例对象的this
      const self = this;

      function resolve(data) {
         // 判断状态
         if(self.PromiseState !== 'pending')
            return;
         // 修改对象的状态
         self.PromiseState = 'fulfilled';
         // 设置对象的结果值
         self.PromiseResult = data;
         // 调用成功的回调函数
         setTimeout(() => {
           self.callbacks.forEach(item => {
             item.onResolved(data);
           });
         });
      }

      function reject(data) {
         // 判断状态
         if(self.PromiseState !== 'pending')
            return;
         // 修改对象的状态
         self.PromiseState = 'rejected';
         // 设置对象的结果值
         self.PromiseResult = data;
         // 调用失败的回调函数
         setTimeout(() => {
           self.callbacks.forEach(item => {
             item.onRejected(data);
           });
         });
      }

      try {
         // Promise内部会立即同步调用执行器函数
         executor(resolve, reject);
      } catch(e) {
         // 修改promise对象的状态为失败
         reject(e);
      }
   }
   // 添加then方法
   Promise.prototype.then = function(onResolved, onRejected) {
        const self = this;
        // 判断回调函数的参数
        if(typeof onRejected !== 'function') {
             onRejected = reason => {
                 throw reason;
           }
        }
        if(typeof onResolved !== 'function') {
             onResolved = value => value;
        }
        return new Promise((resolve, reject) => {
            // 封装函数
            function callback(type) {
              try {
                   // 获取回调函数的执行结果
                   let result = type(self.PromiseResult);
                   // 判断
                   if(result instanceof Promise) {
                       // 如果是Promise类型的对象
                       result.then(v => {
                           resolve(v);
                       }, r => {
                           reject(r);
                       })
                   } else {
                       // 结果的对象状态为成功
                       resolve(result);
                   }
               } catch(e) {
                  reject(e);
               }
            }
            // 调用回调函数
            if(this.PromiseState === 'fulfilled') {
               setTimeout(() => {
                  callback(onResolved);
              });
            }
            if(this.PromiseState === 'rejected') {
               setTimeout(() => {
                  callback(onRejected);
              });
            }
            // 判断pending状态
            if(this.PromiseState === 'pending'){
                 // 保存回调函数
                 this.callbacks.push({
                    onResolved: function() {
                        callback(onResolved);
                    },
                    onRejected: function() {
                        callback(onRejected);
                    }
              });
          }
     });
   }
   // 添加catch方法
   Promise.prototype.catch = function() {
     return this.then(undefined, onRejected);
   }
   // 添加resolve方法
   Promise.resolve = function(value) {
     return new Promise((resolve, reject) => {
        if(value instanceof Promise) {
          value.then(v => {
             resolve(v);
          }, r => {
             reject(r);
          })
         } else {
            // 状态设置为成功
            resolve(value);
        }
     });
   }
   // 添加reject方法
   Promise.reject = function(reason) {
      return new Promise((resolve, reject)=> {
          reject(reason);
      });
   }
   // 添加all方法
   Promise.all = function(promises) {
      return new Promise((resolve, reject) => {
         // 声明变量
         let count = 0;
         let arr = [];
         // 遍历
         for(let i = 0; i < promises.length; i ++) {
                promises[i].then(v => {
                    count ++;
                    // 将当前promise的结果存入数组
                    arr[i] = v;
                    if(count === promises.length) {
                         resolve(arr);
                    }
                }, r => {
                    reject(r);
                });
         }
      });
   }
   // 添加race方法
   Promise.race = function(promises) {
       return new Promise((resolve, reject) => {
          for(let i = 0; i < promises.length; i ++){
              promises[i].then(v => {
                  resolve(v);
              }, r => {
                  reject(r);
              });
          }
     });
   }
</script>
```
