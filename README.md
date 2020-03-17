# ECS

ECS framework written in TS.

## TODO
1. ComponentManager
2. Entity
3. System，system判断entity是否符合自身不一定非要完全按照component去判断
4. 实例的组件变化和容器变化需要在world里的队列中标注被更新
5. System需要队列缓存符合的entity，也需要从队列里判断被更新的entity是否符合自身
6. World
7. 多World并存