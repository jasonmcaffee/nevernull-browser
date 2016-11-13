
describe("nevernull", function() {

    it("should provide an api for access to raw values", function() {
        var mockObject = {};
        var testObject = nn(mockObject);
        expect(typeof testObject.prop1).toEqual('function');
    });

    it("should intercept all (including nested) property access and ensure properties are never null", function() {
        var mockObject = {};
        var testObject = nn(mockObject);
        expect(testObject.a()).toEqual(undefined);
        expect(testObject.b.c()).toEqual(undefined);
        expect(testObject.d.e.f.g.h.i.j()).toEqual(undefined);

        var undefinedObject;
        testObject = nn(undefinedObject);
        expect(testObject()).toEqual(undefinedObject);
    });

    it("should allow access to original values of properties which are defined", function() {
        var mockObject = {
            a:{
                b:'someValue'
            },
            c: 42,
            d: false,
            e: function(){return 22;},
            f: function(){return this.c;}
        };
        var testObject = nn(mockObject);

        expect(testObject()).toEqual(mockObject);
        expect(testObject.a()).toEqual(mockObject.a);
        expect(testObject.a.b()).toEqual(mockObject.a.b);
        expect(testObject.c()).toEqual(mockObject.c);
        expect(testObject.d()).toEqual(mockObject.d);
        expect( testObject.e()() ).toEqual(mockObject.e());
        expect( testObject.f()() ).toEqual(mockObject.f());
    });

    it("should reflect changes made to underlying object", function() {
        var mockObject = {
            a: {
                b: 123
            }
        };

        var testObject = nn(mockObject);

        mockObject.a.b = 456;
        expect(testObject.a.b()).toEqual(mockObject.a.b);

        mockObject.a = {b: 345};
        expect(testObject.a.b()).toEqual(mockObject.a.b);
    });

    it("should change underlying object when changes are made to nn function-object", function() {
        var mockObject = {
            a: {
                b: 'string'
            }
        };

        var testObject = nn(mockObject);

        testObject.a().b = 'another string';
        expect(testObject.a.b()).toEqual(mockObject.a.b);

        testObject().a = {b:'yet another string'};
        expect(testObject.a.b()).toEqual(mockObject.a.b);

    });

    it("should behave as normal objects when working with detached sub properties", function() {
        var person = {
            name: {
                first: 'jason'
            }
        };

        var nnPerson = nn(person);
        var nnName = nnPerson.name;

        nnName().first = 'bill';
        expect(nnName()).toEqual(person.name);

        //when reassigning detached properties, values are no longer expected to be equal
        var name = person.name;
        person.name = { first: 'julie' };

        expect(nnName()).toEqual(name);
        expect(person.name).not.toEqual(nnName());
    });

});