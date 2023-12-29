import Image from 'next/image'
import { Playfair_Display } from 'next/font/google'
import axios from 'axios'
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useState } from 'react';
import { useSpeechSynthesis } from "react-speech-kit";

const pfd = Playfair_Display({ subsets: ['latin'] });

export default function Home() {

  const [imageData, setImageData] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageDesc, setImageDesc] = useState('');
  const [myth, setMyth] = useState('Greek');

  const { speak } = useSpeechSynthesis();

  function handleTakePhoto (dataUri) {
    setImageData(dataUri);
    axios.post('/api/hello', { image: dataUri, myth })
    .then(res => {
      console.log(res.data);
      setImageUrl(res.data.url);
      setImageDesc(res.data.desc);
      speak({ text: imageDesc })
    });
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <div className={`text-3xl #000000 ${pfd.className} m-8`}>
        MythoLens
      </div>

      {(imageData == '') && 
        <>
          <div className="flex justify-center gap-3">
            <div className={`text-lg #000000 ${pfd.className}`}>Your Mythology: </div>
            <input type="text" className="p-1 mb-3" onChange={(e) => setMyth(e.target.value)} value={myth} />
          </div>
          <Camera
            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
          />
        </>
      }
      {(imageUrl != '') && 
        <>
          <img src={imageUrl} alt="image" />
          <div className={`text-lg #000000 ${pfd.className} text-center max-w-[75%] m-5`}>{imageDesc}</div>
        </>
      }
      {((imageUrl === '') && (imageData != '')) && 
        <>
          <p>Loading...</p>
        </>
      }
    </div>
  )
}
