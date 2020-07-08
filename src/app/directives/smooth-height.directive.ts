import { Directive, OnChanges, Input, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[smoothHeight]',
  host: { '[style.display]': '"block"', '[style.overflow]': '"hidden"' }
})
export class SmoothHeightDirective implements OnChanges {
  @Input()
  smoothHeight;
  pulse: boolean;
  startHeight: number;

  constructor(private element: ElementRef) {}

  @HostBinding('@grow')
  get grow() {
    return { value: this.pulse, params: { startHeight: this.startHeight } };
  }

  setStartHeight();
  setStartHeight(height: number);
  setStartHeight(height?: number) {
    this.startHeight = height !== undefined ? height : this.element.nativeElement.clientHeight;
  }

  ngOnChanges(changes) {
    if (this.smoothHeight) {
      this.setStartHeight();
    } else {
      this.setStartHeight(0);
    }
    this.pulse = !this.pulse;
  }
}