To access pgAdmin, you first need to start the service using the tools profile in Docker.

1. Start pgAdmin
   Run the following command in your terminal:
   1 docker compose --profile tools up -d pgadmin

2. Login to the Web Interface
   Open your browser and go to: http://localhost:5050 or http://192.168.100.189:5050

Use these credentials from your .env file to log in:

- Email: onan.thomas.08@gmail.com
- Password: QuestSecureTurtle

3. Connect to the QuestLab Database
   Once logged in, you need to add the server:
1. Right-click Servers > Register > Server...
1. General Tab:
   - Name: QuestLab DB
1. Connection Tab:
   - Host name/address: postgres (This is the internal Docker name)
   - Port: 5432
   - Maintenance database: questlab_db
   - Username: turtle_guide
   - Password: QuestSecureTurtle
1. Click Save.
