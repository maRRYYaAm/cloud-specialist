# Cloud Specialist Task – Full Stack Infrastructure Deployment

This repository presents a complete infrastructure setup as required to build Such as:

* **WordPress (Apache2)**
* **Laravel (Nginx + PHP-FPM)**
* **Node.js (PM2 )**
* **GitHub Actions CI/CD**
* **Docker Compose**
* **Cloudflare for DNS, SSL, and Caching**

---

## Technology Stack

## Technologies 

| Technology                | Purpose                       | Folder               |
|---------------------------|-------------------------------|----------------------|
| WordPress (Apache2)       | Frontend Application          | ./wordpress-conf    |
| Laravel (Nginx + PHP-FPM) | API/backend logic             | ./laravel-conf      |
| Node.js + PM2             | Background workers or APIs    | ./nodejs-conf       |
| GitHub Actions            | Automation for Laravel        | ./github-pipeline   |
| Nginx (Dockerized)        | Wordpress+Mariadb+ Networking | ./docker            |
| Cloudflare                | HTTPS, caching, security      | ./README.md         |

---

## File Structure

```
REVPANDA/
├── docker/
│   ├── docker-compose.yml              # WordPress, MariaDB, Nginx proxy
|   └── docker.conf 
├── docs/
│   └── design.md                       # of design decisions
├── github-pipeline/
│   └── laravel.yaml                    # GitHub Actions pipeline for Laravel
├── images/
│   ├── fullMode.png                    # Cloudflare SSL mode reference
│   └── wordpress.png                   # wordpress Docker diagram
├── laravel-conf/
│   └── laravel.conf                    # Laravel Nginx + PHP-FPM configuration
├── nodejs-conf/
│   ├── ecosystem.config.js             # PM2 deployment config
│   └── node.conf                       #  Node.js Nginx Configurations
├── wordpress-conf/
│   └── wordpress.conf                  # Apache  configuration
└── README.md                           # This file
```

---
## Tools 
- Docker  
- Docker Compose  
- Apache2  
- Nginx  
- Laravel  
- Node.js  
- PM2    
- GitHub Actions  
- MariaDB  
- Cloudflare  
- Composer  
- Artisan  
- Linux (Ubuntu/Debian)
- README Generater
- Google Chromo 
- Copilot
- VS Code Extensions for specfic files 

---

## Setup & Run Instructions

### Prerequisites:

* Docker & Docker Compose installed
* GitHub account 


## Approach

* **Security-first configs**: All web servers block sensitive files and use best-practice headers
* **Real CI/CD**: Laravel pipeline includes composer install, `.env` handling, key generation, and testing
* **Platform modularity**: Each app can be scaled, restarted, or deployed independently
* **Production simulation**: PM2 and systemd demonstrate process daemonization for Node.js
* **Docker simplicity**: WordPress stack is using Compose with named volumes

---

## Refer to Full Practical Documentation

See [`docs/design.md`](docs/design.md) for a complete breakdown of all configuration decisions, design logic, and implementation strategies.
---
## Refer to Full Questions Detail
See [Assessment Questions (PDF)](../assesementQuestions.pdf)

---
## Note
Apache and Nginx configs are not fully tested in production.
Some tuning may be needed for better performance and security.

P.S.: Review before using in live setups.

---