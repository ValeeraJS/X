# X

An ECS framework written in TS.

This framework is designed not only for game developing, but also could be used in common front-end framework.

## TODO
1. 多World的使用、资源共享与通讯
2. 更加丰富和完善的事件机制
3. 性能优化，增加一些机制来减少因为组件和系统的动态改变而做出的一些计算
4. 混合模式与基于混合的多“继承”
5. 子系统
6. 子组件
7. 子实例

## Why X
X的目标不是一个专门为游戏设计的ECS框架，而是最纯粹的与任何业务都无关的极其轻量的框架。

当我们开发为游戏领域的ECS框架，我们完全可以基于这个框架进行开发，X不会携带业务相关的任何代码，只包含纯理论实现，因此X更容易为各类游戏去定制有特色的底层框架。
另一个方面，传统的前端框架是采用MVVM的，而ESC架构提供了新的思路。很多实际场景ECS比MVVM更适合，更简单，更高效。尤其是重度注重交互，动态性的前端应用。我们完全可以将X与jsx语法结合开发出一套与react原理完全不一样的前端框架。
