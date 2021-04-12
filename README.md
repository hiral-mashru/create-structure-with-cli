#	CLI commands

•	`framework init`

=>	It installs the whole folder structure with required configuration files in your system. It asks for database configuration whether developer wants to do or not. If yes then it asks for development or production field and according to that, it asks for database connection information like username, password, database name, etc… and generates database.json file in config folder. 

•	`framework create-module <MODULE_NAME>`

=>	It creates the module in api folder which consists of controllers, middlewares and service folders and each folder has a sample file with dummy data and also routes.json file.

•	`framework create-api`

=>	It creates the api. It asks for module name, in which developer wants to create an api and then it asks for path information like endpoint, HTTP method, controller file name and function name (separated by ‘.’), middleware file name and function name (separated by ‘.’ and middlewares separated by ‘,’), public or private endpoint, call from root or not, etc… It automatically creates routes.json file with given api’s data and also creates controller file and function, middleware and global middleware files and functions in given module’s folder which are specified by developer. If file already exists, then it appends the data.

•	`framework create-middleware`

=>	It creates middlewares. It asks for module name, in which developer wants to create a middleware and api name, in which this middleware will be used. Then it asks for middleware file name and function name (separated by ‘.’ and middlewares separated by ‘,’) and it creates files and functions in middlewares folder of given module’s folder, if file already exists, then it appends the data. It also adds the middlewares information provided by developer to routes.json.

•	`framework globalMiddleware`

=>	It creates global middlewares. It asks for module name, in which developer wants to create a global middleware and api name, in which this global middleware will be used. Then it asks for global middleware file name and function name (separated by ‘.’ and middlewares separated by ‘,’) and it creates files and functions in middlewares folder, if file already exists, then it appends the data. It also adds the global middlewares information provided by developer to routes.json.
 
•	`framework db-config`

=>	It asks for database configuration whether developer wants to do or not. If yes then it asks for development or production field and according to that, it asks for database connection information like username, password, database name, etc… and generates database.json file in config folder.

•	`framework help`

=>	It shows the list of commands and its use.
