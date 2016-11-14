#nevernull browser
nevernull library made for the browser
Visit the [node version of nevernull](https://github.com/jasonmcaffee/nn) for more details.

## Examples
To easily try out nevernull, you can fork the codio project & box [here](https://codio.com/jasonmcaffee/nn/tree/README.md)

### No Uncaught ReferenceError or Uncaught TypeError Errors
The function-object returned from nn guarantees safe navigation of its object tree.
This allows us to avoid boilerplate value checking.
```
const emptyObject = {};
const nnEmptyObject = nn(emptyObject);

//this will not throw any errors.
nnEmptyObject.property.that.doesnt.exist;
```

### Easily Gain Access to Property Values
All properties accessed on a never null function-object are functions.
Executing the function property gives you the underlying value of proxied object, should the value exist.
```
let person = {
    name: {
        first: 'jason'
    }
};

let nnPerson = nn(person);

nnPerson.name();            // == { first: 'jason'}
nnPerson.name.first();      // == 'jason'
nnPerson.name.last();       // == undefined
nnPerson.employer.name();   // == undefined

nn(person).address.city()   // == undefined
```

## Install
### Bower
```
bower install nevernull
```
## Tests
To see the tests run in a browser, go [here](https://rawgit.com/jasonmcaffee/nevernull-browser/master/test.html)

## Supported Browsers
Firefox 47+, Chrome, iOS 10, Edge

## Unsupported Browsers
Android, IE 11, iOS 9

## ES6 Compatible Browsers
[Browser ES6 Compatibility](https://kangax.github.io/compat-table/es6/)
