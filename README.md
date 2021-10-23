# DayToDayList

### It is a website simillar to ToDoList but the items are stored in online database (Atlas) and will be same for everyone accessing this link

## Steps to Run the server Locally 

1. For running the server on your PC you need to install [Nodejs](https://nodejs.org/en/) 
2. Clone the repository into your PC
3. Start with **npm init** in your terminal
4. Install the neccessary packages with commands. </br>
 **npm install express**</br>
 **npm install body-parser**</br>
 **npm install mongoose**
 5. Install [mongoDB](https://www.mongodb.com/) on your PC 
 6. Replace connection of Database with mongodb://localhost:27017/\<DataBase-Name\> in index.js file
 7. Type **node index.js** in your terminal to start your website
