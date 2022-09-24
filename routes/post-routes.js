const express = require('express');

const post = require('../controllers/post-controller');
const checkAuth = require('../middleware/auth-middleware');

const router = express.Router();

router.get ('/api/posts', post.getAll);
router.get ('/api/posts/:post_id', post.getOne);
router.get ('/api/posts/:post_id/comments', post.getOneComments);
router.get ('/api/posts/:post_id/categories', post.getOneCategories);
router.get ('/api/posts/:post_id/like', post.getOneLikes);

router.post ('/api/posts', checkAuth, post.create); 
router.post ('/api/posts/:post_id/comments', checkAuth, post.createComment); 
router.post ('/api/posts/:post_id/like', checkAuth, post.createLike);

router.patch ('/api/posts/:post_id', checkAuth, post.update); 
router.delete ('/api/posts/:post_id', checkAuth, post.deleteOne); 
router.delete ('/api/posts/:post_id/like', checkAuth, post.deleteLike);

module.exports = router;