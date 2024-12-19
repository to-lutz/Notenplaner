var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('dotenv').config();

/* POST getKursNote für mehrere Fächer. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    const { userid, semester, fachIds } = req.body;
    const results = [];

    // SQL-Abfrage, um alle Fächer und Noten auf einmal zu holen
    const queryFaecher = 'SELECT * FROM notenplaner.faecher WHERE userid = ? AND id IN (?)';
    const queryNoten = 'SELECT * FROM notenplaner.noten WHERE userid = ?  AND abiturrelevant=1 AND fachid IN (?) AND halbjahr = ?';

    // Hole die Fächer (einschließlich der abiturrelevanten Info)
    connection.query(queryFaecher, [userid, fachIds], (err, faecherRows) => {
        if (err) {
            return res.status(500).json({ status: 'Error', message: err.message });
        }

        // Hole die Noten für alle angefragten Fach-IDs und Semester
        connection.query(queryNoten, [userid, fachIds, semester], (err, notenRows) => {
            if (err) {
                return res.status(500).json({ status: 'Error', message: err.message });
            }

            // Verarbeite die Noten und ordne sie den Fächern zu
            fachIds.forEach(fachId => {
                // Hole das Fach und seine abiturrelevante Info
                const fach = faecherRows.find(f => f.id === fachId);
                if (!fach) {
                    results.push({
                        fachid: fachId,
                        status: 'Unknown',
                        note: 0,
                        abiturrelevant: 0
                    });
                    return;
                }

                // Filtere die Noten für dieses Fach
                const fachNoten = notenRows.filter(n => n.fachid === fachId);
                if (fachNoten.length === 0) {
                    results.push({
                        fachid: fachId,
                        status: 'Unknown',
                        note: 0,
                        abiturrelevant: fach.abiturrelevant
                    });
                } else {
                    // Berechne die Durchschnittsnote für das Fach
                    let noten = 0;
                    let gewichtungSum = 0;

                    fachNoten.forEach(row => {
                        noten += (row.notenpunkte * row.gewichtung);
                        gewichtungSum += row.gewichtung;
                    });

                    noten = noten / gewichtungSum;

                    results.push({
                        fachid: fachId,
                        status: 'Found',
                        note: noten,
                        abiturrelevant: fach.abiturrelevant
                    });
                }
            });

            // Gebe alle Ergebnisse zurück
            res.status(200).json(results);

            // Schließe die Verbindung
            connection.end();
        });
    });
});

module.exports = router;