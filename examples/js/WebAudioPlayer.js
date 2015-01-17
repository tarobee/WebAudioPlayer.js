/*
* @author tarobee / http://nakagami.asia/
*/

var WebAudioPlayer = function () {
  var _context, _audio, _analyser, _source, _loop, _soundFilePath, _index, _list, _currentTime, _duration;

  function _init(list, loop) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    _context = new AudioContext();
    
    _list = list;

    _loop = loop;

    _index = 0;
    _audio = new Audio(_soundFilePath + _list[_index]);

    _sourceConnect();
    _createAnalyser();
  }

  function _sourceConnect(){
    _audio.addEventListener('loadstart', function() {
      var source = _context.createMediaElementSource(_audio);
      source.connect(_context.destination);
      source.connect(_analyser);
    }, false);

    _audio.addEventListener('loadedmetadata', function() {
      _currentTime = _audio.currentTime;
      _duration = _audio.duration;
      console.log(_currentTime + " / " + _duration)
      console.log(_audio.volume)
    }, false);

    _audio.addEventListener('timeupdate',function() {
      _currentTime = _audio.currentTime;
      console.log(_currentTime + " / " + _duration)
    })

    _audio.addEventListener('ended', function() {
      _next();
    }, false);
  }

  function _createAudio() {
    _audio = new Audio(_soundFilePath + _list[_index]);
    _sourceConnect();
    _createAnalyser();
  }

  function _createAnalyser() {
    _analyser = _context.createAnalyser();
  }

  function _getTimeDomainData() {
    var timeDomainData = new Uint8Array(256);
    _analyser.getByteTimeDomainData(timeDomainData);
    return timeDomainData;
  }

  function _getFrequencyData() {
    var frequencyData = new Uint8Array(256);
    _analyser.getByteFrequencyData(frequencyData);
    return frequencyData;
  }

  function _stop() {
    if(!_audio.ended) {
      _audio.pause();
      _audio.currentTime = 0;
    }
  }

  function _play() {
    _audio.play();
  }

  function _next() {
    _index++;
    if(_index > _list.length - 1) {
      if(_loop) {
        _index = 0;
      }else{
        _index = _list.length - 1;
      }
    }
    _stop();
    _createAudio();
    _audio.play();
  }
  
  function _prev() {
    _index--;
    if(_index < 0) {
      if(_loop) {
        _index = _list.length - 1;
      }else{
        _index = 0;
      }
    }
    _stop();
    _createAudio();
    _audio.play();
  }

  function _pause() {
    _audio.pause();
  }

  function _analyser() {
    return _analyser;
  }

  function _isPlaying() {
    var _isPlaying;
    if(_audio.paused) {
      _isPlaying = false;
    }else{
      _isPlaying = true;
    }
    return _isPlaying;
  }

  function _setSoundFilePath(path) {
    _soundFilePath = path;
  }

  return {
    init: _init,

    sourceConnect: _sourceConnect,

    createAudio: _createAudio,

    createAnalyser: _createAnalyser,

    getTimeDomainData: _getTimeDomainData,

    getFrequencyData: _getFrequencyData,

    stop: _stop,

    play: _play,

    next: _next,

    prev: _prev,

    pause: _pause,

    analyser: _analyser,

    isPlaying: _isPlaying,

    setSoundFilePath: _setSoundFilePath
  }
}