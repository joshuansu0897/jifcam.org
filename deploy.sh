ssh mike@167.99.6.68 <<'ENDSSH'
cd /home/mike/jifcam-api-admin-website
git pull origin master
npm install
/home/mike/.nvm/versions/node/v12.12.0/bin/pm2 restart npm
ENDSSH
