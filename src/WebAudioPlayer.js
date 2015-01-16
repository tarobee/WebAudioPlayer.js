/*
* @author tarobee / http://nakagami.asia/
*/

var WebAudioPlayer = function () {
  var _context, _audio, _analyser, _source;

  return {
    init: function (list, autoPlay, loop, btn) {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      _context = new AudioContext();
      
      this.util.list = list;
      this.util.index = 0;
      _audio = new Audio(this.util.soundFilePath + this.util.list[this.util.index]);

      _audio.addEventListener('loadstart', function() {
        var source = _context.createMediaElementSource(_audio);
        source.connect(_context.destination);
        source.connect(_analyser);
      }, false);

      _analyser = _context.createAnalyser();

      if(autoPlay) _audio.play();
    },

    getTimeDomainData: function(){
      var timeDomainData = new Uint8Array(256);
      _analyser.getByteTimeDomainData(timeDomainData);
      return timeDomainData;
    },

    getFrequencyData: function(){
      var frequencyData = new Uint8Array(256);
      _analyser.getByteFrequencyData(frequencyData);
      return frequencyData;
    },

    stop: function(){
      if(!_audio.ended) {
        _audio.pause();
        _audio.currentTime = 0;
      }
    },

    play: function(){
      _audio.play();
    },

    next: function(){
      this.util.index++;
      if(this.util.index > this.util.list.length - 1) {
        this.util.index = this.util.list.length - 1;
      }else{
        this.stop();
        _audio = new Audio(this.util.soundFilePath + this.util.list[this.util.index]);
        _audio.play();
      }
    },

    prev: function(){
      this.util.index--;
      if(this.util.index < 0) {
        this.util.index = 0;
      }else{
        this.stop();
        _audio = new Audio(this.util.soundFilePath + this.util.list[this.util.index]);
        _audio.play();
      }
    },

    pause: function(){
      _audio.pause();
    },

    analyser: function(){
      return _analyser;
    },

    util: {
      get audioFilePath() {
        return _path;
      },
      set audioFilePath(path) {
        _path = path;
      },
      get index() {
        return _index;
      },
      set index(i) {
        _index = i;
      },
      get list() {
        return _list;
      },
      set list(arr) {
        _list = arr;
      },
    }
  }
}