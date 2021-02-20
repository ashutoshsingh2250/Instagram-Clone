const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/users');

//router.get('*', authMiddleware.checkUser);
router.post('/signup', userController.signup_post);

router.post('/signin', userController.signin_post);

router.get('/signout', authMiddleware.authUser, userController.signout_get);

router.get('/profile', [authMiddleware.authUser, authMiddleware.checkUser], userController.profile_get);

router.get('/user/:id', [authMiddleware.authUser, authMiddleware.checkUser], userController.view_a_user_get);

router.put('/user/follow', [authMiddleware.authUser, authMiddleware.checkUser], userController.follow_put);

router.put('/user/unfollow', [authMiddleware.authUser, authMiddleware.checkUser], userController.unfollow_put);

router.put('/profile/update/photo', [authMiddleware.authUser, authMiddleware.checkUser], userController.profile_update_photo_put);

module.exports = router;
