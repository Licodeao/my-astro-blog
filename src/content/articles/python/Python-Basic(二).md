---
title: Python基础(二)
author: Licodeao
publishDate: "2022-8-3 23:36"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Python
tags:
  - Python基础
---

## 列表

> 列表相当于**数组**

### 列表的创建方式

- 使用**中括号**
- 使用**内置函数 list()**

```python
list1 = [1,2,3]
list2 = list([1,2,3])
```

### 列表的特点

- 列表元素按顺序有序排序
- 索引映射唯一一个数据
- 列表可以存储重复数据
- 任意数据类型混存
- 根据需要动态分配和回收内存

### 列表的查询操作

#### 获取指定元素的索引

##### index()方法

- 如果列表中存在 N 个相同元素，只返回相同元素中的**第一个元素的索引**
- 如果查询的元素不存在，则会抛出`ValueError`
- 可以在指定的 start 和 stop 之间进行查找

```python
list1 = [1,2,3]
print(list1.index(1)) -> 0

# 在指定的start和stop之间进行查找
print(list1.index(1,1,2)) -> # ValueError: 1 is not in list，在索引为1和2之间查找数值1当然报错
```

#### 获取单个元素的索引

- 正向索引从 0 到 N-1
- 逆向索引从-N 到-1
- 指定索引不存在，抛出`IndexError`

#### 获取列表中的多个元素(切片操作)

##### 语法格式

​ **列表名[ start : stop: step ]**

##### 切片结果

​ 原列表片段的**拷贝(新列表对象)**

##### 切片范围

​ [start, stop)

##### step 的取值

- step 默认为 1，简写为[ start : stop ]
- step 为**正数**（从 start 开始**往后**计算切片）
  1. **[ : stop : step ]** -> 切片的**第一个元素默认是列表的第一个元素(start 省略表示默认，值为 0)**
  2. **[ start :: step ]** -> 切片的**最后一个元素默认是列表的最后一个元素(stop 省略表示默认，切到原列表的最后一个元素)**
- step 为**负数**（从 start 开始**往前**计算切片）
  1. **[ : stop : step ]** -> 切片的**第一个元素默认是列表的最后一个元素**
  2. **[ start :: step ]** -> 切片的**最后一个元素默认是列表的第一个元素**

```python
lists = [1,2,3,4,5,6,7,8,9]

# start = 1, stop = 6, step = 1
# 切片语法：lists[ 1:6:1 ]
print(lists[ 1:6:1 ]) -> #输出：[2, 3, 4, 5, 6]，注意这里的切片范围为[start,stop)即[1,6)
print(lists[ 1:6: ]) -> # 不写步长等同于step=1，因为step默认为1

# start = 1, stop = 6, step = 2
# 切片语法：lists[ 1:6:2 ]
print(lists[ 1:6:2 ]) -> #输出：[2,4,6],切片范围为[1,6)且step=2

# start默认, stop = 6， step = 2
# 切片语法：lists[ :6:2 ]
print(lists[ :6:2 ]) -> #输出：[1,3,5]

# start = 1, stop默认, step = 2
# 切片语法：lists[1::2]
print(lists[1::2]) -> #输出：[2,4,6,8]，注意step为2，所以9取不到

# start默认, stop默认, step = -1
# 切片语法：lists[ ::-1 ]
print(lists[ ::-1 ]) -> #输出：[9,8,7,6,5,4,3,2,1]
```

### 列表元素的判断及遍历

- 判断指定元素在列表中是否存在

  **元素 in / not in 列表名**

  ```python
  lists = [10,20]
  print(10 in lists) -> #True
  ```

- 列表元素的遍历

​ **for 迭代遍历 in 列表名:**

```python
lists = [10,20]
for i in lists:
	print(i) -> # 10,20
```

### 列表元素的增加操作

| 方法     | 描述                                                     |
| -------- | -------------------------------------------------------- |
| append() | 在**列表末尾添加一个元素**，**不会创建一个新的列表对象** |
| extend() | 在列表末尾**至少添加一个元素**                           |
| insert() | 在列表**任意位置添加一个元素**                           |
| 切片     | 在列表**任意位置添加至少一个元素**                       |

```python
lists = [10,20]
lists.append(100)
print(lists) -> [10,20,100]

lists2 = [98,99]
lists.extend(lists2)
print(lists) -> [10, 20, 100, 98, 99]

lists.insert(1,90)
print(lists) -> [10, 90, 20, 100, 98, 99]

list3 = [True,False]
lists[1:] -> [10] #从下标为1开始切，stop默认表示切到原列表末尾，step省略表示step=1，因此切掉20
lists[1:] = list3
print(lists) -> [10, True, False]
```

### 列表元素的删除操作

| 方法     | 描述                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| remove() | **一次删除一个元素**，**重复元素只删除第一个**，元素不存在抛出`ValueError`                                     |
| pop()    | 删除一个**指定索引**位置上的元素，指定索引不存在抛出`IndexError`，**不指定索引**则**默认删除列表最后一个元素** |
| 切片     | 一次**至少删除一个元素，产生一个新的列表对象(被切掉的元素形成一个新的列表对象)**                               |
| clear()  | 清空列表                                                                                                       |
| `del`    | 删除列表                                                                                                       |

```python
lists = [11,21,31,41,51,61,71,31,91]
lists.remove(31)
print(lists) -> [11, 21, 41, 51, 61, 71, 31, 91]

lists.pop(1)
print(lists) -> [11, 41, 51, 61, 71, 31, 91]
lists.pop()
print(lists) -> [11, 41, 51, 61, 71, 31]


new_lists = lists[1:3]
print(new_lists) -> [41, 51] #新的列表对象(被切掉的元素形成一个新的列表对象)
# 如何不产生一个新的列表对象?
lists[1:3] = [] -> 使用空列表将新列表对象替换
print(lists) -> [11, 61, 71, 31]
```

### 列表元素的修改操作

- 为指定索引的元素赋一个新值

  ```python
  lists = [10,20,30]
  lists[1] = 40
  print(lists) -> [10, 40, 30]
  ```

- 为指定的切片赋一个新值

```python
lists = [10,20,30,40]
lists[1:3] = [33,44,55]
print(lists) -> [10, 33, 44, 55, 40]
```

### 列表的排序操作

- 调用**sort()方法**，**默认按照从小到大**的顺序进行排序，如**指定 reverse = True**，则进行**降序排序**
- 调用**内置函数 sorted()**，**默认按照从小到大**的顺序进行排序，**如指定 reverse = True**，进行**降序排序**，**产生一个新的列表对象**

```python
lists = [20,40,10,98,54]
lists.sort(reverse = True)
print(lists) -> [98, 54, 40, 20, 10]

new_lists = sorted(lists)
print(new_lists) -> [10, 20, 40, 54, 98]
desc_newLists = sorted(lists, reverse = True)
print(desc_newLists) -> [98, 54, 40, 20, 10]
```

### 列表生成式

#### 语法格式

**[ 表示列表元素的表达式 for 自定义变量 in 可迭代对象 ]**

```python
lists = [ i for i in range(1,10) ]
print(lists) -> [1, 2, 3, 4, 5, 6, 7, 8, 9]

lists = [ i*i for i in range(1,10) ]
print(lists) -> [1, 4, 9, 16, 25, 36, 49, 64, 81]

lists = [ i*2 for i in range(1,6) ]
print(lists) -> [2, 4, 6, 8, 10]
```
