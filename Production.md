# Production setup recommendations

## Building and running in production

With [npm](https://www.npmjs.com/):
```
npm ci
npm run build
```

To preview locally:
```
npm run preview
```

To run in production as a [pm2](https://pm2.keymetrics.io/) job:
```
pm2 start
```

## Example nginx proxy configuration with cache

With this configuration, Javascript chunks are served directly by `nginx` without causing load on the node server. The chunks have to be copied to this directory after `npm run build` has finish, using a command such as `cp -r .nuxt/dist/client/* /srv/tijdloze-static`. As an additional advantage, the old chunks will still be available while a new build is in progress. 

```
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=1m max_size=1g;

log_format rt_cache '$remote_addr - $upstream_cache_status [$time_local; $request_time; $upstream_response_time]  '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';

log_format log_time '$remote_addr - $upstream_cache_status [$time_local; $request_time]  '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';

server {
  listen 443 ssl;
  listen [::]:443 ssl;
  server_name tijdloze.stijnshome.be www.tijdloze.stijnshome.be;

  ssl_certificate /etc/letsencrypt/live/tijdloze.stijnshome.be/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/tijdloze.stijnshome.be/privkey.pem;


  location /data/ {
    access_log /var/log/nginx/tijdloze-data.access.log log_time;
    
    alias /srv/tijdloze-data/;
  }

  location /_nuxt/ {
    access_log /var/log/nginx/tijdloze.static.access.log rt_cache;
    alias /srv/tijdloze-static/;
  }

  location / {
    access_log /var/log/nginx/tijdloze.access.log rt_cache;
    
    proxy_pass http://127.0.0.1:3000/;
    proxy_cache STATIC;
    proxy_cache_valid 200 60s;
    proxy_ignore_headers Cache-Control Expires;
    proxy_cache_lock on;
    proxy_cache_use_stale updating;
    proxy_cache_background_update on;
  }
}

server {
  listen 80;
  listen [::]:80;
  server_name tijdloze.stijnshome.be www.tijdloze.stijnshome.be;

  location /.well-known { 
    root /srv/httproot;
  }

  location / {
    return 301 https://$server_name$request_uri;
  }
}
```
