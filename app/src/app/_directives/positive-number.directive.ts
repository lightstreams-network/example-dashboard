import {Directive, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from "@angular/forms";

@Directive({
   selector: '[positiveNumber]',
   providers: [{provide: NG_VALIDATORS, useExisting: PositiveNumberValidatorDirective, multi: true}]
})
export class PositiveNumberValidatorDirective implements Validator {
   validate(control: AbstractControl): {[key: string]: any} {
      return positiveNumberValidator()(control)
   }
}

export function positiveNumberValidator(): ValidatorFn {
   return (control: AbstractControl): {[key: string]: any} => {
      const invalid = !isPositiveNumber(control.value);
      return invalid ? {'negativeNumber': {value: control.value}} : null;
   };
}

export function isPositiveNumber(value: string) : boolean {
   let n = Math.floor(Number(value));
   return n >= 0;
}