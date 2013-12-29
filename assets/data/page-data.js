var Montage = require("montage").Montage;
var Welcome = require("ui/pages/welcome.reel").Welcome;
var Blog = require("ui/pages/blog.reel").Blog;
var Social = require("ui/pages/social.reel").Social;
var About = require("ui/pages/about.reel").About;

/**
 @module "data/page-data.js"
 */


/**
 * @class PageData
 */
exports.PageData = {
  pages: [
    {
      'id': 'welcome',
      'module': Welcome,
      '3': 'about',
      '1': 'social',
      '2': 'blog'
    }, {
      'id': 'about',
      'module': About
    }, {
      'id': 'social',
      'module': Social
    }, {
      'id': 'blog',
      'module': Blog
    }
  ]
};