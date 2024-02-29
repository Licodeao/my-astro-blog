---
title: 红绿灯问题总结
author: Licodeao
publishDate: "2023-6-27"
img: /assets/articles/javascript.jpeg
img_alt: 红绿灯问题总结
description: |
  Promise 红绿灯问题总结
categories:
  - ECMAScript
tags:
  - ECMAScript
  - JavaScript
  - Promise
---

在某次笔试中，有考到红绿灯问题。不知道是为啥，当时直接在牛客网的笔试页面上手写了，并没有使用 IDE 进行辅助。

做完后想着这种问题挺有意思的，故而当时准备总结以下，但后面忙着忙着忘了这回事情...

今日刚好有时间可以摸出来~

### 回调实现

```typescript
function turnRed() {
  console.log("red");
}

function turnGreen() {
  console.log("green");
}

function turnYellow() {
  console.log("yellow");
}

const queue = (timer: number, light: string, callback: () => void) => {
  setTimeout(() => {
    if (light === "red") {
      turnRed();
    } else if (light === "green") {
      turnGreen();
    } else if (light === "yellow") {
      turnYellow();
    }
    callback();
  }, timer);
};

const loop = () => {
  queue(3000, "red", () => {
    queue(2000, "green", () => {
      queue(1000, "yellow", () => {
        loop();
      });
    });
  });
};

loop();
```

### Promise 实现

```typescript
function turnRed() {
  console.log("red");
}

function turnGreen() {
  console.log("green");
}

function turnYellow() {
  console.log("yellow");
}

const queue = (timer: number, light: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (light === "red") {
        turnRed();
      } else if (light === "green") {
        turnGreen();
      } else if (light === "yellow") {
        turnYellow();
      }
      resolve(light);
    }, timer);
  });
};

const loop = () => {
  queue(3000, "red")
    .then(() => queue(2000, "green"))
    .then(() => queue(1000, "yellow"))
    .then(() => loop());
};

loop();
```

### 异步模拟

> async + await

```typescript
interface itemType {
  color: string;
  delay: number;
}

function loadResource(item: itemType) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(item.color);
    }, item.delay);
  });
}

async function loadTransform(array: itemType[]) {
  while (true) {
    for (let i = 0; i < array.length; i++) {
      const res = await loadResource(array[i]);
      console.log(res);
    }
  }
}

loadTransform([
  { color: "red", delay: 1000 },
  { color: "green", delay: 2000 },
  { color: "yellow", delay: 3000 },
]);
```

以下写法和上面是一样的

```typescript
async function traffic() {
  const callback = function (light: string, duration: number) {
    console.log(light);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(light);
      }, duration);
    });
  };

  while (true) {
    await callback("red", 1000);
    await callback("green", 2000);
    await callback("yellow", 3000);
  }
}

traffic();
```
