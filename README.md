# Widget Marketplace
### Requirements
- MySQL or PostGres
- node version `v14.17.0`

### Installation
- install node dependencies `npm install`
- rename `.env.sample` to `.env` and setup database credentials
- run database migrations `npx sequelize-cli db:migrate`
- start the server `npm run dev`

### Testing
- Create a new database. 
	>If your database is called `widgets`, the database name should be named 	**`widgets_test`**
- run database migrations against the test database`npx sequelize-cli db:migrate --env=test`
- run tests `npm run test`

### Approach
#### Node + Express
Express Js was chosen for the following reasons
 - Lightweight but powerful enough to provide the functionality to build out a REST api. [Rails](https://rubyonrails.org/) or [laravel](https://laravel.com/) would have overkill
 - Express js is a series of [middleware](https://expressjs.com/en/guide/using-middleware.html#using-middleware). Middleware provides an elegant way to encapsulate validation and authorization logic
 - [Express-validator](https://express-validator.github.io/docs/) allows complex validation logic to be implemented in middleware
 
#### JWT
- Jwt authentication is easy to setup in express and is a typical approach when the front end that consumes the api is a single page application like React or Angular

#### MySQL
- Payment transactions are relational in nature, using a relational database is a given.
- [Sequelize](https://sequelize.org/docs/v6/) is an ORM for MySQL. It also allows database migrations to be created
- [Sequelize-typescript](https://github.com/sequelize/sequelize-typescript#readme) takes a step further by providing the typing required around database models

#### Database Design
The database design is based on the models outlined in the coding challenge. The only difference is in the `Transaction` model

##### Transaction model
- Was renamed to `PaymentTransaction` so its different from `Transaction` which could mean a database transaction in a MySQL context.
- `typeId` a payment transaction can either be a `debit` or `credit`
- `userId` a payment transaction belongs to one user. `sellerId` can be fetched through the `widget` association if needed. When a sale is made two payment transactions are created. One for the buyer and one for the seller. By calculating the total credit and debit transactions for a given user we can determine the users balance

#### Testing
- [Jest](https://jestjs.io/) is a javascript testing framework that is based on karma. Jest is sufficent for unit testing the api endpoints
