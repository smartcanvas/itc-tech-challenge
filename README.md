# itc-tech-challenge example web app #

### Requirements ####

- nodejs (npm, bower, grunt)

### Development environment setup ####

```
#!sh

echo Cloning main app
git clone https://github.com/smartcanvas/itc-tech-challenge.git itc-tech-challenge

cd itc-tech-challenge
npm install
bower install
```

### Running local server ####

```
#!sh

npm start
```

### Usage ####
- http://localhost:8005/app/#/company/new (create a new company)
- http://localhost:8005/app/#/company/COMPANY_ID/edit (edit an existing company)
- http://localhost:8005/app/#/companies (search for companies)