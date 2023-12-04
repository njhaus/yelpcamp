import { Router } from "express";

// Router setup
const router = Router();

router.get('/', (req, res) => {
    res.render('about/about.ejs')
})

export default router;