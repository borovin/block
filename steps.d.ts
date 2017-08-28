
type ICodeceptCallback = (i: CodeceptJS.I) => void;

declare const actor: () => CodeceptJS.I;
declare const Feature: (string: string) => void;
declare const Scenario: (string: string, callback: ICodeceptCallback) => void;
declare const Before: (callback: ICodeceptCallback) => void;
declare const After: (callback: ICodeceptCallback) => void;
declare const within: (selector: string, callback: Function) => void;

declare namespace CodeceptJS {
  export interface I {
    Nightmare: (function) => any; 
    haveHeader: (header, value) => any; 
    amOnPage: (amOnPage) => any; 
    seeInTitle: (seeInTitle) => any; 
    dontSeeInTitle: (dontSeeInTitle) => any; 
    grabTitle: () => any; 
    seeInCurrentUrl: (url) => any; 
    dontSeeInCurrentUrl: (url) => any; 
    seeCurrentUrlEquals: (seeCurrentUrlEquals) => any; 
    dontSeeCurrentUrlEquals: (dontSeeCurrentUrlEquals) => any; 
    see: (text, context=null) => any; 
    dontSee: (text, context=null) => any; 
    seeElement: (seeElement) => any; 
    dontSeeElement: (dontSeeElement) => any; 
    seeElementInDOM: (seeElementInDOM) => any; 
    dontSeeElementInDOM: (dontSeeElementInDOM) => any; 
    seeInSource: (seeInSource) => any; 
    dontSeeInSource: (dontSeeInSource) => any; 
    click: (click) => any; 
    doubleClick: (doubleClick) => any; 
    moveCursorTo: (moveCursorTo) => any; 
    executeScript: (fn) => any; 
    executeAsyncScript: (executeAsyncScript) => any; 
    resizeWindow: (width, height) => any; 
    checkOption: (checkOption) => any; 
    fillField: (fillField) => any; 
    clearField: (field) => any; 
    appendField: (appendField) => any; 
    seeInField: (field, value) => any; 
    dontSeeInField: (field, value) => any; 
    pressKey: (key) => any; 
    triggerMouseEvent: (event) => any; 
    seeCheckboxIsChecked: (field) => any; 
    dontSeeCheckboxIsChecked: (field) => any; 
    attachFile: (locator, pathToFile) => any; 
    grabTextFrom: (grabTextFrom) => any; 
    grabValueFrom: (grabValueFrom) => any; 
    grabAttributeFrom: (grabAttributeFrom) => any; 
    selectOption: (select, option) => any; 
    setCookie: (cookie) => any; 
    seeCookie: (name) => any; 
    dontSeeCookie: (name) => any; 
    grabCookie: (name) => any; 
    clearCookie: (cookie) => any; 
    wait: (sec) => any; 
    waitForText: (waitForText) => any; 
    waitForVisible: (waitForVisible) => any; 
    waitForElement: (waitForElement) => any; 
    refresh: () => any; 
    saveScreenshot: (saveScreenshot) => any; 
    scrollTo: (locator, offsetX=0, offsetY=0) => any; 
    debug: (msg) => any; 
    debugSection: (section, msg) => any; 
    seeHtml: (locator) => any; 
    collectCoverage: (collectCoverage) => any; 
    say: (msg) => any; 

  }
}

declare module "codeceptjs" {
    export = CodeceptJS;
}
