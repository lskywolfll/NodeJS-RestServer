const express = require('express');
const router = express();

router.use(require('./usuario'));
router.use(require('./login'));
router.use(require('./categorias'));
router.use(require('./producto'));
router.use(require('./uploads'));

module.exports= router;