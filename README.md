# MotionCanvas-Helpers
An easy way to make some animations in Motion Canvas.


To use it, place this helpers file under the folder named "src" of your project. Then you can import it as you like.

##Using the Animation Grid
```ts
function* myFunc(view : View2D){
    const grid = createRef<AnimatedGrid>();
    view.add(<AnimatedGrid ref={grid} size={[1920, 1080]} stroke={"#ff0034"} lineWidth={5} />) 
    yield* grid().play(0.3, 0.15)
}

export default makeScene2D(myFunc)
```
