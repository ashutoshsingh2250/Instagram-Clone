const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const postController = require('../controllers/posts');

//router.get('*', authMiddleware.checkUser);
router.post('/save', [authMiddleware.authUser, authMiddleware.checkUser], postController.save_post);
router.get('/all', [authMiddleware.authUser, authMiddleware.checkUser], postController.all_get);
router.get('/following', [authMiddleware.authUser, authMiddleware.checkUser], postController.following_get);
//router.get('/my', [authMiddleware.authUser, authMiddleware.checkUser], postController.my_get);
router.put('/like', [authMiddleware.authUser, authMiddleware.checkUser], postController.like_put);
router.put('/unlike', [authMiddleware.authUser, authMiddleware.checkUser], postController.unlike_put);
router.put('/comment', [authMiddleware.authUser, authMiddleware.checkUser], postController.comment_put);
router.delete('/delete/:postId', [authMiddleware.authUser, authMiddleware.checkUser], postController.deletepost_delete);
router.put('/edit/body', [authMiddleware.authUser, authMiddleware.checkUser], postController.edit_body_put);

module.exports = router;

