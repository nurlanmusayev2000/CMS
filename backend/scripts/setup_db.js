const sqlite3 = require( 'sqlite3' ).verbose();
const db = new sqlite3.Database( './cms.db', ( err ) =>
{
	if ( err )
	{
		console.error( 'Database Connection error:', err.message );
	} else
	{
		console.log( 'Connected to SQLite database' );
	}
} );

db.serialize( () =>
{
	db.run( `
       CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wordFirstLang TEXT NOT NULL,
            sentenceFirstLang TEXT,
            wordSecondLang TEXT NOT NULL,
            sentenceSecondLang TEXT
				)
		`);
	console.log( 'Words table created' );
} );

db.close();