import './App.css';
import { useState, useEffect, useRef } from 'react';
import ClickAwayListener from 'react-click-away-listener';

function App() {
  const [albums, setAlbums] = useState()
  const [showPopUp, setShowPopUp] = useState()
  const [playlistLink, setPlaylistLink] = useState()
  const [currentAlbum, setCurrentAlbum] = useState()
  const [playlistFile, setPlaylistFile] = useState({})
  const [checkedState, setCheckedState] = useState(
    new Array(0)
  );
  const formRef = useRef()

  useEffect(() => {
    fetch("http://192.168.1.45:5000/get-albums", {
      method: 'GET',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => setAlbums(data));
  }, []);

  function setPlaylistFileMap(id, list){
    playlistFile[id] = list
  }

  function handleOnChange(link){
    if (checkedState.includes(link)){
      checkedState.splice(checkedState.indexOf(link), 1)
    } else {
      checkedState.push(link)
    }
  }

  function decodeJsonAlbums(ggs){
    let tmpAlbumList = []
    for (let gg of ggs) {
      tmpAlbumList.push(JSON.parse(gg))
    }
    return tmpAlbumList
  }

  function explode(pl, pop, alb, event){
    event.preventDefault();
    // fetch("http://192.168.1.45:5000/playlist?playlist=" + playlistLink, {
    //   method: 'GET',
    //   mode: 'cors',
    //   headers: {
    //       'Content-Type': 'application/json'
    //   }
    // })
    // .then(res => setPlaylistInfo(res.json()))
    if(showPopUp === true){
      setShowPopUp(!pop)
    } else {
      setPlaylistLink(pl)
      setShowPopUp(pop)
      setCurrentAlbum(alb)
    }
  }

  function totalFormSumbit(){
    
    // checkedState.values.map(key => {
    //   if(playlistFile.values.includes(key)){
    //     alert("There is an entry in both")
    //   }
    // })

    // var merged = new Map(checkedState, playlistFile)

    console.log(JSON.stringify(playlistFile))

      fetch("http://192.168.1.45:5000/download", {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(playlistFile),
        headers: {
            'Content-Type': 'application/json'
        }
      });
  }

  return albums && (
    <div className="App">
      <form ref={formRef}>
      {decodeJsonAlbums(albums).map(album => 
      <div key={album.title}>
      Looking for {album.artist_name} - {album.title} - {album.track_list_count} tracks
      
      <table >
        <thead>
          <tr>
        <th> </th>
        <th>Channel name</th>
        <th>Playlist title</th>
        <th>Video count</th>
        <th>Link</th>
        </tr>
        </thead>
        <tbody>
        {album.playlist_result.map(playlist => 
                  <tr key={playlist.link}>
                  <td> <input type="radio"
                              // checked={setPlaylistFileMap(album.title, null)} 
                              onChange={() => setPlaylistFileMap(album.title, [playlist.link])}
                              id={playlist.link } 
                              name={ album.title } 
                              value={ playlist.link }/>
                  <label htmlFor={ playlist.link }></label> </td>
                  <td> { playlist.channel_name } </td>
                  <td> { playlist.title }</td>
                  <td>{ playlist.video_count }</td>
                  <td><a href={playlist.link }>youtube </a><button onClick={(e) => {explode(playlist.link, true, album, e)}}>Explode</button></td>
                  
                    {/* <!--<label htmlFor="{{ playlist.link }}">Got {{ playlist.channel_name }} {{ playlist.title }} {{ playlist.video_count }} <a href="{{ playlist.link }}">youtube</a></label> --> */}
                  </tr>
          
          )}
      </tbody>
      </table>
      
      </div>
      )}

</form>
        <button onClick={totalFormSumbit}>Submit</button>

        {showPopUp &&  
        // <ClickAwayListener onClickAway={() => explode(null, false)}>
        //   <PopUp playlistLink={playlistLink} setPlaylistFile={setPlaylistFile}/>
        // </ClickAwayListener>
        <PopUp playlistLink={playlistLink} album={currentAlbum} setPlaylistFile={setPlaylistFileMap} setShowPopUp={setShowPopUp}/>
      }



    </div>
  );
}

function PopUp({playlistLink, album, setPlaylistFile, setShowPopUp}){
  const [playlistInfo, setPlaylistInfo] = useState()
  useEffect(() => {
    fetch("http://192.168.1.45:5000/playlist?playlist=" + playlistLink, {
      method: 'GET',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => setPlaylistInfo(data));
  }, []);

  const [checkedState, setCheckedState] = useState(
    new Array(0)
  );

  function handleClick(event){
    event.preventDefault();
    setPlaylistFile(album.title, checkedState)
    setShowPopUp(false)
  }

  function handleOnChange(link){
    if (checkedState.includes(link)){
      checkedState.splice(checkedState.indexOf(link), 1)
    } else {
      checkedState.push(link)
    }
  }

  function getColour(title, album){
    //this requires a new endpoint in the BE to get the tracklist from the album ID

    
    // album.track_list.map(track => {
    //   if( title.contains(track)){
    //     return true
    //   }
    // })
    return false
  }

  return playlistInfo && (          
  <div className={'showPopUp'}>
      
      <form>
      {
      playlistInfo.videos.map(video => (
        <div key={"https://www.youtube.com/watch?v=" + video.id}>
        <li key={"https://www.youtube.com/watch?v=" + video.id}>
            <label htmlFor={"https://www.youtube.com/watch?v=" + video.id} >{video.title}</label> 
            <input  type="checkbox" 
                    id="findTimeItems" 
                    name="findTimeItems" 
                    value={"https://www.youtube.com/watch?v=" + video.id}
                    key={"https://www.youtube.com/watch?v=" + video.id}
                    checked={setCheckedState["https://www.youtube.com/watch?v=" + video.id]} 
                    onChange={() => handleOnChange("https://www.youtube.com/watch?v=" + video.id)}
                    
                    />
        </li>
        </div>
      ))}
      <button onClick={handleClick}>Add!</button>
      </form>
  </div>)
}

export default App;
