import { trigger, transition, style, animate } from '@angular/animations';

export const smoothHeight = trigger('grow', [
  // transition('void <=> *', []),
  transition('* <=> *', [style({ 'max-height': '{{startHeight}}px' }), animate('1s ease')], {
    // params: { startHeight: 0 }
  })
]);

export const fold = trigger('fold', [
  transition(':enter', [style({height: 0, overflow: 'hidden'}), animate('.3s ease', style({height: '*'}))]),
  transition(':leave', [style({height: '*', overflow: 'hidden'}), animate('.3s ease', style({height: 0}))])
]);