#!/bin/sh
echo "===================================="
<<<<<<< Updated upstream
echo "============  JARVIS   ============="
echo "===================================="
=======
echo "==========  JARVIS - PROD =========="
>>>>>>> Stashed changes
echo "===================================="

<<<<<<< Updated upstream
=======
# less `pwd`/node_modules/pm2/bin/pm2
echo `date`"STARTING JARVIS"
>>>>>>> Stashed changes
# npm install --save express
`pwd`/node_modules/pm2/bin/pm2 status
`pwd`/node_modules/pm2/bin/pm2 update
`pwd`/node_modules/pm2/bin/pm2 start `pwd`/jarvis.json

echo `date`"AFTER LAUNCHING"
