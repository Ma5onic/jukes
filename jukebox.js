const Nightmare = require('nightmare');
const nightmare = Nightmare({
  show: process.env.DEVELOP || false,
  openDevTools: process.env.DEVELOP || false
});
const spiritAnimals = require('spirit-animals');

if (process.env.DEVELOP) {
  const stdin = process.openStdin();

  stdin.addListener('data', function (data) {
    const argument = data.toString().trim();

    if (typeof module.exports[argument] === 'function') {
      console.log('running', argument);
      module.exports[argument]();
    }
  });
}

module.exports = {
  init: function () {
    const randomName = spiritAnimals.one().toLowerCase().replace('-');
    const roomUrl = 'http://jukebox.today/' + randomName;

    return nightmare
      .goto(roomUrl)
      .wait('.js-setup-privacy[data-privacy="unlisted"]')
      // Allow website JS to bind to DOM
      .wait(1000)
      .click('.js-setup-privacy[data-privacy="unlisted"]')
      // Inject depency directly because crossing the PIC is limited
      .inject('js', './node_modules/shuffle-array/dist/shuffle-array.min.js')
      .wait('.load-complete')
      .then(function () {
        return roomUrl;
      })
      .catch(function (error) {
        return 'Setting up the room failed :( ' + error;
      })
  },

  play: function () {
    return nightmare
      .evaluate(function () {
        sendRpc('play', {});
      })
      .then(function () {
        return 'Funky!';
      })
      .catch(function (error) {
        return 'Something is wrong with the connection...'
      })
  },

  pause: function () {
    return nightmare
      .evaluate(function () {
        sendRpc('pause', {});
      })
      .then(function () {
        return 'Paused.';
      })
      .catch(function (error) {
        return 'Something is wrong with the connection...'
      })
  },

  shuffle: function () {
    return nightmare
      .evaluate(function () {
        const songs = App.room._songs.models;

        // Get current playing song index
        const currentSongIndex = songs.findIndex(function (element) {
          return App.room.getCurrentSong() === element;
        });
        // Shuffle only the songs after the current playing song
        const shuffledSongs = shuffle(songs.slice(currentSongIndex + 1));

        // Concat the shuffled and original songs
        newSongs = songs.slice(0, currentSongIndex + 1).concat(shuffledSongs);

        // Clear the room of songs
        sendRpc('clear');

        // Add songs in the new order
        newSongs.forEach(function (song) {
          sendRpc('addSong', {
            song: song
          })
        });

        // Start playing the song that was active before shuffling
        sendRpc("goToIndex", {
          index: currentSongIndex
        });
      })
      .then(function () {
        return 'every day I\'m shufflin\'';
      })
      .catch(function (error) {
        return 'Have you got enough songs to shuffle?';
      });
  },

  connect: function (roomId) {
    const roomUrl = 'http://jukebox.today/' + roomId;
    
    return nightmare
      .goto(roomUrl)
      // Inject dependency directly because crossing the PIC is limited
      .inject('js', './node_modules/shuffle-array/dist/shuffle-array.min.js')
      .wait('.load-complete')
      .evaluate(function () {
        sendRpc('editUser', {
          id: App.me.get('id'),
          displayName: 'JukesBot'
        });
      })
      .then(function () {
        return 'connected to ', roomUrl;
      })
      .catch(function (error) {
        return 'Connecting to the room failed :( ' + error;
      })
  }
};
