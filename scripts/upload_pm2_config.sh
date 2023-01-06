#!/bin/bash
# ---------------------------------------
# Upload PM2 ecosystem file to API server
# This only works from my laptop, need to implement deploy from pm2 ecosystem file or github actions
# PARAMS
# 1 - ssh server name from config (API)
# ---------------------------------------


# send over the file
scp pm2/ecosystem.config.js api:/var/www/marketprofile.havehopeyo.com/

# reload pm2
ssh api 'pm2 reload all'
