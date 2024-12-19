const express = require('express');
function getGradeFromPoints(points) {
    if (points >= 823) return 1.0;
    if (points >= 805) return 1.1;
    if (points >= 787) return 1.2;
    if (points >= 769) return 1.3;
    if (points >= 751) return 1.4;
    if (points >= 733) return 1.5;
    if (points >= 715) return 1.6;
    if (points >= 697) return 1.7;
    if (points >= 679) return 1.8;
    if (points >= 661) return 1.9;
    if (points >= 643) return 2.0;
    if (points >= 625) return 2.1;
    if (points >= 607) return 2.2;
    if (points >= 589) return 2.3;
    if (points >= 571) return 2.4;
    if (points >= 553) return 2.5;
    if (points >= 535) return 2.6;
    if (points >= 517) return 2.7;
    if (points >= 499) return 2.8;
    if (points >= 481) return 2.9;
    if (points >= 463) return 3.0;
    if (points >= 445) return 3.1;
    if (points >= 427) return 3.2;
    if (points >= 409) return 3.3;
    if (points >= 391) return 3.4;
    if (points >= 373) return 3.5;
    if (points >= 355) return 3.6;
    if (points >= 337) return 3.7;
    if (points >= 319) return 3.8;
    if (points >= 301) return 3.9;
    if (points == 300) return 4.0;
    return null; // Return null if points are out of range
}

const router = express.Router();

router.post('/', (req, res) => {
    let points = req.body.points;
    const grade = getGradeFromPoints(points);

    if (grade === null) {
        return res.status(400).json({ error: 'Invalid points value' });
    }

    res.json({
        points: points,
        date: new Date(),
        note: grade
    });
});

module.exports = router;