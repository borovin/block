[![Build Status](https://travis-ci.org/borovin/block.svg?branch=master)](https://travis-ci.org/borovin/block)
[![codecov](https://codecov.io/gh/borovin/block/branch/master/graph/badge.svg)](https://codecov.io/gh/borovin/block)
[![bitHound Overall Score](https://www.bithound.io/github/borovin/block/badges/score.svg)](https://www.bithound.io/github/borovin/block)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/borovin/block.svg)](https://greenkeeper.io/)

Set of UI blocks based on Custom Elements v1 spec and minimalistic core for creating your own custom elements from scratch.
All blocks follow material design guidelines.

# Motivation

The web is awesome. It is one of the best platform for applying your creativity and introducing new ideas. It could take just few hours from imagination to publishing new web app or component. In 2017 there are more than 400 000 modules available on npm. 400 000 ways for resolving your problem and creating new project. But behind this fantastic ecosystem the danger is confusing variety and difficulties in making decisions. You may create app prototype in few hours but later it could take months for choosing correct tech stack, testing different frameworks/libs and taking part in infinite holly wars :)
But the biggest problem here that we can't share and reuse our work between the projects based on different technologies.

I believe that it is time to change something and start to develop with pleasure ;) Scaling from prototype to production should depends only on human creativity not on tech quirks.

If we look back at the past, the most efficient tool we have found to share our knowledge and products with other people and communities are standards. Standards help us to create spaceships, cars, medical equipment and other awesome things using the full power of human community and creativity. Web development is quite young industry so standardization here is under active development. But last years were very impressive and productive. A lot of new standards and cool features was appeared and we can (actually we should) use it now.

The most obsolete and frozen part of web standards was UI. We use standard HTML elements like inputs, forms, lists, etc... 10s years. At the same time the web industry experiencing rapid growth. It is absolutely impossible to satisfy all modern business requirements using the 20 years old standards. That's why so many custom UI frameworks and libraries was introduced during the last few years. Some of those libs are perfectly do its work.
The bad thing is that those libs break up JS community into disconnected groups without any way to reuse the same components between different projects. If you wrote your UI application using React it is almost impossible to reuse your React components in Angular project and vice versa.

#### Web components to the rescue

Web components are set of Web standards which are designed to change the situation. The foundation of
those standards is Custom Elements API which got living standard status recently. Here is great article describing it https://developers.google.com/web/fundamentals/getting-started/primers/customelements. Some browsers don't support this API for now but all of them actively work on implementation. To fill the gap there is very small polyfill (~4kb): https://www.npmjs.com/package/@webcomponents/custom-elements which also got stable version 1.0 recently.

In short, that's why I choose Custom Elements API for building yet another UI kit :)

# Installation and usage

The simplest way to use this kit is including this script tag in your web app:

```
<script src="https://unpkg.com/@basket/block/dist/kit.js"></script>
```

After that you will be able to use any of custom elements described below. Just insert the proper tag anywhere in your markup.

If you use some module bundler like Webpack or Rollup you could install this lib through npm:

```
npm install @basket/block --save
```

and use elements separately:

```
import '@basket/block/b-input-text'
```

All blocks use ES modules standard for imports and exports so be sure your module bundler supports ES modules.

# Blocks (Custom Elements)

## b-action-button
**Spec**: https://material.io/guidelines/components/buttons-floating-action-button.html

**Example**: http://jsbin.com/tusebor/edit?html,output

```
<b-action-button></b-action-button>
```

**Reflected properties**:
* **color**: 'primary'
* **small**: false
* **icon**: false // path to icon file (svg supported) or any material design icon name

## b-button
**Spec**: https://material.io/guidelines/components/buttons.html

**Example**: http://jsbin.com/heqadar/edit?html,output

```
<b-button>Button text</b-button>
```

**Reflected properties**:
* **color**: 'primary'

## b-dialog
**Spec**: https://material.io/guidelines/components/dialogs.html

**Example**: http://jsbin.com/zuveqik/edit?html,output

```
<b-dialog>Dialog content</b-dialog>
```

**Reflected properties**:
* **opened**: false

## b-form
**Example**: http://jsbin.com/depiker/edit?html,output

```
<b-form>Form content</b-form>
```

**reflected properties**:
* **action**: document.location.pathname

## b-icon
**Spec**: https://material.io/guidelines/style/icons.html

**Example**: http://jsbin.com/cexabof/edit?html,output

```
<b-icon></b-icon>
```

**Reflected properties**:
* **src**: false // path to icon file (svg supported) or any material design icon name
* **size**: 48 // 18, 24, 36 or 56

## b-input-checkbox
**Spec**: https://material.io/guidelines/components/selection-controls.html#selection-controls-checkbox

**Example**: http://jsbin.com/lokecem/edit?html,output

```
<b-input-checkbox>Checkbox label</b-input-checkbox>
```

**Reflected properties**:
* **name**: false
* **checked**: false

## b-input-radio
**Spec**: https://material.io/guidelines/components/selection-controls.html#selection-controls-radio-button

**Example**: http://jsbin.com/suwalor/edit?html,output

```
<b-input-radio>Radio button label</b-input-radio>
```

**Reflected properties**:
* **value**: false
* **name**: false
* **checked**: false

## b-input-switch
**Spec**: https://material.io/guidelines/components/selection-controls.html#selection-controls-switch

**Example**: http://jsbin.com/lihabip/edit?html,output

```
<b-input-switch>Switch button label</b-input-switch>
```

**Reflected properties**:
* **name**: false
* **checked**: false

## b-input-text
**Spec**: https://material.io/guidelines/components/text-fields.html

**Example**: http://jsbin.com/podizad/edit?html,output

```
<b-input-text></b-input-text>
```

**Reflected properties**:
* **label**: false
* **value**: false
* **type**: 'text'
* **placeholder**: false
* **error**: false
* **name**: false

## b-progress-circular
**Spec**: https://material.io/guidelines/components/progress-activity.html

**Example**: http://jsbin.com/cuxuniz/edit?html,output

```
<b-progress-circular></b-progress-circular>
```

**Reflected properties**:
* **color**: 'primary'

## b-progress-linear
**Spec**: https://material.io/guidelines/components/progress-activity.html

**Example**: http://jsbin.com/qafatox/edit?html,output

```
<b-progress-linear></b-progress-linear>
```

**Reflected properties**:
* **color**: 'primary'

## b-tabs
**Spec**: https://material.io/guidelines/components/tabs.html

**Example**: http://jsbin.com/penucas/edit?html,output

```
<b-tabs>
    <b-tabs--item href="#item1">Item One</b-tabs--item>
    <b-tabs--item href="#item2" active>Item Two</b-tabs--item>
    <b-tabs--item href="#item3">Item Three</b-tabs--item>
</b-tabs>
```

## b-textarea
**Spec**: https://material.io/guidelines/components/text-fields.html

**Example**: http://jsbin.com/casehu/edit?html,output

**Reflected properties**:
* **label** false
* **placeholder** false
* **error** false
* **name** false
* **rows** 1


```
<b-textarea>Textarea value</b-textarea>
```

## b-toolbar
**Spec**: https://material.io/guidelines/components/toolbars.html

**Example**: http://jsbin.com/yasiduq/edit?html,output

```
<b-toolbar>Toolbar content</b-toolbar>
```



