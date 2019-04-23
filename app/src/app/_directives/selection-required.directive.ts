import {Directive, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from "@angular/forms";

@Directive({
   selector: '[selectionrequired]',
   providers: [{provide: NG_VALIDATORS, useExisting: SelectionRequiredDirective, multi: true}]
})
export class SelectionRequiredDirective implements Validator {
   validate(control: AbstractControl): {[key: string]: any} {
      if (control.value === null)
         return null;

      const invalid = (control.value === null || control.value === '');
      return invalid ? {'selectionrequired': {value: control.value}} : null;
   }
}
