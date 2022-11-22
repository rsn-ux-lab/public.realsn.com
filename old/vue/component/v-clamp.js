(function () {
    var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

    var comp = Vue.component("v-clamp", {
        props: {
            tag: {
                type: String,
                default: 'div'
            },
            autoresize: {
                type: Boolean,
                default: false
            },
            maxLines: Number,
            maxHeight: [String, Number],
            ellipsis: {
                type: String,
                default: '…'
            },
            expanded: Boolean
        },
        data: function data() {
            return {
                offset: null,
                text: this.getText(),
                localExpanded: !!this.expanded
            };
        },

        computed: {
            clampedText: function clampedText() {
                return this.text.slice(0, this.offset) + this.ellipsis;
            },
            isClamped: function isClamped() {
                if (!this.text) {
                    return false;
                }
                return this.offset !== this.text.length;
            },
            realText: function realText() {
                return this.isClamped ? this.clampedText : this.text;
            },
            realMaxHeight: function realMaxHeight() {
                if (this.localExpanded) {
                    return null;
                }
                var maxHeight = this.maxHeight;

                if (!maxHeight) {
                    return null;
                }
                return typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight;
            }
        },
        watch: {
            expanded: function expanded(val) {
                this.localExpanded = val;
            },
            localExpanded: function localExpanded(val) {
                if (val) {
                    this.clampAt(this.text.length);
                } else {
                    this.update();
                }
                if (this.expanded !== val) {
                    this.$emit('update:expanded', val);
                }
            },

            isClamped: {
                handler: function handler(val) {
                    var _this = this;

                    this.$nextTick(function () {
                        return _this.$emit('clampchange', val);
                    });
                },

                immediate: true
            }
        },
        mounted: function mounted() {
            this.init();

            this.$watch(function (vm) {
                return [vm.maxLines, vm.maxHeight, vm.ellipsis, vm.isClamped].join();
            }, this.update);
            this.$watch(function (vm) {
                return [vm.tag, vm.text, vm.autoresize].join();
            }, this.init);
        },
        updated: function updated() {
            this.text = this.getText();
            this.applyChange();
        },
        beforeDestroy: function beforeDestroy() {
            this.cleanUp();
        },

        methods: {
            init: function init() {
                var _this2 = this;

                var contents = this.$slots.default;
                if (!contents) {
                    return;
                }

                this.offset = this.text.length;

                this.cleanUp();

                if (this.autoresize) {
                    resizeDetector.addListener(this.$el, this.update);
                    this.unregisterResizeCallback = function () {
                        resizeDetector.removeListener(_this2.$el, _this2.update);
                    };
                }
                this.update();
            },
            update: function update() {
                if (this.localExpanded) {
                    return;
                }
                this.applyChange();
                if (this.isOverflow() || this.isClamped) {
                    this.search();
                }
            },
            expand: function expand() {
                this.localExpanded = true;
            },
            collapse: function collapse() {
                this.localExpanded = false;
            },
            toggle: function toggle() {
                this.localExpanded = !this.localExpanded;
            },
            getLines: function getLines() {
                return Object.keys(Array.prototype.slice.call(this.$refs.content.getClientRects()).reduce(function (prev, _ref) {
                    var top = _ref.top;
                    var bottom = _ref.bottom;

                    var key = top + '/' + bottom;
                    if (!prev[key]) {
                        prev[key] = true;
                    }
                    return prev;
                }, {})).length;
            },
            isOverflow: function isOverflow() {
                if (!this.maxLines && !this.maxHeight) {
                    return false;
                }

                if (this.maxLines) {
                    if (this.getLines() > this.maxLines) {
                        return true;
                    }
                }

                if (this.maxHeight) {
                    if (this.$el.scrollHeight > this.$el.offsetHeight) {
                        return true;
                    }
                }
                return false;
            },
            getText: function getText() {
                // Look for the first non-empty text node
                var _filter = (this.$slots.default || []).filter(function (node) {
                    return !node.tag && !node.isComment;
                });

                var _filter2 = _slicedToArray(_filter, 1);

                var content = _filter2[0];

                return content ? content.text : '';
            },
            moveEdge: function moveEdge(steps) {
                this.clampAt(this.offset + steps);
            },
            clampAt: function clampAt(offset) {
                this.offset = offset;
                this.applyChange();
            },
            applyChange: function applyChange() {
                this.$refs.text.textContent = this.realText;
            },
            stepToFit: function stepToFit() {
                this.fill();
                this.clamp();
            },
            fill: function fill() {
                while ((!this.isOverflow() || this.getLines() < 2) && this.offset < this.text.length) {
                    this.moveEdge(1);
                }
            },
            clamp: function clamp() {
                while (this.isOverflow() && this.getLines() > 1 && this.offset > 0) {
                    this.moveEdge(-1);
                }
            },
            search: function search() {
                for (var _len = arguments.length, range = Array(_len), _key = 0; _key < _len; _key++) {
                    range[_key] = arguments[_key];
                }

                var _range$ = range[0];
                var from = _range$ === undefined ? 0 : _range$;
                var _range$2 = range[1];
                var to = _range$2 === undefined ? this.offset : _range$2;

                if (to - from <= 3) {
                    this.stepToFit();
                    return;
                }
                var target = Math.floor((to + from) / 2);
                this.clampAt(target);
                if (this.isOverflow()) {
                    this.search(from, target);
                } else {
                    this.search(target, to);
                }
            },
            cleanUp: function cleanUp() {
                if (this.unregisterResizeCallback) {
                    this.unregisterResizeCallback();
                }
            }
        },
        render: function render(h) {
            var contents = [h('span', this.$isServer ? {} : {
                ref: 'text',
                attrs: {
                    'aria-label': this.text.trim()
                }
            }, this.$isServer ? this.text : this.realText)];

            var expand = this.expand;
            var collapse = this.collapse;
            var toggle = this.toggle;

            var scope = {
                expand: expand,
                collapse: collapse,
                toggle: toggle,
                clamped: this.isClamped,
                expanded: this.localExpanded
            };
            var before = this.$scopedSlots.before ? this.$scopedSlots.before(scope) : this.$slots.before;
            if (before) {
                contents.unshift.apply(contents, _toConsumableArray(Array.isArray(before) ? before : [before]));
            }
            var after = this.$scopedSlots.after ? this.$scopedSlots.after(scope) : this.$slots.after;
            if (after) {
                contents.push.apply(contents, _toConsumableArray(Array.isArray(after) ? after : [after]));
            }
            var lines = [h('span', {
                style: {
                    boxShadow: 'transparent 0 0'
                },
                ref: 'content'
            }, contents)];
            return h(this.tag, {
                style: {
                    maxHeight: this.realMaxHeight,
                    overflow: 'hidden'
                }
            }, lines);
        }
    });
})();