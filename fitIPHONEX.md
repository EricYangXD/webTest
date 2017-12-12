## 适配iPhoneX ##

> iPhoneX 取消了物理按键，改成底部小黑条，这一改动导致网页出现了比较尴尬的屏幕适配问题。对于网页而言，顶部（刘海部位）的适配问题浏览器已经做了处理，所以我们只需要关注底部与小黑条的适配问题即可（即常见的吸底导航、返回顶部等各种相对底部 fixed 定位的元素）。

**适配之前需要了解的几个新知识**

#### 安全区域 ####

- 安全区域指的是一个可视窗口范围，处于安全区域的内容不受圆角（corners）、齐刘海（sensor housing）、小黑条（Home Indicator）影响，如下图蓝色区域：

![safe area1][SA1]![safe area1][SA2]

- 也就是说，我们要做好适配，必须保证页面可视、可操作区域是在安全区域内。

#### viewport-fit ####

- IOS11 新增特性，苹果公司为了适配 iPhoneX 对现有 viewport meta 标签的一个扩展，用于设置网页在可视窗口的布局方式，可设置三个值：

1. contain: 可视窗口完全包含网页内容（下图）
2. cover：网页内容完全覆盖可视窗口（下图）
3. auto：默认值，跟 contain 表现一致

![contain][contain]

_注意：网页默认不添加扩展的表现是 viewport-fit=contain，需要适配 iPhoneX 必须设置 viewport-fit=cover，这是适配的关键步骤。_

#### constant 函数

- iOS11 新增特性，Webkit 的一个 CSS 函数，用于设定安全区域与边界的距离，有四个预定义的变量：

1. safe-area-inset-left：安全区域距离左边边界距离
2. safe-area-inset-right：安全区域距离右边边界距离
3. safe-area-inset-top：安全区域距离顶部边界距离
4. safe-area-inset-bottom：安全区域距离底部边界距离

- 这里我们只需要关注 safe-area-inset-bottom 这个变量，因为它对应的就是小黑条的高度（横竖屏时值不一样）。

*注意：当 viewport-fit=contain 时 constant 函数是不起作用的，必须要配合 viewport-fit=cover 使用。对于不支持 constant 的浏览器，浏览器将会忽略它。*

#### 如何适配 ####

+ 了解了以上所说的几个知识点，接下来我们适配的思路就很清晰了。
+ 第一步：设置网页在可视窗口的布局方式
+ 新增 viweport-fit 属性，使得页面内容完全覆盖整个窗口： 
```
<meta name="viewport" content="width=device-width, viewport-fit=cover">
```

+ 前面也有提到过，只有设置了 viewport-fit=cover，才能使用 constant 函数。
+ 第二步：页面主体内容限定在安全区域内
+ 这一步根据实际页面场景选择，如果不设置这个值，可能存在小黑条遮挡页面最底部内容的情况。
```
body {
    padding-bottom: constant(safe-area-inset-bottom);
}
```
#### 第三步：fixed 元素的适配 ####
***类型一：fixed 完全吸底元素（bottom = 0），比如下图这两种情况:***

![bottom][bottom]

+ 可以通过加内边距 padding 扩展高度：
```
{
    padding-bottom: constant(safe-area-inset-bottom);
}
```
+ 或者通过计算函数 calc 覆盖原来高度：
```
{
    height: calc(60px(假设值) + constant(safe-area-inset-bottom));
}
```
+ 注意，这个方案需要吸底条必须是有背景色的，因为扩展的部分背景是跟随外容器的，否则出现镂空情况。
还有一种方案就是，可以通过新增一个新的元素（空的颜色块，主要用于小黑条高度的占位），然后吸底元素可以不改变高度只需要调整位置，像这样：
```
{
    margin-bottom: constant(safe-area-inset-bottom);
}
```
+ 空的颜色块：
```
{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: constant(safe-area-inset-bottom);
    background-color: #fff;
}
```
***类型二：fixed 非完全吸底元素（bottom ≠ 0），比如 “返回顶部”、“侧边广告” 等***

+ 像这种只是位置需要对应向上调整，可以仅通过外边距 margin 来处理：
```
{
    margin-bottom: constant(safe-area-inset-bottom);
}
```
+ 或者，你也可以通过计算函数 calc 覆盖原来 bottom 值：
```
{
    bottom: calc(50px(假设值) + constant(safe-area-inset-bottom));
}
```
#### 别忘了使用 @supports ####

- 写到这里，我们常见的两种类型的 fixed 元素适配方案已经了解了吧，但别忘了，一般我们只希望 iPhoneX 才需要新增适配样式，我们可以配合 @supports 这样编写样式：
```
@supports (bottom: constant(safe-area-inset-bottom)) {
    div {
        margin-bottom: constant(safe-area-inset-bottom);
    }
}
```



[SA1]:images/OV_LayoutGuides_Portrait.svg  "safe area1"

[SA2]:images/OV_LayoutGuides_Landscape.svg  "safe area2"
[contain]:images/640.webp  "contain"
[bottom]:images/6400.webp  "bottom"