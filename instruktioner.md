Swing notes API
Instruktioner
Du ska i denna övning göra ett API för att spara anteckningar. Du ska använda en authorizer för att skydda de endpoints som kräver API-nyckel.

Tekniker
API Gateway
Lambda
Dynamodb
Serverless framework
Endpoints
Alla endpoints ska vara skyddade av en API-nyckel.

Endpoint	Metod	Beskrivning
/api/notes/{username}	GET	Hämta anteckningar
/api/notes/{username}	POST	Spara en anteckning
/api/notes/{id}	PUT	Ändra en anteckning
/api/notes/{id}	DELETE	Ta bort en anteckning
Note - objekt

Nyckel	Värde	Beskrivning
id	String	Ett genererat ID för denna anteckning.
username	String	Användarnamn tillhörande den som sparade anteckningen
title	String	Titeln på anteckningen. Max 50 tecken.
text	String	Själva anteckningstexten, max 300 tecken.
createdAt	Date	När anteckningen skapades.
modifiedAt	Date	När anteckningen sist modifierades.
Felhantering
Alla API-resurser ska returnera JSON och en HTTP statuskod:

Det ska finnas felhantering exempelvis att man skickar in fel värden i body eller osv.

200 (OK) - Om servern lyckats med att göra det som resursen motsvarar.

400 (Bad request) - Om requestet är felaktigt gjort, så att servern inte kan fortsätta. Exempel: Att frontend skickar med felaktig data i body till servern.

404 (Not found) - Om resursen eller objektet som efterfrågas inte finns.

500 (internal server error) - Om ett fel inträffar på servern. Använd catch för att fånga det.