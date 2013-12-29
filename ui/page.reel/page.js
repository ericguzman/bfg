/**
 * @module ui/page-navigator.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Welcome
 * @extends Component
 */
exports.Page = Component.specialize(/** @lends Welcome# */ {

  constructor: {
    value: function Page() {
      this.super();
    }
  },

  pageSlot: {
    value: null
  },

  content: {
    get: function() {
      return (this.pageSlot) ? this.pageSlot.content : null;
    },
    set: function(content) {
      if (this.pageSlot) {
        this.pageSlot.content = content;
      } else {
        console.log('no page slot');
      }
    }
  }

});
