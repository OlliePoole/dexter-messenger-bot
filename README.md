![Header](https://i.imgur.com/qeg70Gz.png)

Dexter is a four legged, fury, musical companion who can help you discover new and exciting music. Dexter lives on Facebook Messenger as a bot ( although we don’t tell him that). Dexter creates Spotify playlists for any and every occasion, he looks at the music you listen to most to learn what you love to listen to.

### Why Dexter

Spotify has an amazing feature called a ‘Discover Weekly’ playlist, a new, auto-generated playlist every week based on what you like listening to. I created Dexter to help people discover more great music by enabling them to request themed playlists on-demand, whenever and however they like.

### Dexter’s Personality

I wanted Dexter to have a fun and likable personality so people enjoy interacting with him. Implementing this sets Dexter apart from other playlist generating web-tools and I believe results in a much more enjoyable experience interacting with Dexter.

Dexter has a sentiment-analysis module built in,  messages sent are analysed as Dexter likes to think he has ‘feelings’. Which also means any messages with a negative sentiment are met with a growl and a refusal to create the playlist.

### The Hack

I created the ‘application’ (don’t tell Dex I said that!) using Node.js and used the node module BotKit to create the Messenger integrations. Dexter communicates with the Spotify Web API to create he empty playlist, find the music you love, generate tracks based on these and finally fill the playlist with the new and existing music.

I won the Spotify sponsor prize for best use of the Spotify API. 
[![Twitter Image](https://pbs.twimg.com/media/Ch8UIq0WsAA5x2T.jpg)](https://twitter.com/hacksmiths/status/729323804795768832)
