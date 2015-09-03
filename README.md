# [![Build Status](https://travis-ci.org/borovin/block.svg?branch=master)](https://travis-ci.org/borovin/block) [![Coverage Status](https://coveralls.io/repos/borovin/block/badge.svg?branch=master&service=github)](https://coveralls.io/github/borovin/block?branch=master)

# Install

```
bower install borovin/block --save
```

# Use


Extended Backbone View

You can extend any Block class by static Block.extend method. This method set all passed properties to new block prototype using
deep merge method.

```
var SomeBlock = Block.extend({a: {b: 1}}, {a: {c: 2}});

var someBlock = new SomeBlock();

someBlock.a.b === 1;
someBlock.a.c === 2;
```

## Constructor

`new Block(config)`

Block can be initialized as regular function without new keyword.

```
var block = Block(config);
```

All config properties passed to constructor will be set on block instance using deep merge algorithm.

```
var SomeBlock = Block.extend({a: {b: 1}});
var someBlock = new SomeBlock({a: {c: 2}});
someBlock.a.b === 1;
someBlock.a.c === 2;
```

| Param | Type | Description |
| ----- | -----| ----------- |
| config | `object` | all properties from this config-object will be set on block instance |


## Properties



### el
`HTMLElement`
`selector`
`string`
`function`

Block element for initialization. It will be replaced with block.template during render process.
May be an existing DOM element or css selector.

```
new Block({
 el: '.page'
});

new Block({
 el: document.getElementById('page')
});
```



### events
`object`

Same as Backbone.View events. Delegate event listeners to block.el.

```
var SomeBlock = Block.extend({
     events: {
         'initialized .childBlock': function(e, childBlock){}
     }
});
```



### globalEvents
`object`

Same as events, but delegated to document. By global events independent block (not parent->child) can listen events from each other.

```
var SomeBlock = Block.extend({
     globalEvents: {
         'initialized .otherBlock': function(e, otherBlock){}
     }
});
```



### template
`string`
`function`

Result of template function will replace block.el during render process.
You can use any template engine. All block properties are available throw this context inside template function.

```
var SomeBlock = Block.extend({
     template: function(){
         return '<div>' + this.anyProperty + '</div>'
     }
});
```



### attributes
`function`
`object`

Map (or function that returns map) of html attributes which will be added to block.el during render process.

```
var block = new Block({
     project: 'reltio',
     attributes: function(){
         return {
             href: 'http://' + this.project + '.com',
             title: this.project + ' web site'
         }
     }
});
```



### className
`function`
`string`

String (or function that return string) which will be added to block.el class during render process.

```
var block = new Block({
     status: 'active',
     className: function(){
         return 'listItem ' + this.status;
     }
})
```



### id
`function`
`string`

String (or function that return string) which will be set as block.el id during render process.




## Methods



### render(data)
Render method set new data on block instance and invoke template function if it is defined. Current block

| Param | Type | Description |
| ----- | -----| ----------- |
| data | `object` | data which will be set to block instance before rendering. So you can get it in template throw this context. |



### get(keyPath)
You can get any block property by keypath. If one of the property is undefined get method return undefined (not error).
If one of the property is function it will be executed in block context and return the result to get method.

```
var block = new Block({
     text: 'string',
     a: {
         b: 2,
         c: function(){ return this.text; }
     }
});

block.get('a.b') // -> 2
block.get('a.c') // -> 'string'
block.get('a.b.c.d') // -> undefined
```

| Param | Type | Description |
| ----- | -----| ----------- |
| keyPath | `string` | path to property |



### set(keyPath, value)
Update or create property by keypath. If some property in this path does not exist it will be created automatically.
`set` method return only changed properties. All changed properties trigger change:propertyKeyPath event.

```
var block = new Block({
     a: {
         b: 1
     }
});

block.on('change:a.b', function(e, newValue){
     console.log(newValue) // -> 2
});

block.on('change:a', function(e, newValue){
     console.log(newValue) // -> {b: 2}
});

block.set('a.b', 2);
```

| Param | Type | Description |
| ----- | -----| ----------- |
| keyPath | `string` | path to property |
| value | `value` | new property value |



### include(constructor, params)
`include` method is proper way to decompose block into sub-blocks in template. It will automatically initialize and remove all nested
blocks during render process to avoid memory leaks.

```
var block = new Block({
     template: function() {
         return '<div>' + this.include(childBlock, {text: 'child'}) + '</div>'
     }
});
```

| Param | Type | Description |
| ----- | -----| ----------- |
| constructor | `object``function` | block class for initialization |
| params | `object` | child block config |



### initBlock(Child, params)
If you need to initialize child block manually (not inside template) you can use this method.
All child blocks will be properly removed when you remove parent block to avoid memory leaks.

```
var parentBlock = new Block();
var childBlock = parentBlock.initBlock(Block, {text: 'child'});
parentBlock.remove();
```

| Param | Type | Description |
| ----- | -----| ----------- |
| Child | `object``class` | block class for initialization |
| params | `object` | child block config |



### remove()
Removes block and all it's children. Clear all event listeners.



### trigger(event, data)
Trigger event with any data as event properties. Event will be triggered by block instance and block.el as well.

```
var block = new Block();

block.on('someEvent', function(data){});
block.$el.on('someEvent', function(e, data){});

block.trigger('someEvent');
```

| Param | Type | Description |
| ----- | -----| ----------- |
| event | `string` | event name |
| data | `value` | any additional data |




## Events


### initializing
initializing event triggers before initialize and render methods

```
block.on('initializing', function(block){});
```

| Property | Type | Description |
| ----- | -----| ----------- |
| block | `object` | block instance where the event was appeared |


### initialized
initialized event triggers after initialize and render methods

```
block.on('initialized', function(block){});
```

| Property | Type | Description |
| ----- | -----| ----------- |
| block | `object` | block instance where the event was appeared |







# Test

```
npm test
```

# Generate documentation

```
npm run docs
```
