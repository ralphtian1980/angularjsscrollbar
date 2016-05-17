var angular;
namespace Scroll {
    enum Display {
        Default = 1,
        OutFixedShow = 1,
        InFixedShow,
        InHide,
        OutHide,
        InShow,
        OutShow,
        OutFixedHide,
        InFixedHide
    }
    enum ScrollBarDisplay {
        fixed = 1,
        static
    } 
    enum Overflow {
        Default = 1,
        Both = 1,
        X,
        Y
    }
    enum ArrowState {
        HasArrow = 1,
        NoArrow
    }
    interface OverflowStyleSet {
        overflow: Overflow;
        display: Display;
    }
    interface BoxSize {
        width: number;
        Height: number;
    }
    enum MoveType {
        right = 1,
        bottom
    }
    export class Scrollbar {
        overflowStyleSet: Array<OverflowStyleSet>;
        private _sel: HTMLElement;
        overflow: Overflow;
        arrowType: ArrowState;
        ScrollDisplay: ScrollBarDisplay;
        arrowRightHeight: number;
        arrowBottomHeight: number;
        scrollBoxWidth: number;
        scrollBoxHeight: number;
        scrollItemWidth: number;
        scrollItemHeight: number;
        scrollMarginTop: number;
        scrollMarginleft: number;
        scrollBoxStrWidth: string;
        scrollBoxStrHeight: string;
        scrollMoveType: MoveType;
        scrollBarRightLineNumber: number;
        scrollBarBottomLineNumber: number;
        selfElement: HTMLElement;
        scrollShell: HTMLElement;
        scrollbox: HTMLElement;
        scrollbody: HTMLElement;
        scrollBarRight: HTMLElement;
        scrollBarRightLine: HTMLElement;
        scrollBarBottom: HTMLElement;
        scrollBarBottomLine: HTMLElement;
        scrollBarArrowTop: HTMLElement;
        scrollBarArrowBottom: HTMLElement;
        scrollBarArrowLeft: HTMLElement;
        scrollBarArrowRight: HTMLElement;
        scrollWidth: number;
        xpoint: number;
        ypoint: number;
        constructor(modules: any) {
            if (modules == undefined) {
                var app = angular.module("ScrollModule", []);
                app.directive("scroll", this.buildfunction);
            } else {
                modules.directive("scroll", this.buildfunction);
            }
        }
        private MousemoveMovefn = (e: any) => {
            try {
                if (this.scrollMoveType == MoveType.right) {
                    if (this.scrollBarRightLineNumber < this.scrollItemHeight) {
                        let margintop: number = this.scrollMarginTop;
                        let line: number = e.pageY - this.ypoint + margintop;
                        if (line < 0) {
                            line = 0;
                        }
                        if (this.arrowType == ArrowState.HasArrow) {
                            if (line > this.scrollItemHeight - this.scrollBarRightLineNumber - this.arrowRightHeight*2) {
                                line = this.scrollItemHeight - this.scrollBarRightLineNumber - this.arrowRightHeight * 2;
                            }
                        } else {
                            if (line > this.scrollItemHeight - this.scrollBarRightLineNumber) {
                                line = this.scrollItemHeight - this.scrollBarRightLineNumber;
                            }
                        }
                        this.ypoint = e.pageY;
                        this.scrollMarginTop = line;
                        angular.element(this.scrollBarRightLine).css("margin-top", line + "px");
                        angular.element(this.scrollbody).css("top", line * this.scrollBoxHeight / - this.scrollItemHeight + "px");
                    }
                }
                if (this.scrollMoveType == MoveType.bottom) {
                    if (this.scrollBarBottomLineNumber < this.scrollBoxWidth) {
                        let marginleft: number = this.scrollMarginleft;
                        let line: number = e.pageX - this.xpoint + marginleft;
                        if (line < 0) {
                            line = 0;
                        }
                        if (this.arrowType == ArrowState.HasArrow) {
                            if (line > this.scrollItemWidth - this.scrollBarBottomLineNumber-this.arrowBottomHeight*2) {
                                line = this.scrollItemWidth - this.scrollBarBottomLineNumber - this.arrowBottomHeight * 2;
                            }
                        }
                        else {
                            if (line > this.scrollItemWidth - this.scrollBarBottomLineNumber) {
                                line = this.scrollItemWidth - this.scrollBarBottomLineNumber;
                            }
                        }
                        this.xpoint = e.pageX;
                        this.scrollMarginleft = line;
                        angular.element(this.scrollBarBottomLine).css("margin-left", line + "px");
                        angular.element(this.scrollbody).css("left", line * this.scrollBoxWidth / - this.scrollItemWidth + "px");
                        //this.scrollBarBottomLine.style.marginLeft = line + "px";
                        //this.scrollbody.style.left = line * this.scrollBoxWidth / - this.scrollItemWidth + "px";
                    }
                }
                return false;
            } catch(e){
                return false;
            }
        }
        private MouseOverInBodys = (ex: any) => {
            angular.element(document).bind("mousewheel DOMMouseScroll", this.MousewheelScroll); 
        }
        private MouseleaveOutBodys = (ex: any) => {
            angular.element(document).unbind("mousewheel DOMMouseScroll", this.MousewheelScroll); 
        }
        private BottomScrollMove = (move: number) => {
            if (this.scrollBarBottomLineNumber < this.scrollBoxWidth) {
                let marginleft: number = this.scrollMarginleft;
                var line = move + marginleft;
                if (line < 0) {
                    line = 0;
                }
                if (this.arrowType == ArrowState.HasArrow) {
                    if (line > this.scrollItemWidth - this.scrollBarBottomLineNumber - this.arrowBottomHeight * 2) {
                        line = this.scrollItemWidth - this.scrollBarBottomLineNumber - this.arrowBottomHeight * 2;
                    }
                } else {
                    if (line > this.scrollItemWidth - this.scrollBarBottomLineNumber) {
                        line = this.scrollItemWidth - this.scrollBarBottomLineNumber;
                    }
                }
                this.scrollMarginleft = line;
                angular.element(this.scrollBarBottomLine).css("margin-left", line + "px");
                angular.element(this.scrollbody).css("left", line * this.scrollBoxWidth / - this.scrollItemWidth + "px");
            }
        }
        private RightScrollMove = (move: number) => {
            if (this.scrollBarRightLineNumber < this.scrollItemHeight) {
                let margintop: number = this.scrollMarginTop;
                var line = move + margintop;
                if (line < 0) {
                    line = 0;
                }
                if (this.arrowType == ArrowState.HasArrow) {
                    if (line > this.scrollItemHeight - this.scrollBarRightLineNumber - this.arrowRightHeight * 2) {
                        line = this.scrollItemHeight - this.scrollBarRightLineNumber - this.arrowRightHeight * 2;
                    }
                } else {
                    if (line > this.scrollItemHeight - this.scrollBarRightLineNumber) {
                        line = this.scrollItemHeight - this.scrollBarRightLineNumber;
                    }
                }
                this.scrollMarginTop = line;
                angular.element(this.scrollBarRightLine).css("margin-top", line + "px");
                angular.element(this.scrollbody).css("top", line * this.scrollBoxHeight / - this.scrollItemHeight + "px");
                //this.scrollBarRightLine.style.marginTop = line + "px";
                //this.scrollbody.style.top = line * this.scrollBoxHeight / - this.scrollItemHeight + "px";
            }
        }
        private MousewheelScroll = (e: any) => {
            var delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                (e.detail && (e.detail > 0 ? -1 : 1));              // firefox
            this.RightScrollMove(delta*-1);
            return false;
        }
        private MousemoveSelectfn = (ex: any) => {
            this.xpoint = ex.pageX;
            this.ypoint = ex.pageY
            this.scrollMoveType = MoveType.right;
            angular.element(document).bind("mousemove", this.MousemoveMovefn); 
        }
        private MousemoveSelectBtfn = (ex: any) => {
            this.xpoint = ex.pageX;
            this.ypoint = ex.pageY
            this.scrollMoveType = MoveType.bottom;
            angular.element(document).bind("mousemove", this.MousemoveMovefn); 
        }
        private MousemoveUnSelectfn = (ex: any) => {
            angular.element(document).unbind("mousemove", this.MousemoveMovefn); 
        }
        UpdateScroll = (): number => {
            if (this.selfElement.offsetHeight != this.scrollBoxHeight) {
                angular.element(this.scrollBarRightLine).unbind("mousedown", this.MousemoveSelectfn);
                this.scrollBoxHeight = this.selfElement.offsetHeight;
                let scrollH = this.scrollItemHeight;
                let DomH = this.selfElement.offsetHeight
                let ScrollNow = scrollH * scrollH / DomH;
                if (ScrollNow > this.scrollItemHeight) {
                    ScrollNow = this.scrollItemHeight;
                }
                if (this.arrowType == ArrowState.HasArrow) {
                    this.scrollBarRightLineNumber = ScrollNow - this.arrowRightHeight*2;
                    this.scrollBarRightLine.style.height = this.scrollBarRightLineNumber + "px";
                } else {
                    this.scrollBarRightLineNumber = ScrollNow;
                    this.scrollBarRightLine.style.height = ScrollNow + "px";
                }
                angular.element(this.scrollBarRightLine).bind("mousedown", this.MousemoveSelectfn);
            }
            if (this.selfElement.offsetWidth != this.scrollBoxWidth) {
                angular.element(this.scrollBarBottomLine).unbind("mousedown", this.MousemoveSelectBtfn);    
                this.scrollBoxWidth = this.selfElement.offsetWidth;
                let scrollH = this.scrollItemWidth;
                let DomH = this.selfElement.offsetWidth
                let ScrollNow = scrollH * scrollH / DomH;
                if (ScrollNow > this.scrollItemWidth) {
                    ScrollNow = this.scrollItemWidth;
                }
                if (this.arrowType == ArrowState.HasArrow) {
                    this.scrollBarBottomLineNumber = ScrollNow - this.arrowBottomHeight*2;
                    this.scrollBarBottomLine.style.width = this.scrollBarBottomLineNumber + "px";
                } else {
                    this.scrollBarBottomLineNumber = ScrollNow;
                    this.scrollBarBottomLine.style.width = ScrollNow + "px";
                }
                angular.element(this.scrollBarBottomLine).bind("mousedown", this.MousemoveSelectBtfn);
            }
            var y = this.selfElement;
            window.requestAnimationFrame(this.UpdateScroll);
            return 0;
        }

        buildfunction = () => {
            let myself = this;
            return {
                controller: function ($scope, $element, $attrs) {
                    let t = function (e) {
                        e.preventDefault(); 
                        return false;
                    }
                    let f = function () {
                        let transclude = angular.element($element).find("ng-transclude");
                        myself.scrollShell = $element;
                        let item = angular.element(transclude).children("div")[0];
                        let w = item.offsetWidth;
                        let h = item.offsetHeight;
                        let itemlist = (angular.element($element).children("div.selfElementCSS").children("div.selfElementCSS"));
                        myself.scrollbox = angular.element($element).children("div.scrollboxCSS")[0];
                        angular.element(myself.scrollbox).bind("mouseover", myself.MouseOverInBodys);
                        angular.element(myself.scrollbox).bind("mouseleave", myself.MouseleaveOutBodys);
                        angular.element(document).bind("mouseup", myself.MousemoveUnSelectfn);
                        for (let i = 0; i < itemlist.length; i++) {
                            if (angular.element(itemlist[i]).hasClass("scrollbodyCSS")) {
                                myself.scrollbody = itemlist[i];
                                myself.selfElement = angular.element(myself.scrollbody).children("div.selfElementCSS")[0];
                            }
                            if (angular.element(itemlist[i]).hasClass("scrollBarRightCSS")) {
                                myself.scrollBarRight = itemlist[i];
                                myself.arrowRightHeight = myself.scrollBarRight.clientWidth;
                                angular.forEach(angular.element(myself.scrollBarRight).children(), (childElement: any) => {
                                    if (angular.element(childElement).hasClass("scrollBarRightLineCSS")) {
                                        myself.scrollBarRightLine = childElement;
                                    }
                                    if (myself.arrowType == ArrowState.HasArrow) {
                                        if (angular.element(childElement).hasClass("sBRightArrowBoxCSS")) {
                                            if (angular.element(childElement).attr("name") == "up") {

                                                myself.scrollBarArrowTop = childElement;
                                                angular.element(childElement).css("height", myself.arrowRightHeight + "px")
                                                    .bind("click", () => {
                                                        myself.RightScrollMove(-1);
                                                    });
                                                var upelement = angular.element(childElement).children()[0];
                                                var length = myself.arrowRightHeight/2;
                                                var color = angular.element(upelement).css("border-color");
                                                angular.element(upelement).css("border-left", length + "px solid transparent").css("border-right", length+"px solid transparent")
                                                    .css("border-bottom", length + "px solid " + color).css("margin-top", length/2+"px");
                                            }
                                            if (angular.element(childElement).attr("name") == "down") {
                                                myself.scrollBarBottom = childElement;
                                                angular.element(childElement).css("height", myself.arrowRightHeight + "px").css("position", "absolute").css("bottom", "0px")
                                                    .bind("click", () => {
                                                        myself.RightScrollMove(1);
                                                    });
                                                var upelement = angular.element(childElement).children()[0];
                                                var length = myself.arrowRightHeight / 2;
                                                var color = angular.element(upelement).css("border-color");
                                                angular.element(upelement).css("border-left", length + "px solid transparent").css("border-right", length + "px solid transparent")
                                                    .css("border-top", length + "px solid " + color).css("margin-top", length / 2 + "px");
                                            }
                                        }
                                    }
                                });
                            }
                            if (angular.element(itemlist[i]).hasClass("scrollBarBottomCSS")) {
                                myself.scrollBarBottom = itemlist[i];
                                myself.arrowBottomHeight = myself.scrollBarBottom.clientHeight;
                                angular.forEach(angular.element(myself.scrollBarBottom).children(), (childElement: any) => {
                                    if (angular.element(childElement).hasClass("scrollBarBottomLineCSS")) {
                                        myself.scrollBarBottomLine = childElement;
                                    }
                                    if (myself.arrowType == ArrowState.HasArrow) {
                                        if (angular.element(childElement).hasClass("sBBottomArrowBoxCSS")) {
                                            if (angular.element(childElement).attr("name") == "right") {
                                                myself.scrollBarArrowRight = childElement;
                                                angular.element(childElement).css("width", myself.arrowBottomHeight + "px").css("position", "absolute").css("right", "0px")
                                                    .bind("click", () => {
                                                        myself.BottomScrollMove(1);
                                                    });
                                                var upelement = angular.element(childElement).children()[0];
                                                var length = myself.arrowBottomHeight / 2;
                                                var color = angular.element(upelement).css("border-color");
                                                angular.element(upelement).css("border-top", length + "px solid transparent").css("border-bottom", length + "px solid transparent")
                                                    .css("border-left", length + "px solid " + color).css("margin-left", length / 2 + "px");
                                            }
                                            if (angular.element(childElement).attr("name") == "left") {
                                                myself.scrollBarArrowLeft = childElement;
                                                angular.element(childElement).css("width", myself.arrowBottomHeight + "px").bind("click", () => {
                                                    myself.BottomScrollMove(-1);
                                                });
                                                var upelement = angular.element(childElement).children()[0];
                                                var length = myself.arrowBottomHeight / 2;
                                                var color = angular.element(upelement).css("border-color");
                                                angular.element(upelement).css("border-top", length + "px solid transparent").css("border-bottom", length + "px solid transparent")
                                                    .css("border-right", length + "px solid " + color).css("margin-left", length / 2 + "px");

                                            }
                                        }
                                    }
                                });
                            }
                        }
                        myself.scrollMarginTop = 0;
                        myself.scrollMarginleft = 0;
                        if (myself.ScrollDisplay == ScrollBarDisplay.static) {
                            angular.element(myself.scrollShell).css("margin-right", myself.arrowRightHeight + "px").css("margin-bottom", myself.arrowBottomHeight+ "px");
                        }
                        myself.UpdateScroll();
                        angular.element(myself.scrollBarRightLine).bind("dragstart", t);
                        angular.element(myself.scrollBarBottomLine).bind("dragstart", t);
                    };
                    angular.element().ready(f);
                },
                template: function ($scope, $element, $attrs) {
                    var isPX = /[1-9][0-9]*px/i;
                    var isNumber = /[1-9][0-9]*/i;
                    if ($element.ngDisplay != undefined) {
                        if (angular.uppercase($element.ngDisplay) == angular.uppercase(ScrollBarDisplay[ScrollBarDisplay.static])) {
                            myself.ScrollDisplay = ScrollBarDisplay.static;
                        } else {
                            myself.ScrollDisplay = ScrollBarDisplay.fixed;
                        }
                    }
                    if ($element.ngWidth == undefined) {
                        myself.scrollBoxWidth = myself.scrollItemWidth = 400;
                        myself.scrollBoxStrWidth = "400px";
                    } else {
                        if (isPX.exec($element.ngWidth) != null) {
                            myself.scrollBoxStrWidth = isPX.exec($element.ngWidth)[0];
                            myself.scrollBoxWidth = myself.scrollItemWidth = parseInt(myself.scrollBoxStrWidth.replace("px", ""));
                        } else {
                            if (isNumber.exec($element.ngWidth) != null) {
                                myself.scrollBoxWidth = myself.scrollItemWidth = parseInt(isNumber.exec($element.ngWidth)[0]);
                                myself.scrollBoxStrWidth = myself.scrollBoxWidth + "px";
                            } else {
                                myself.scrollBoxWidth = myself.scrollItemWidth = 400;
                                myself.scrollBoxStrWidth = "400px";
                            }
                        }
                    }
                    if ($element.ngHeight == undefined) {
                        myself.scrollBoxHeight = myself.scrollItemHeight = 400;
                        myself.scrollBoxStrHeight = "400px";
                    } else {
                        if (isPX.exec($element.ngHeight) != null) {
                            myself.scrollBoxStrHeight = isPX.exec($element.ngHeight)[0];
                            myself.scrollBoxHeight = myself.scrollItemHeight = parseInt(myself.scrollBoxStrHeight.replace("px", ""));
                        } else {
                            if (isNumber.exec($element.ngHeight) != null) {
                                myself.scrollBoxHeight = myself.scrollItemHeight = parseInt(isNumber.exec($element.ngHeight)[0]);
                                myself.scrollBoxStrHeight = myself.scrollBoxHeight + "px";
                            } else {
                                myself.scrollBoxHeight = myself.scrollItemHeight = 400;
                                myself.scrollBoxStrHeight = "400px";
                            }
                        }
                    }
                    if (angular.uppercase($element.ngArrow) == angular.uppercase( ArrowState[ArrowState.HasArrow])) {
                        myself.arrowType = ArrowState.HasArrow;
                        return '<div class="scrollShellCSS"><div class="scrollboxCSS" style="width:' + myself.scrollBoxStrWidth + '; height:' + myself.scrollBoxStrHeight + ';"><div class="scrollBarRightCSS" style="height: ' + myself.scrollBoxStrHeight + '; left: ' + myself.scrollBoxStrWidth + ';"><div name="up" class="sBRightArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div><div class="scrollBarRightLineCSS" style="margin-top: 0px; height: 0px;"></div><div name="down" class="sBRightArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div></div><div class="scrollBarBottomCSS" style="width: ' + myself.scrollBoxStrWidth + '; top: ' + myself.scrollBoxStrHeight + ';"><div name="left" class="sBBottomArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div><div class="scrollBarBottomLineCSS" style="margin-left: 0px; width: 0px;"></div><div name="right" class="sBBottomArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div></div><div class="scrollbodyCSS">' +
                            '<div class="selfElementCSS"><ng-transclude></ng-transclude>' +
                            '</div></div > </div></div>';
                    } else {
                        myself.arrowType = ArrowState.NoArrow;
                        return '<div class="scrollShellCSS"><div class="scrollboxCSS" style="width:' + myself.scrollBoxStrWidth + '; height:' + myself.scrollBoxStrHeight + ';"><div class="scrollBarRightCSS" style="height: ' + myself.scrollBoxStrHeight + '; left: ' + myself.scrollBoxStrWidth + ';"><div class="scrollBarRightLineCSS" style="margin-top: 0px; height: 0px;"></div></div><div class="scrollBarBottomCSS" style="width: ' + myself.scrollBoxStrWidth + '; top: ' + myself.scrollBoxStrHeight + ';"><div class="scrollBarBottomLineCSS" style="margin-left: 0px; width: 0px;"></div></div><div class="scrollbodyCSS">' +
                            '<div class="selfElementCSS"><ng-transclude></ng-transclude>' +
                            '</div></div > </div></div>';
                    }
                },
                compile: function (tElem, tAttrs, ex) {
                    var x = ex;
                },
                link: function (tElem, tAttrs, ex) {
                    var x = ex;
                },
                transclude: true,
                replace: true
            };
        }
    }
}