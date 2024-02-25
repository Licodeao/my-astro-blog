---
title: Python基础(四)
author: Licodeao
publishDate: "2022-8-6"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Python
tags:
  - Python基础
---

## 一、字符串

### 字符串驻留机制

> 对相同的字符串**只保留一份拷贝**，后续创建相同字符串时，不会开辟新空间，而是**把该字符串的地址赋值给新创建的变量**

### 字符串的查询操作

| **index()**    | 查找子串`substr`第一次出现的位置，如果查找的子串不存在，则抛出`ValueError`       |
| -------------- | -------------------------------------------------------------------------------- |
| **`rindex()`** | 查找子串`substr`**最后一次**出现的位置，如果查找的子串不存在，则抛出`ValueError` |
| **find()**     | 查找子串`substr`第一次出现的位置，如果查找的子串不存在，则返回-1                 |
| **`rfind()`**  | 查找子串`substr`**最后一次**出现的位置，如果查找的子串不存在，则返回-1           |

### 格式化字符串

- **%** 作占位符

| %s       | 字符串 |
| -------- | ------ |
| %i 或 %d | 整数   |
| %f       | 浮点数 |

- **{ }** 作占位符

```python
name = 'zs'
age = 20

# % 作占位符
print('姓名:%s, 年龄: %d' % (name,age))

# { } 作占位符
# {0} 表示取format方法的第一个参数
print('姓名:{0}, 年龄: {1}'.format(name,age))
```

## 二、函数

### 函数的创建

```python
def 函数名([输入参数]):
    函数体
    [return ...]

# example
def sum(a,b):
    c = a + b
    return c
```

### 函数的返回值

- 函数返回多个值时，结果为元组

  ```python
  def func(num):
  	odd = []
  	eveb = []
  	for i in num:
  		if i%2:
  			odd.append(i)
  		else:
  			even.append(i)
      return odd,even
  print(func([10,29,34,23,44,53,55])) -> ([29,23,53,55], [10,34,44])
  ```

### 函数的参数

- 个数可变的位置参数

  使用 \* 定义个数可变的位置形参，**结果为一个元组**

  ```python
  def func(*args):
      print(args)
  func(10,20,30) -> (10,20,30)
  ```

- 个数可变的关键字形参

  使用 ** 定义个数可变的关键字形参，**结果为一个字典\*\*

  ```python
  def func(**args):
      print(args)
  func(a=10,b=20,c=30) -> {'a':10, 'b':20, 'c':30}
  ```

- 函数定义时，给形参设置默认值，只有与默认值不符时才需要传递实参

  ```python
  def fun(a, b=10):
      print(a,b)

  fun(100) # 此时a的值为100，b使用默认值10
  ```

## 三、异常处理及类型

### 异常处理

```python
try:
    可能会出现异常的代码
except 异常类型:
    报错后执行的代码

# example
try:
    n1 = int(input('请输入一个整数'))
    n2 = int(input('请输入另一个整数'))
    result = n1 / n2
    print('result:', result)
except ZeroDivisionError:
    print('除数不能为0')

# 多个except结构，为了避免遗漏可能出现的异常，可以在最后增加BaseException
try:
    n1 = int(input('请输入一个整数'))
    n2 = int(input('请输入另一个整数'))
    result = n1 / n2
    print('result:', result)
except ZeroDivisionError:
    print('除数不能为0')
except BaseException as e:
    print(e)

# try...except...else结构
	# 如果try块中没有抛出异常，则执行else块；如果try中抛出异常，则执行except块

# try...except...else...finally结构
	# finally块无论是否发生异常都会被执行
```

### traceback 模块

- 使用 traceback 模块打印异常信息

  ```python
  import traceback
  try:
      num = 10 / 0
  except:
      traceback.print_exc()
  ```

## 四、类与对象

### 类的创建

```python
# 创建类
class Student:
    pass

@classmethod -> # 定义类方法
def sum(number):
    print('类方法')

@staticmethod -> # 定义静态方法
def sub(number):
    print('静态方法')
```

### 对象的创建

```python
# 语法
实例对象名 = 类名()
# 创建对象
stu = Student()

# Python同样支持动态绑定属性和方法
stu.gender = 'man' -> 动态绑定属性
def show():
    print('...')
stu.show = show -> 动态绑定方法
```

### 对象的继承

```python
# 语法
class 子类名(父类名1, 父类名2...)

class Person(object):
    def info(self):
        print('父类')
class Student(Person):
    def info2(self):
        print('子类')

stu = Student()
stu.info2() -> 子类
```

### 特殊方法和特殊属性

| 特殊属性 | `__dict__`   | 获得类对象或实例对象所绑定的所有属性和方法的字典                 |
| -------- | ------------ | ---------------------------------------------------------------- |
| 特殊方法 | `__len__()`  | 通过重写`__len__()`方法，让内置函数`len()`的参数可以是自定义类型 |
| 特殊方法 | `__add__()`  | 通过重写`__add__()`方法，可使自定义对象具有"+"功能               |
| 特殊方法 | `__new__()`  | 用于创建对象                                                     |
| 特殊方法 | `__init__()` | 对创建的对象进行初始化                                           |

## 五、模块

### 导入模块

```python
import 模块名称 [as 别名]
from 模块名称 import 函数/变量/类
```

### 常用内置模块

| time     | 时间库                             |
| -------- | ---------------------------------- |
| `os`     | 访问操作系统服务功能的库           |
| `urllib` | 读取来自网上(服务器)的数据标准库   |
| `json`   | `JSON`序列化和反序列化对象         |
| re       | 在字符串中执行正则表达式匹配和替换 |
| decimal  | 进行控制运算精度                   |
| logging  | 提供日志信息功能                   |

### 第三方模块的安装

`pip install 模块名`
