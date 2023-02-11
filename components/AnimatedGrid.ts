import {Grid} from '@motion-canvas/2d/lib/components';
import { all, chain, loop} from '@motion-canvas/core/lib/flow';
import { SimpleSignal, createSignal } from '@motion-canvas/core/lib/signals';
import {useContext, useLogger} from '@motion-canvas/core/lib/utils';


export class AnimatedGrid extends Grid{
  protected drawing = false;

  protected override drawShape(context: CanvasRenderingContext2D): void {

    if(this.drawing){
      context.save();
      this.applyStyle(context);
      this.drawRipple(context);
  
      const spacing = this.spacing();
      const size = this.computedSize().scale(0.5);
      const steps = size.div(spacing).floored;
  
      for (let x = -steps.x; x <= steps.x; x++) {
        context.beginPath();
        context.moveTo(spacing.x * x, -size.height);
        context.lineTo(spacing.x * x, size.height);
        context.stroke();
      }
  
      for (let y = -steps.y; y <= steps.y; y++) {
        context.beginPath();
        context.moveTo(-size.width, spacing.y * y);
        context.lineTo(size.width, spacing.y * y);
        context.stroke();
      }
  
      context.restore();
    }    
  }
  
  public *play(){
    this.drawing = false;

    const spacing = this.spacing();
    const size = this.computedSize().scale(0.5);
    const steps = size.div(spacing).floored;
    const rot = this.rotation();
    useLogger().info(rot.toString())
    
    const xAxis : SimpleSignal<number, void>[] =[]
    const yAxis : SimpleSignal<number, void>[] =[]


    for (let x = -steps.x; x <= steps.x; x++) yAxis.push(createSignal(0));
    for (let y = -steps.y; y <= steps.y; y++) xAxis.push(createSignal(0));
    

    useContext(context => {
      if(this.drawing) return;
      context.save();
      this.applyStyle(context);
      this.drawRipple(context);
  
      for (let x = -steps.x; x <= steps.x; x++) {
        context.beginPath();
        context.moveTo(spacing.x * x, -yAxis[x + steps.x]());
        context.lineTo(spacing.x * x, yAxis[x + steps.x]());
        context.stroke();
      }
  
      for (let y = -steps.y; y <= steps.y; y++) {

        context.moveTo(-xAxis[y + steps.y](), spacing.y * y);
        context.lineTo(xAxis[y + steps.y](), spacing.y * y);

        context.stroke();
      }

      context.restore();
    })

    yield* all(
      chain(
        yAxis[steps.x](size.height, 0.5),
        all(
          loop(steps.y, i => xAxis[i + steps.y](size.width)),
          loop(steps.y, i => xAxis[steps.y - i](size.width)),
          loop(steps.x, i => yAxis[i + steps.x](size.height)),
          loop(steps.x, i => yAxis[steps.x - i](size.height))
        )
          
      ),

    )
      
    xAxis.splice(0, xAxis.length)
    yAxis.splice(0, yAxis.length)
    this.drawing = true;

    
  }

}
