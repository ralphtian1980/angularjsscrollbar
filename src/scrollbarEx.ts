var angular;
namespace Scroll {
    enum ArrowState {
        HasArrow = 1,
        NoArrow
    }
    enum Refresh{
        Normal = 1,
        Manual,
        Auto
    }
    enum ScrollBarDisplay {
        Fixed = 1,
        Static,
        InFixed,
        InStatic,
        None
    }
    enum MoveType {
        right = 1,
        bottom
    }
    enum Direction {
        xy = 1,
        x,
        y
    }
    enum Layout {
        Solid=1,
        Percentage,
        WSolid,
        HSolid,
        WPercentage,
        HPercentage
    }
    enum Config {
        Normal = 1,
        Detail
    }
    export class ScrollbarEx {
        scrollbarRefresh: Refresh;
        public Directive: any;
        xpoint: number;
        ypoint: number;
        scrollMoveType: MoveType;
        ArrowCss: any;
        ArrowCssBackground: any;
        arrowBottomHeight: number;
        arrowRightHeight: number;
        arrowType: ArrowState;
        scrollBarArrowBottom: HTMLElement;
        scrollBarArrowLeft: HTMLElement;
        scrollBarArrowRight: HTMLElement;
        scrollBarArrowTop: HTMLElement;
        scrollBarBottom: HTMLElement;
        scrollBarBottomLine: HTMLElement;
        scrollBarBottomLineNumber: number;
        scrollBarRight: HTMLElement;
        scrollBarRightLine: HTMLElement;
        scrollBarRightLineNumber: number;
        scrollbody: HTMLElement;
        scrollbox: HTMLElement;
        scrollBoxHeight: number;
        scrollBoxWidth: number;
        scrollConfig: Config;
        ScrollDisplay: ScrollBarDisplay;
        scrollItemHeight: number;
        scrollItemWidth: number;
        scrollLayoutHeight: Layout = Layout.Solid;
        scrollLayoutWidth: Layout = Layout.Solid;
        scrollMarginleft: number;
        scrollMarginTop: number;
        scrollShell: HTMLElement;
        selfElement: HTMLElement;
        static ScrollBarList: Array<ScrollbarEx>=[];
        scrollBoxStrWidth = (): string => {
            if (this.scrollLayoutWidth == Layout.Percentage) {
                return this.scrollBoxWidth + "%";
            } else {
                return this.scrollBoxWidth + "px";
            }
        }
        scrollBoxStrHeight = (): string => {
            if (this.scrollLayoutHeight == Layout.Percentage) {
                return this.scrollBoxHeight + "%";
            } else {
                return this.scrollBoxHeight + "px";
            }
        }
        constructor(modules: any) {
            this.Directive = this.buildfunction();
            ScrollbarEx.ScrollBarList.push(this);
            return this.Directive;
        }
        buildfunction = (): any => {
            let myself = this;
            return {
                controller: function ($scope, $element, $attrs) {
                    let t = function (e) {
                        e.preventDefault();
                        return false;
                    }
                    let f = function () {
                        let transclude = angular.element($element).find("ng-transclude");
                        myself.scrollShell = $element[0];
                        let item = angular.element(transclude).children("div")[0];
                        let w = item.offsetWidth;
                        let h = item.offsetHeight;
                        let itemlist = (angular.element($element).children("div.selfElementCSS").children("div.selfElementCSS"));
                        myself.scrollbox = angular.element($element).children("div.scrollboxCSS")[0];
                        if (myself.scrollLayoutHeight == Layout.Percentage) {
                            myself.scrollItemHeight = myself.scrollbox.clientHeight;                            
                        }
                        if (myself.scrollLayoutWidth == Layout.Percentage) {
                            myself.scrollItemWidth = myself.scrollbox.clientWidth;
                        }
                        angular.element(myself.scrollbox).bind("mouseover", myself.MouseOverInBodys);
                        angular.element(myself.scrollbox).bind("mouseleave", myself.MouseleaveOutBodys);
                        angular.element(document).bind("mouseup", myself.MousemoveUnSelectfn);
                        for (let i = 0; i < itemlist.length; i++) {
                            if (angular.element(itemlist[i]).hasClass("scrollbodyCSS")) {
                                myself.scrollbody = itemlist[i];
                                myself.selfElement = angular.element(myself.scrollbody).children("div.selfElementCSS")[0];
                                if (myself.scrollbarRefresh == Refresh.Normal) {
                                    var mo = new MutationObserver(() => { myself.UpdateScroll(); });
                                    var option = {
                                        'subtree': true,
                                        'characterData': true
                                    };
                                    mo.observe(myself.selfElement, option);
                                }
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
                                                myself.BuildArrow(angular.element(childElement).css("height", myself.arrowRightHeight + "px"), angular.element(childElement).children()[0],
                                                    myself.arrowRightHeight / 2, "border-left", "border-right", "border-bottom", "margin-top",
                                                    myself.RightScrollMove, -1, () => { return myself.scrollMarginTop != 0; });
                                            }
                                            if (angular.element(childElement).attr("name") == "down") {
                                                myself.scrollBarArrowBottom = childElement;
                                                myself.BuildArrow(angular.element(childElement).css("height", myself.arrowRightHeight + "px").css("position", "absolute").css("bottom", "0px"), angular.element(childElement).children()[0], myself.arrowRightHeight / 2,
                                                    "border-left", "border-right", "border-top", "margin-top", myself.RightScrollMove, 1, () => { return (myself.scrollMarginTop != (myself.scrollItemHeight - myself.scrollBarRightLineNumber - myself.arrowRightHeight * 2)); });
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
                                                myself.BuildArrow(angular.element(childElement).css("width", myself.arrowBottomHeight + "px").css("position", "absolute").css("right", "0px"),
                                                    angular.element(childElement).children()[0], myself.arrowBottomHeight / 2, "border-top", "border-bottom", "border-left", "margin-left",
                                                    myself.BottomScrollMove, 1, () => { return myself.scrollMarginleft != (myself.scrollItemWidth - myself.scrollBarBottomLineNumber - myself.arrowBottomHeight * 2); });
                                            }
                                            if (angular.element(childElement).attr("name") == "left") {
                                                myself.scrollBarArrowLeft = childElement;
                                                myself.BuildArrow(angular.element(childElement).css("width", myself.arrowBottomHeight + "px"), angular.element(childElement).children()[0],
                                                    myself.arrowBottomHeight / 2, "border-top", "border-bottom", "border-right", "margin-left", myself.BottomScrollMove, -1
                                                    , () => { return myself.scrollMarginleft != 0; });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        myself.scrollMarginTop = 0;
                        myself.scrollMarginleft = 0;
                        if (myself.ScrollDisplay == ScrollBarDisplay.Static) {
                            angular.element(myself.scrollShell).css("margin-right", myself.arrowRightHeight + "px").css("margin-bottom", myself.arrowBottomHeight + "px");
                        }
                        myself.UpdateScroll();
                        angular.element(myself.scrollBarRightLine).bind("dragstart", t);
                        angular.element(myself.scrollBarBottomLine).bind("dragstart", t);
                        if (myself.scrollbarRefresh == Refresh.Normal) {
                            angular.element(window).bind("resize", function (e) {
                                myself.UpdateScroll();
                            });
                        }
                    };
                    angular.element().ready(f);
                },
                template: function ($scope, $element, $attrs) {
                    let isX: boolean = false;
                    let isY: boolean = false;
                    if ($element.ngDirection == undefined) {
                        isX = true;
                        isY = true;
                    }
                    else {
                        if (angular.uppercase($element.ngDirection).indexOf("x") > -1) {
                            isX = true;
                        }
                        if (angular.uppercase($element.ngDirection).indexOf("y") > -1) {
                            isY = true
                        }
                    }
                    if ($element.ngLayout != undefined) {
                        if (angular.uppercase($element.ngLayout).indexOf(angular.uppercase(Layout[Layout.WPercentage])) > -1) {
                            myself.scrollLayoutWidth = Layout.Percentage;
                        }
                        if (angular.uppercase($element.ngLayout).indexOf(angular.uppercase(Layout[Layout.HPercentage])) > -1) {
                            myself.scrollLayoutHeight = Layout.Percentage;
                        }
                        if (angular.uppercase($element.ngLayout).indexOf(angular.uppercase(Layout[Layout.WSolid])) > -1) {
                            myself.scrollLayoutWidth = Layout.Solid;
                        }
                        if (angular.uppercase($element.ngLayout).indexOf(angular.uppercase(Layout[Layout.HSolid])) > -1) {
                            myself.scrollLayoutHeight = Layout.Solid;
                        }

                    }
                    //if ($element.ngLayout != undefined && angular.uppercase($element.ngLayout).indexOf( angular.uppercase(Layout[Layout.Percentage]))) {
                    //    myself.scrollLayoutWidth =  Layout.Percentage;
                    //    myself.scrollLayoutHeight = Layout.Percentage;
                    //} else {
                    //    myself.scrollLayoutWidth = Layout.Solid;
                    //    myself.scrollLayoutHeight = Layout.Solid;
                    //}
                    myself.scrollbarRefresh = Refresh.Normal;
                    if ($element.ngRefresh != undefined) {
                        if (angular.uppercase($element.ngRefresh) == angular.uppercase(Refresh[Refresh.Auto])) {
                            myself.scrollbarRefresh = Refresh.Auto;
                        }
                        if (angular.uppercase($element.ngRefresh) == angular.uppercase(Refresh[Refresh.Manual])) {
                            myself.scrollbarRefresh = Refresh.Manual;
                        }
                    }
                    var isNumber = /[1-9][0-9]*/i;
                    if ($element.ngDisplay != undefined) {
                        if (angular.uppercase($element.ngDisplay) == angular.uppercase(ScrollBarDisplay[ScrollBarDisplay.Static])) {
                            myself.ScrollDisplay = ScrollBarDisplay.Static;
                        } else {
                            myself.ScrollDisplay = ScrollBarDisplay.Fixed;
                        }
                    }
                    if ($element.ngWidth == undefined) {
                        myself.scrollBoxWidth = myself.scrollItemWidth = 400;
                    } else {
                        if (isNumber.exec($element.ngWidth) != null) {
                            myself.scrollBoxWidth = myself.scrollItemWidth = parseInt(isNumber.exec($element.ngWidth)[0]);
                        } else {
                            myself.scrollBoxWidth = myself.scrollItemWidth = 400;
                        }

                    }
                    if ($element.ngHeight == undefined) {
                        myself.scrollBoxHeight = myself.scrollItemHeight = 400;
                    } else {

                        if (isNumber.exec($element.ngHeight) != null) {
                            myself.scrollBoxHeight = myself.scrollItemHeight = parseInt(isNumber.exec($element.ngHeight)[0]);
                        } else {
                            myself.scrollBoxHeight = myself.scrollItemHeight = 400;
                        }
                    }
                    
                    if (angular.uppercase($element.ngArrow) == angular.uppercase(ArrowState[ArrowState.HasArrow])) {
                        myself.arrowType = ArrowState.HasArrow;
                        return '<div class="scrollShellCSS"><div class="scrollboxCSS" style="width:' + myself.scrollBoxStrWidth() + '; height:' + myself.scrollBoxStrHeight() + ';"><div class="scrollBarRightCSS" style="height: ' + myself.scrollBoxStrHeight() + '; left: ' + myself.scrollBoxStrWidth() + ';"><div name="up" class="sBRightArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div><div class="scrollBarRightLineCSS" style="margin-top: 0px; height: 0px;"></div><div name="down" class="sBRightArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div></div><div class="scrollBarBottomCSS" style="width: ' + myself.scrollBoxStrWidth() + '; top: ' + myself.scrollBoxStrHeight() + ';"><div name="left" class="sBBottomArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div><div class="scrollBarBottomLineCSS" style="margin-left: 0px; width: 0px;"></div><div name="right" class="sBBottomArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div></div><div class="scrollbodyCSS">' +
                            '<div class="selfElementCSS"><ng-transclude></ng-transclude>' +
                            '</div></div > </div></div>';
                    } else {
                        myself.arrowType = ArrowState.NoArrow;
                        return '<div class="scrollShellCSS" style="width:' + myself.scrollBoxStrWidth() + '; height:' + myself.scrollBoxStrHeight() + ';"><div class="scrollboxCSS" ><div class="scrollBarRightCSS" style="height: ' + (myself.scrollLayoutHeight == Layout.Percentage ? "100%" : myself.scrollBoxStrHeight()) +
                            '; left: ' + (myself.scrollLayoutWidth == Layout.Percentage ? "100%" : myself.scrollBoxStrWidth())
                            + ';"><div class="scrollBarRightLineCSS" style="margin-top: 0px; height: 0px;"></div></div><div class="scrollBarBottomCSS" style="width: ' + (myself.scrollLayoutWidth == Layout.Percentage ? "100%" : myself.scrollBoxStrWidth()) + '; top: ' + (myself.scrollLayoutHeight == Layout.Percentage ? "100%" : myself.scrollBoxStrHeight()) + ';"><div class="scrollBarBottomLineCSS" style="margin-left: 0px; width: 0px;"></div></div><div class="scrollbodyCSS">' +
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
                restrict: 'E',
                transclude: true,
                replace: true
            };
        }
        private MouseOverInBodys = (ex: any) => {
            angular.element(ex.currentTarget).bind("mousewheel DOMMouseScroll", this.MousewheelScroll);
        }
        private MouseleaveOutBodys = (ex: any) => {
            angular.element(ex.currentTarget).unbind("mousewheel DOMMouseScroll", this.MousewheelScroll);
        }
        private MousemoveUnSelectfn = (ex: any) => {
            angular.element(document).unbind("selectstart", this.NoSelect);
            angular.element(document.body).removeClass("noselect");
            angular.element(document).unbind("mousemove", this.MousemoveMovefn);
        }
        private BuildArrow = (childElement: any, element: HTMLElement, length: number, styleone: string, styletwo: string, stylethree: string, stylefour: string, movefunction: any, v: number, transformfunction: any) => {
            this.ArrowCss = this.ArrowCss || window.getComputedStyle(element, "border-left-color")["border-left-color"];
            this.ArrowCssBackground = this.ArrowCssBackground || window.getComputedStyle(element, "border-left-color")["background-color"];
            childElement
                .bind("click", () => {
                    movefunction(v);
                }).bind("mousedown", () => {
                    angular.element(element).css(stylethree + "-color", this.ArrowCssBackground);
                }).bind("mouseup", () => {
                    if (transformfunction()) {
                        angular.element(element).css(stylethree + "-color", this.ArrowCss);
                    }
                });
            angular.element(element).css(styleone, length + "px solid transparent").css(styletwo, length + "px solid transparent")
                .css(stylethree, length + "px solid " + this.ArrowCss).css(stylefour, length / 2 + "px").css("background-color", "transparent");
        }
        private RightScrollMove = (move: number) => {
            if (this.scrollBarRightLineNumber < this.scrollItemHeight) {
                let margintop: number = this.scrollMarginTop;
                var line = move + margintop;
                let upcolor = this.ArrowCss;
                let downcolor = this.ArrowCss;
                if (line < 0) {
                    line = 0;
                    upcolor = this.ArrowCssBackground;
                }
                if (this.arrowType == ArrowState.HasArrow) {
                    if (line > this.scrollItemHeight - this.scrollBarRightLineNumber - this.arrowRightHeight * 2) {
                        line = this.scrollItemHeight - this.scrollBarRightLineNumber - this.arrowRightHeight * 2;
                        downcolor = this.ArrowCssBackground;
                    }
                } else {
                    if (line > this.scrollItemHeight - this.scrollBarRightLineNumber) {
                        line = this.scrollItemHeight - this.scrollBarRightLineNumber;
                        downcolor = this.ArrowCssBackground;
                    }
                }
                this.ArrowChangColor(angular.element(this.scrollBarArrowTop).children()[0], "border-bottom-color", upcolor);
                this.ArrowChangColor(angular.element(this.scrollBarArrowBottom).children()[0], "border-top-color", downcolor);
                this.scrollMarginTop = line;
                angular.element(this.scrollBarRightLine).css("margin-top", line + "px");
                angular.element(this.scrollbody).css("top", line * this.scrollBoxHeight / - this.scrollItemHeight + "px");
            }
        }
        private BottomScrollMove = (move: number) => {
            if (this.scrollBarBottomLineNumber < this.scrollBoxWidth) {
                let marginleft: number = this.scrollMarginleft;
                var line = move + marginleft;
                let rightcolor = this.ArrowCss;
                let leftcolor = this.ArrowCss;
                if (line < 0) {
                    line = 0;
                    leftcolor = this.ArrowCssBackground;
                }
                if (this.arrowType == ArrowState.HasArrow) {
                    if (line > this.scrollItemWidth - this.scrollBarBottomLineNumber - this.arrowBottomHeight * 2) {
                        line = this.scrollItemWidth - this.scrollBarBottomLineNumber - this.arrowBottomHeight * 2;
                        rightcolor = this.ArrowCssBackground;
                    }
                } else {
                    if (line > this.scrollItemWidth - this.scrollBarBottomLineNumber) {
                        line = this.scrollItemWidth - this.scrollBarBottomLineNumber;
                        rightcolor = this.ArrowCssBackground;
                    }
                }
                this.ArrowChangColor(angular.element(this.scrollBarArrowLeft).children()[0], "border-right-color", leftcolor);
                this.ArrowChangColor(angular.element(this.scrollBarArrowRight).children()[0], "border-left-color", rightcolor);
                this.scrollMarginleft = line;
                angular.element(this.scrollBarBottomLine).css("margin-left", line + "px");
                angular.element(this.scrollbody).css("left", line * this.scrollBoxWidth / - this.scrollItemWidth + "px");
            }
        }
        public UpdateScroll = (): number => {
            if (this.scrollLayoutHeight == Layout.Percentage) {
                if (this.scrollItemHeight != this.scrollbox.clientHeight) {
                    this.scrollItemHeight = this.scrollbox.clientHeight;
                    this.scrollBoxHeight = 0;
                }
            }
            if (this.scrollLayoutWidth == Layout.Percentage) {
                if (this.scrollItemWidth != this.scrollbox.clientWidth) {
                    this.scrollItemWidth = this.scrollbox.clientWidth;
                    this.scrollBoxWidth = 0;
                }
            }
            if (this.selfElement.offsetHeight != this.scrollBoxHeight) {
                var x = this.selfElement.offsetHeight;
                var y = this.scrollBoxHeight;
                angular.element(this.scrollBarRightLine).unbind("mousedown", this.MousemoveSelectfn);
                this.scrollBoxHeight = this.selfElement.offsetHeight;
                let scrollH = this.scrollItemHeight;
                let DomH = this.selfElement.offsetHeight
                let ScrollNow = scrollH * scrollH / DomH;
                if (ScrollNow > this.scrollItemHeight) {
                    ScrollNow = this.scrollItemHeight;
                }
                if (this.arrowType == ArrowState.HasArrow) {
                    this.scrollBarRightLineNumber = ScrollNow - this.arrowRightHeight * 2;
                    this.scrollBarRightLine.style.height = this.scrollBarRightLineNumber + "px";
                } else {
                    this.scrollBarRightLineNumber = ScrollNow;
                    this.scrollBarRightLine.style.height = ScrollNow + "px";
                }
                angular.element(this.scrollBarRightLine).bind("mousedown", this.MousemoveSelectfn);
                if (ScrollNow == this.scrollItemHeight) {
                    angular.element(this.scrollBarRight).css("display", "none");
                } else {
                    angular.element(this.scrollBarRight).css("display", "block");
                }
                this.RightScrollMove(0);
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
                    this.scrollBarBottomLineNumber = ScrollNow - this.arrowBottomHeight * 2;
                    this.scrollBarBottomLine.style.width = this.scrollBarBottomLineNumber + "px";
                } else {
                    this.scrollBarBottomLineNumber = ScrollNow;
                    this.scrollBarBottomLine.style.width = ScrollNow + "px";
                }
                angular.element(this.scrollBarBottomLine).bind("mousedown", this.MousemoveSelectBtfn);
                if (ScrollNow == this.scrollItemWidth) {
                    angular.element(this.scrollBarBottom).css("display", "none");
                } else {
                    angular.element(this.scrollBarBottom).css("display", "block");
                }
                this.BottomScrollMove(0);
            }
            if (this.scrollbarRefresh == Refresh.Auto) {
                window.requestAnimationFrame(this.UpdateScroll);
            }
            return 0;
        }
        private NoSelect = (e) => {
            e.preventDefault();
            return false;
        }
        private MousewheelScroll = (e: any) => {
            var delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                (e.detail && (e.detail > 0 ? -1 : 1));              // firefox
            this.RightScrollMove(delta * -1);
            return false;
        }
        private MousemoveMovefn = (e: any) => {
            try {
                if (this.scrollMoveType == MoveType.right) {
                    if (this.scrollBarRightLineNumber < this.scrollItemHeight) {
                        let margintop: number = this.scrollMarginTop;
                        let line: number = e.pageY - this.ypoint + margintop;
                        let upcolor = this.ArrowCss;
                        let downcolor = this.ArrowCss;
                        if (line < 0) {
                            line = 0;
                            upcolor = this.ArrowCssBackground;
                        }
                        if (this.arrowType == ArrowState.HasArrow) {
                            if (line > this.scrollItemHeight - this.scrollBarRightLineNumber - this.arrowRightHeight * 2) {
                                line = this.scrollItemHeight - this.scrollBarRightLineNumber - this.arrowRightHeight * 2;
                                downcolor = this.ArrowCssBackground;
                            }
                        } else {
                            if (line > this.scrollItemHeight - this.scrollBarRightLineNumber) {
                                line = this.scrollItemHeight - this.scrollBarRightLineNumber;
                                downcolor = this.ArrowCssBackground;
                            }
                        }
                        this.ArrowChangColor(angular.element(this.scrollBarArrowTop).children()[0], "border-bottom-color", upcolor);
                        this.ArrowChangColor(angular.element(this.scrollBarArrowBottom).children()[0], "border-top-color", downcolor);
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
                        let leftcolor = this.ArrowCss;
                        let rightcolor = this.ArrowCss;
                        if (line < 0) {
                            line = 0;
                            leftcolor = this.ArrowCssBackground;
                        }
                        if (this.arrowType == ArrowState.HasArrow) {
                            if (line > this.scrollItemWidth - this.scrollBarBottomLineNumber - this.arrowBottomHeight * 2) {
                                line = this.scrollItemWidth - this.scrollBarBottomLineNumber - this.arrowBottomHeight * 2;
                                rightcolor = this.ArrowCssBackground;
                            }
                        }
                        else {
                            if (line > this.scrollItemWidth - this.scrollBarBottomLineNumber) {
                                line = this.scrollItemWidth - this.scrollBarBottomLineNumber;
                                rightcolor = this.ArrowCssBackground;
                            }
                        }
                        this.ArrowChangColor(angular.element(this.scrollBarArrowRight).children()[0], "border-left-color", rightcolor);
                        this.ArrowChangColor(angular.element(this.scrollBarArrowLeft).children()[0], "border-right-color", leftcolor);
                        this.xpoint = e.pageX;
                        this.scrollMarginleft = line;
                        angular.element(this.scrollBarBottomLine).css("margin-left", line + "px");
                        angular.element(this.scrollbody).css("left", line * this.scrollBoxWidth / - this.scrollItemWidth + "px");
                    }
                }
                return false;
            } catch (e) {
                return false;
            }
        }
        private ArrowChangColor = (element: HTMLElement, style: string, color: string) => {
            angular.element(element).css(style, color);
        }
        private MousemoveSelectfn = (ex: any) => {
            this.xpoint = ex.pageX;
            this.ypoint = ex.pageY
            this.scrollMoveType = MoveType.right;
            angular.element(document).bind("selectstart", this.NoSelect);
            angular.element(document.body).addClass("noselect");
            angular.element(document).bind("mousemove", this.MousemoveMovefn);
        }
        private MousemoveSelectBtfn = (ex: any) => {
            this.xpoint = ex.pageX;
            this.ypoint = ex.pageY
            this.scrollMoveType = MoveType.bottom;
            angular.element(document).bind("selectstart", this.NoSelect);
            angular.element(document.body).addClass("noselect");
            angular.element(document).bind("mousemove", this.MousemoveMovefn);
        }
    }
    angular.module('scrollbar', []).directive("scroll", () => {
        return new ScrollbarEx("");
    }).service('ChangeScrollBar', function () {
        var _value= ScrollbarEx.ScrollBarList[ScrollbarEx.ScrollBarList.length - 1];
        return () => {
            _value.UpdateScroll();
        };
        //service code
    });
}