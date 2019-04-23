import {Component, Input, Output, EventEmitter, ElementRef, SimpleChanges} from "@angular/core";
import {Observable} from "rxjs";

@Component({
   selector: 'input-debounce',
   template: '<md-input type="text" style="width:100%" ' +
   '[placeholder]="placeholder" [disabled]="disabled" [(ngModel)]="inputValue">'
})
export class InputDebounceComponent {
   @Input() placeholder: string;
   @Input() disabled: boolean;
   @Input() reset: boolean;
   @Input() delay: number = 300;
   @Output() value: EventEmitter<string> = new EventEmitter<string>();

   public inputValue: string;

   constructor(private elementRef: ElementRef) {
      const eventStream = Observable.fromEvent(elementRef.nativeElement, 'keyup')
         .map(() => this.inputValue)
         .debounceTime(this.delay)
         .distinctUntilChanged();

      eventStream.subscribe(input => this.value.emit(input));
   }

   ngOnChanges(changes: SimpleChanges) {
      // only run when property "reset" changed
      if (changes['reset']) {
         if (this.reset) {
            this.inputValue = "";
         }
      }
   }
}
