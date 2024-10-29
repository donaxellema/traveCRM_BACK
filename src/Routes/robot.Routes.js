const express = require('express');
const { startDynamicCron } = require('../Controladores/botAsigna/botasignaController');

const router = express.Router();


let currentCronJob = null;
router.get ('/start-cron', async (req, res) => {
    // Detener cualquier cron existente antes de iniciar uno nuevo
    if (currentCronJob) {
        currentCronJob.stop();
        console.log('Previous cron job stopped');
    }

    // Iniciar el nuevo cron job
    currentCronJob = await startDynamicCron();

    if (currentCronJob) {
        res.send('Cron job started successfully');
    } else {
        res.status(500).send('Error starting cron');
    }
});


// Ruta para detener el cron
router.get('/stop-cron', (req, res) => {
    if (currentCronJob) {
        currentCronJob.stop();
        currentCronJob = null;
        console.log('Cron job stopped');
        res.send('Cron job stopped successfully');
    } else {
        res.status(400).send('No cron job is running');
    }
});


module.exports = router;
