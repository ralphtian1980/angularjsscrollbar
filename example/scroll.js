var angular;
var Scroll;
(function (Scroll) {
    var Display;
    (function (Display) {
        Display[Display["Default"] = 1] = "Default";
        Display[Display["OutFixedShow"] = 1] = "OutFixedShow";
        Display[Display["InFixedShow"] = 2] = "InFixedShow";
        Display[Display["InHide"] = 3] = "InHide";
        Display[Display["OutHide"] = 4] = "OutHide";
        Display[Display["InShow"] = 5] = "InShow";
        Display[Display["OutShow"] = 6] = "OutShow";
        Display[Display["OutFixedHide"] = 7] = "OutFixedHide";
        Display[Display["InFixedHide"] = 8] = "InFixedHide";
    })(Display || (Display = {}));
    var Overflow;
    (function (Overflow) {
        Overflow[Overflow["Default"] = 1] = "Default";
        Overflow[Overflow["Both"] = 1] = "Both";
        Overflow[Overflow["X"] = 2] = "X";
        Overflow[Overflow["Y"] = 3] = "Y";
    })(Overflow || (Overflow = {}));
    var MoveType;
    (function (MoveType) {
        MoveType[MoveType["right"] = 1] = "right";
        MoveType[MoveType["bottom"] = 2] = "bottom";
    })(MoveType || (MoveType = {}));
    var Scrollbar = (function () {
        function Scrollbar(modules) {
            var _this = this;
            this.MousemoveMovefn = function (e) {
                try {
                    if (_this.scrollMoveType == MoveType.right) {
                        if (_this.scrollBarRightLineNumber < _this.scrollItemHeight) {
                            var margintop = _this.scrollMarginTop;
                            var line = e.pageY - _this.ypoint + margintop;
                            if (line < 0) {
                                line = 0;
                            }
                            if (line > _this.scrollItemHeight - _this.scrollBarRightLineNumber) {
                                line = _this.scrollItemHeight - _this.scrollBarRightLineNumber;
                            }
                            _this.ypoint = e.pageY;
                            _this.scrollMarginTop = line;
                            angular.element(_this.scrollBarRightLine).css("margin-top", line + "px");
                            //this.scrollBarRightLine.style.marginTop = line + "px";
                            angular.element(_this.scrollbody).css("top", line * _this.scrollBoxHeight / -_this.scrollItemHeight + "px");
                        }
                    }
                    if (_this.scrollMoveType == MoveType.bottom) {
                        if (_this.scrollBarBottomLineNumber < _this.scrollBoxWidth) {
                            var marginleft = _this.scrollMarginleft;
                            var line = e.pageX - _this.xpoint + marginleft;
                            if (line < 0) {
                                line = 0;
                            }
                            if (line > _this.scrollItemWidth - _this.scrollBarBottomLineNumber) {
                                line = _this.scrollItemWidth - _this.scrollBarBottomLineNumber;
                            }
                            _this.xpoint = e.pageX;
                            _this.scrollMarginleft = line;
                            angular.element(_this.scrollBarBottomLine).css("margin-left", line + "px");
                            angular.element(_this.scrollbody).css("left", line * _this.scrollBoxWidth / -_this.scrollItemWidth + "px");
                        }
                    }
                    return false;
                }
                catch (e) {
                    return false;
                }
            };
            this.MouseOverInBodys = function (ex) {
                angular.element(document).bind("mousewheel DOMMouseScroll", _this.MousewheelScroll);
            };
            this.MouseleaveOutBodys = function (ex) {
                angular.element(document).unbind("mousewheel DOMMouseScroll", _this.MousewheelScroll);
            };
            this.MousewheelScroll = function (e) {
                if (_this.scrollBarRightLineNumber < _this.scrollItemHeight) {
                    var delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) ||
                        (e.detail && (e.detail > 0 ? -1 : 1)); // firefox
                    var margintop = _this.scrollMarginTop;
                    var line = delta * -2 + margintop;
                    if (line < 0) {
                        line = 0;
                    }
                    if (line > _this.scrollItemHeight - _this.scrollBarRightLineNumber) {
                        line = _this.scrollItemHeight - _this.scrollBarRightLineNumber;
                    }
                    _this.scrollMarginTop = line;
                    angular.element(_this.scrollBarRightLine).css("margin-top", line + "px");
                    angular.element(_this.scrollbody).css("top", line * _this.scrollBoxHeight / -_this.scrollItemHeight + "px");
                }
                return false;
            };
            this.MousemoveSelectfn = function (ex) {
                _this.xpoint = ex.pageX;
                _this.ypoint = ex.pageY;
                _this.scrollMoveType = MoveType.right;
                angular.element(document).bind("mousemove", _this.MousemoveMovefn);
            };
            this.MousemoveSelectBtfn = function (ex) {
                _this.xpoint = ex.pageX;
                _this.ypoint = ex.pageY;
                _this.scrollMoveType = MoveType.bottom;
                angular.element(document).bind("mousemove", _this.MousemoveMovefn);
            };
            this.MousemoveUnSelectfn = function (ex) {
                angular.element(document).unbind("mousemove", _this.MousemoveMovefn);
            };
            this.UpdateScroll = function () {
                if (_this.selfElement.offsetHeight != _this.scrollBoxHeight) {
                    angular.element(_this.scrollBarRightLine).unbind("mousedown", _this.MousemoveSelectfn);
                    _this.scrollBoxHeight = _this.selfElement.offsetHeight;
                    var scrollH = _this.scrollItemHeight;
                    var DomH = _this.selfElement.offsetHeight;
                    var ScrollNow = scrollH * scrollH / DomH;
                    if (ScrollNow > _this.scrollItemHeight) {
                        ScrollNow = _this.scrollItemHeight;
                    }
                    _this.scrollBarRightLineNumber = ScrollNow;
                    _this.scrollBarRightLine.style.height = ScrollNow + "px";
                    angular.element(_this.scrollBarRightLine).bind("mousedown", _this.MousemoveSelectfn);
                }
                if (_this.selfElement.offsetWidth != _this.scrollBoxWidth) {
                    angular.element(_this.scrollBarBottomLine).unbind("mousedown", _this.MousemoveSelectBtfn);
                    _this.scrollBoxWidth = _this.selfElement.offsetWidth;
                    var scrollH = _this.scrollItemWidth;
                    var DomH = _this.selfElement.offsetWidth;
                    var ScrollNow = scrollH * scrollH / DomH;
                    if (ScrollNow > _this.scrollItemWidth) {
                        ScrollNow = _this.scrollItemWidth;
                    }
                    _this.scrollBarBottomLineNumber = ScrollNow;
                    _this.scrollBarBottomLine.style.width = ScrollNow + "px";
                    angular.element(_this.scrollBarBottomLine).bind("mousedown", _this.MousemoveSelectBtfn);
                }
                var y = _this.selfElement;
                window.requestAnimationFrame(_this.UpdateScroll);
                return 0;
            };
            this.buildfunction = function () {
                var myself = _this;
                return {
                    controller: function ($scope, $element, $attrs) {
                        var t = function (e) {
                            e.preventDefault();
                            return false;
                        };
                        var f = function () {
                            var transclude = angular.element($element).find("ng-transclude");
                            var item = angular.element(transclude).children("div")[0];
                            var w = item.offsetWidth;
                            var h = item.offsetHeight;
                            var itemlist = (angular.element($element).children("div.selfElementCSS").children("div.selfElementCSS"));
                            myself.scrollbox = angular.element($element).children("div.scrollboxCSS")[0];
                            angular.element(myself.scrollbox).bind("mouseover", myself.MouseOverInBodys);
                            angular.element(myself.scrollbox).bind("mouseleave", myself.MouseleaveOutBodys);
                            angular.element(document).bind("mouseup", myself.MousemoveUnSelectfn);
                            for (var i = 0; i < itemlist.length; i++) {
                                if (angular.element(itemlist[i]).hasClass("scrollbodyCSS")) {
                                    myself.scrollbody = itemlist[i];
                                    myself.selfElement = angular.element(myself.scrollbody).children("div.selfElementCSS")[0];
                                }
                                if (angular.element(itemlist[i]).hasClass("scrollBarRightCSS")) {
                                    myself.scrollBarRight = itemlist[i];
                                    myself.scrollBarRightLine = angular.element(myself.scrollBarRight).children("div.scrollBarRightLineCSS")[0];
                                }
                                if (angular.element(itemlist[i]).hasClass("scrollBarBottomCSS")) {
                                    myself.scrollBarBottom = itemlist[i];
                                    myself.scrollBarBottomLine = angular.element(myself.scrollBarBottom).children("div.scrollBarBottomLineCSS")[0];
                                }
                            }
                            myself.scrollMarginTop = 0;
                            myself.scrollMarginleft = 0;
                            myself.UpdateScroll();
                            angular.element(myself.scrollBarRightLine).bind("dragstart", t);
                            angular.element(myself.scrollBarBottomLine).bind("dragstart", t);
                        };
                        angular.element().ready(f);
                    },
                    template: function ($scope, $element, $attrs) {
                        myself.scrollBoxStrWidth = $element.ngWidth;
                        myself.scrollBoxStrHeight = $element.ngHeight;
                        myself.scrollBoxWidth = myself.scrollItemWidth = parseInt(myself.scrollBoxStrWidth.replace("px", ""));
                        myself.scrollBoxHeight = myself.scrollItemHeight = parseInt(myself.scrollBoxStrHeight.replace("px", ""));
                        return '<div class="scrollShellCSS"><div class="scrollboxCSS" style="width:' + myself.scrollBoxStrWidth + '; height:' + myself.scrollBoxStrHeight + ';"><div class="scrollBarRightCSS" style="height: ' + myself.scrollBoxStrHeight + '; left: ' + myself.scrollBoxStrWidth + ';"><div class="scrollBarRightLineCSS" style="margin-top: 0px; height: 0px;"></div></div><div class="scrollBarBottomCSS" style="width: ' + myself.scrollBoxStrWidth + '; top: ' + myself.scrollBoxStrHeight + ';"><div class="scrollBarBottomLineCSS" style="margin-left: 0px; width: 0px;"></div></div><div class="scrollbodyCSS">' +
                            '<div class="selfElementCSS"><ng-transclude></ng-transclude>' +
                            '</div></div > </div></div>';
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
            };
            if (modules == undefined) {
                var app = angular.module("ScrollModule", []);
                app.directive("scroll", this.buildfunction);
            }
            else {
                modules.directive("scroll", this.buildfunction);
            }
        }
        return Scrollbar;
    })();
    Scroll.Scrollbar = Scrollbar;
})(Scroll || (Scroll = {}));
//# sourceMappingURL=scroll.js.map