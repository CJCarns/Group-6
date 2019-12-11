# Steps to populate your db with fake data
1. edit the ~/api/ormconfig.json file and fill in your db info
2. create the database you have named in ~/api/ormconfig.json
3. exeucte `npm install
4. execute `npm run fakedata
5. execute `npm run fakedata2
6. execute `npm run verify to make sure the math checks out between orders,
   order_items, and items
7. For postman testing, make sure that you do not add / alter the database as
   it may cause some of the tests to fail
