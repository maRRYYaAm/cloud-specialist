# Design Document

This document outlines the technical Design of the following technologies

##### NOTE

All information is checked from the official page, GitHub sources. Check below the links.

---

## Technologies

| Technology                | Purpose                       | Folder             |
| ------------------------- | ----------------------------- | ------------------ |
| WordPress (Apache2)       | Frontend Application          | ../wordpress-conf  |
| Laravel (Nginx + PHP-FPM) | API/backend logic             | ../laravel-conf    |
| Node.js + PM2             | Background workers or APIs    | ../nodejs-conf     |
| GitHub Actions            | Automation for Laravel        | ../github-pipeline |
| Nginx (Dockerized)        | Wordpress+Mariadb+ Networking | ../docker          |
| Cloudflare                | HTTPS, caching, security      | ../README.md       |

---

## WordPress on Apache2

### Wordpress-conf

* Apache2: [https://httpd.apache.org/docs/2.4/new\_features\_2\_4.html](https://httpd.apache.org/docs/2.4/new_features_2_4.html)
* Apache config: [https://httpd.apache.org/docs/2.4/vhosts/examples.html](https://httpd.apache.org/docs/2.4/vhosts/examples.html)
* mod\_expires: [https://httpd.apache.org/docs/current/mod/mod\_expires.html#page-header](https://httpd.apache.org/docs/current/mod/mod_expires.html#page-header)
* mod\_deflate: [https://httpd.apache.org/docs/2.4/mod/mod\_deflate.html](https://httpd.apache.org/docs/2.4/mod/mod_deflate.html)
* Headers module: [https://httpd.apache.org/docs/2.4/mod/mod\_headers.html](https://httpd.apache.org/docs/2.4/mod/mod_headers.html)

### Setup

Optimized VirtualHost configurations with enhanced security and performance.

#### Features

* **GZIP**: Compress via `mod_deflate`
* **Browser Cache**: Handle by `mod_expires`
* **Security Headers**: X-Frames, X-XSS-Protection, etc.
* **Directory Access Restrictions**: Managed via `<Directory>` options
* **Logging**: Apache default directory with specified path

#### Configuration Steps

1. Copy `../wordpress-conf/wordpress.conf` to `/etc/apache2/sites-available/wordpress.conf`
2. Enable site and modules:

   ```bash
   sudo a2ensite wordpress.conf
   sudo a2enmod rewrite headers expires deflate
   sudo systemctl restart apache2
   ```
3. Create symlink:

   ```bash
   sudo ln -s /etc/apache2/sites-available/wordpress.conf /etc/apache2/sites-enabled/wordpress.conf
   ```

#### Permission Management

```bash
sudo chown -R www-data:www-data /var/www/html/wordpress
```

*Note: `www-data` can be changed in apache.conf as per user.*

SSL installation can be handled by pointing the domain and using Let's Encrypt.

---

## Laravel on Nginx + PHP-FPM

### References

* [https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)
* [https://docs.nginx.com/nginx/admin-guide/web-server/web-server/](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/)
* FastCGI: /etc/nginx/fastcgi.conf, [https://nginx.org/en/docs/http/ngx\_http\_fastcgi\_module.html](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html)
* GZIP: [https://nginx.org/en/docs/http/ngx\_http\_gzip\_module.html](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)

### Setup

Laravel app running on Nginx with PHP-FPM.

#### Features

* **PHP 8.1+** with FPM
* Laravel in `/var/www/laravel`
* `.env` file configured with DB and app settings

#### Nginx Configuration

1. Copy `../laravel-conf/laravel.conf` to `/etc/nginx/sites-available/`
2. Create symlink: `ln -s /etc/nginx/sites-available/laravel.conf /etc/nginx/sites-enabled/`
3. Test and restart:

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### Permission Management

```bash
sudo chown -R www-data:www-data /var/www/laravel
sudo chmod -R 775 /var/www/laravel/storage
sudo chmod -R 775 /var/www/laravel/bootstrap/cache
```

#### Security

* Deny access to `.env`, hidden files
* Include headers:

  * X-Frame-Options: SAMEORIGIN
  * X-Content-Type-Options: nosniff
  * X-XSS-Protection: 1; mode=block
  * Strict-Transport-Security
* Disable directory listing: `autoindex off`

#### Performance

* GZIP compression
* Cache static assets for 30 days
* Optimized FastCGI buffers

#### Routing

```nginx
try_files $uri $uri/ /index.php?$query_string;
```

#### Note

Configuration might be enhanced with extra security and upstream production setups.

---

## Node.js Deployment

### Links

* NVM Install: [https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)
* PM2: [https://pm2.keymetrics.io/docs/usage/application-declaration/](https://pm2.keymetrics.io/docs/usage/application-declaration/)
* Nginx Docs: [https://docs.nginx.com/nginx/admin-guide/web-server/web-server/](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/)

### Server Setup

* Install Node via NVM
* Use project directory: `/var/www/nodeapp/`
* Configure port and app (e.g. app.js or index.js)

#### PM2 Service

```bash
cd /var/www/nodeapp
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup  # Follow the printed command
```

#### Alternative

```bash
cd /var/www/nodeapp
pm2 start app.js --name nodeapp
pm2 save
pm2 startup
```

*PM2 Useful Commands:*

* `pm2 list`
* `pm2 log nodeapp`
* `pm2 restart nodeapp`
* `pm2 monit`

### Nginx Setup

```bash
cp ../nodejs-conf/node.conf /etc/nginx/sites-available/nginx-node.conf
ln -s /etc/nginx/sites-available/nginx-node.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Docker Compose Architecture

| Container | Image              |
| --------- | ------------------ |
| wordpress | `wordpress:latest` |
| mariadb   | `mariadb:latest`   |
| nginx     | `nginx:latest`     |

* Network: `wpnet`
* Volumes: `wp_data`, `db_data`

### References

* [https://hub.docker.com/\_/wordpress](https://hub.docker.com/_/wordpress)
* [https://github.com/mjstealey/wordpress-nginx-docker/blob/master/docker-compose.yml](https://github.com/mjstealey/wordpress-nginx-docker/blob/master/docker-compose.yml)
* [https://github.com/kurtcms/docker-compose-wordpress-nginx-mysql/blob/master/docker-compose.yml](https://github.com/kurtcms/docker-compose-wordpress-nginx-mysql/blob/master/docker-compose.yml)

---

## CI/CD (GitHub Actions)

### Pipeline Setup

* Laravel deployment workflow
* PHP 8.2: `shivammathur/setup-php`
* Composer with optimized flags
* Run tests using `php artisan test`

### Links

* [https://github.com/laravel-workflow/laravel-workflow/blob/master/.github/workflows/php.yml](https://github.com/laravel-workflow/laravel-workflow/blob/master/.github/workflows/php.yml)
* [https://laravel-news.com/laravel-ci-with-github-action](https://laravel-news.com/laravel-ci-with-github-action)
* [https://github.com/laravel/laravel/tree/12.x/.github/workflows](https://github.com/laravel/laravel/tree/12.x/.github/workflows)

#### Setup

1. Copy Laravel YAML to `.github/workflows`
2. Set server/IP/SSH as GitHub variables
3. Test in dev before production deployment

#### Local Compose Test

```bash
cd ../docker/
docker compose up --build
```

Check `conf` and `/etc/hosts` for `127.0.0.1 example.com`

*Image:* `![wordpressPage](../images/wordpress.png)`

---

## Cloudflare Setup

### Links

* SSL Modes: [https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
* Full Strict: [https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)

### Details

* SSL Mode: Full (Strict)
* HTTPS terminated at Cloudflare
* Nginx listens on internal HTTP
* DNS and caching handled externally


*Image:* `![Architecture Diagram](../images/fullMode.png)`

---

## Notes

* WordPress runs inside Docker
* Laravel and Node.js are non-containerized for clarity
* CI/CD logic is real and executable

---

End of Design Document.
