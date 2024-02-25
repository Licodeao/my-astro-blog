---
title: Python基础(三)
author: Licodeao
publishDate: "2022-8-5"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Python
tags:
  - Python基础
---

## 1.字典

> 类似于 JavaScript 中的**对象**

​ 字典是 Python 内置的数据结构之一，**与列表一样是一个可变序列**。以**键值对**的方式**存储数据**，**字典是一个无序的序列**。

```python
scores = {
	'zs': 100,
	'ls': 98,
	'ww': 60
}
```

### 字典的创建

- 使用花括号

- 使用内置函数`dict()`

  ```python
  scores = {
  	'zs': 100,
  	'ls': 98,
  	'ww': 60
  }

  scores = dict( name='jack', age=20 )
  ```

### 字典元素的获取

- 中括号 [ ]

- get()方法

  ```python
  scores['zs']
  scores.get('zs')
  ```

#### []与 get()的区别

- 使用[ ]时，如果字典中不存在指定的 key，抛出`keyError`异常
- get()方法取值，如果字典中不存在指定的 key，并不会抛出`KeyError`异常而是**返回 None**，可以**通过参数设置默认的异常值**，以便指定的 key 不存在时返回

### key 的判断

依然采用 **in / not in** 判断指定的 key 在字典中是否存在

### 字典元素的新增与删除

- 新增：`scores['key'] = value`
- 删除：`del scores['key']`
- clear() -> 清空字典的元素

### 获取字典视图

- **keys()** -> 获取字典中**所有 key**
- **values()** -> 获取字典中**所有 value**
- **items()** -> 获取字典中**所有键值对**

### 字典元素的遍历

**自定义变量**对应的是**字典元素中的 key**

```python
for i in scores:
    print(i)
```

### 字典元素的特点

- 字典中的所有元素都是一个键值对，key 不允许重复，value 可以重复
- 字典中的元素是无序的
- 字典中的 key 必须是不可变对象
- 字典会浪费较大的内存，是一种使用空间换取时间的数据结构

### 字典生成式

```python
items = ['Fruit','Books','Others']
prices = [10,20,30]
		⬇
{
    'Fruit':10,
    'Books':20,
    'Others':30
}

此过程类似打包，需要将两个可迭代对象组合成一个元组
```

#### 内置函数 zip()

​ 用于将**可迭代的对象**作为参数，将对象中对应的元素**打包成一个元组**，然后**返回由这些元组组成的列表**

> 字典生成式

```python
items = ['Fruit','Books','Others']
prices = [10,20,30]
lists = zip(items,prices)
print(lists(lists)) -> [('Fruit', 10), ('Books', 20), ('Others', 30)]

# 字典生成式
{ item.upper() : prices for item,prices in zip(items,prices) } -> {'FRUIT': 10, 'BOOKS': 20, 'OTHERS': 30}
	↓
 这里key大写了

'''
   字典生成式本质与列表生成式是一样的
   无非就是字典生成式的"表示字典元素"变成了键值对的形式
   以及遍历对象变成了使用内置函数zip打包形成的新列表
'''
```

## 2.元组

Python 内置的数据结构之一，是一个**不可变序列**

```python
# 元组
test = ( 'hello', 'world', 100 )
```

### 不可变序列与可变序列

- **不可变序列**(**没有增、删、改的操作**)：**字符串、元组**
- **可变序列**(**有增、删、改的操作，对象地址不发生更改**)：**列表、字典**

### 元组的创建方式

1. 直接使用小括号
2. 使用内置函数 tuple()
3. 只包含一个元素的元组需要使用逗号和小括号

```python
# 使用小括号
test = ( 'hello', 'world', 100 )

# 使用内置函数tuple()
test = tuple(( 'hello', 'world', 100 ))

# 只包含一个元组的元素需要使用逗号和小括号
test = ( 10 , )
```

### 元组的遍历

```python
test = tuple(( 'hello', 'world', 100 ))
for item in test:
    print(item)
```

## 3.集合

> 集合是没有 value 的字典，可看作只有 key 的字典

### 集合的创建方式

1. 直接使用花括号 { }

2. 使用内置函数 set()

   ```python
   # 使用花括号
   s = { 'hello', 'python', 100 }

   # 使用内置函数set()
   s = set(range(6))
   print(s) -> {0, 1, 2, 3, 4, 5}
   ```

### 集合的判断

依然使用 **in / not in** 判断是否是集合

### 集合的新增

| add()        | 一次添加一个元素     |
| ------------ | -------------------- |
| **update()** | 一次添加**多个**元素 |

### 集合的删除

| remove()      | 一次删除一个指定元素，如果指定的元素不存在抛出`KeyError`异常 |
| ------------- | ------------------------------------------------------------ |
| **discard()** | 一次**删除一个指定元素**，如果指定的元素不存在则**不抛异常** |
| **pop()**     | 一次**删除一个任意元素**                                     |
| **clear()**   | 清空集合                                                     |

### 集合间的关系

- 两个集合是否相等：== 或 !=
- 一个集合是否是另一个集合的子集：调用方法`issubset()`
- 一个集合是否是另一个集合的超集：调用方法`issuperset()`
- 两个集合是否没有交集：调用方法`isdisjoint()`

### 集合生成式

```python
# 集合生成式
{ i*i for i in range(1,10) }

# 将 {} -> [] 就是列表生成式
```
