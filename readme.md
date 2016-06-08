# Jukes

Early alpha bot for [Jukebox](http://jukebox.today/).

Currently working for [Slack](https://slack.com/), looking into compatibility with [Mattermost](https://mattermost.org/) and [Matrix](https://matrix.org/). Since Jukebox has no API, Jukes makes use of [Nightmare](https://github.com/segmentio/nightmare) to interact with the page.

To run this you'll need some sort of display server, on a headless server this can be done with `xvfb` like so: `xvfb-run npm start`.
Then to use with Slack add a custom slash command with the URL set to where Juke runs.

## Features
Currently the bot can:
- Create a new room with a random name
- Play and pause the song
- Shuffle the order of the upcoming songs

### Planned features:
- Adding semi-random songs from [/r/listentothis](https://reddit.com/r/listentothis)
- Adjusting the volume (think of ramping it up and down gradually)
- Voting to skip the current song
