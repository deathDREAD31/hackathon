const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { ensureAuth, ensureVendor } = require('../middleware/auth');
const ctrl    = require('../controllers/menuController');

// configure multer to save to /public/uploads
const upload = multer({ dest: 'public/uploads/' });
router.use(ensureAuth, ensureVendor);

router.get('/vendor/items',       ctrl.list);
router.get('/vendor/items/new',   ctrl.getNew);
router.post('/vendor/items/new',  upload.single('image'), ctrl.postNew);

router.get('/vendor/items/:id/edit',  ctrl.getEdit);
router.post('/vendor/items/:id/edit', upload.single('image'), ctrl.postEdit);

router.post('/vendor/items/:id/delete', ctrl.delete);

module.exports = router;
