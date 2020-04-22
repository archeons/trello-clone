# Trello Clone Application

This application fully controlled by npm. 
1. You should consume the data of the fake API provided in this repository (see section 'Materials' below).
2. Create a single page that lists all columns with their respective cards.
3. Each column is defined by a title and the cards it contains,
4. Each card is defined by a mandatory title, an optional description and the column that it belongs to.
5. The user should be able to:
- display all columns with all cards,
- create a new card,
- modify a card,
- delete a card,
- add a column,
- modify a column,
- delete a column,
6. Search for any keywords presents on one or multiple cards. The view should update without reloading the whole page,
7. Drag and drop a card from one column to another,
8. Click on a card to see its description. The description should be in the same view and extend the card container. It should not open in another page or popup/modal.
9. Cards and columns should be unique (i.e we should not see 2 cards or 2 columns with the same title).

Command to start backend
- npm run json:server

Command to start frontend
- cd <folder_path>
- serve .

Pre-requisites to run serve:
- npm install -g serve

Frontend Server
- http://localhost:5000/

Backend Server
- http://localhost:3000/

To run Unit Test
- npm run test
