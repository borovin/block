[![Build Status](https://travis-ci.org/borovin/block.svg?branch=master)](https://travis-ci.org/borovin/block) [![Coverage Status](https://coveralls.io/repos/borovin/block/badge.svg?branch=master&service=github)](https://coveralls.io/github/borovin/block?branch=master) [![Code Climate](https://codeclimate.com/github/borovin/block/badges/gpa.svg)](https://codeclimate.com/github/borovin/block)
=====


Extended Backbone View

## Constructor

`new Block(config)`

Block can be initialized as regular function without new keyword.

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



### a

test property description

| Field | Type | Description |
| ----- | -----| ----------- |
| a.b | `string` | nested property description |





## Methods



### render(data)
Render method description

| Param | Type | Description |
| ----- | -----| ----------- |
| data | `object` | data which will be set to block instance before rendering. So you can get it in template throw this context. |





## Events


### initializing
initializing event triggers before initialize and render methods

| Property | Type | Description |
| ----- | -----| ----------- |
| block | `object` | block instance where the event was appeared |



### initialized
initialized event triggers after initialize and render methods

| Property | Type | Description |
| ----- | -----| ----------- |
| block | `object` | block instance where the event was appeared |







