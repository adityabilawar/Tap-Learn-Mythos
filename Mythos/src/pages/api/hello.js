// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

export default async function handler(req, res) {

  const requestData = {
    tkn: '613E6B53-26C7-4B47-B2A4-83476DEC4A1F49A6F933-17F6-4DF5-9ABF-CA22AE806806',  // visit https://astica.ai
    modelVersion: '2.1_full', // 1.0_full, 2.0_full, or 2.1_full
    input: req.body.image,
    visionParams: 'describe, describe_all', // comma separated, defaults to all
    gpt_prompt: '', // only used if visionParams includes "gpt" or "gpt_detailed"
    prompt_length: 95 // number of words in GPT response
  };
  const myth = req.body.myth;
  
  axios({
      method: 'post',
      url: 'https://vision.astica.ai/describe',
      data: requestData,
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(async (response) => {
      const caption = response.data.caption.text;
      console.log(caption);
      await fetch('https://jamsapi.hackclub.dev/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer SNG7KZ2445NUUSNHAOGQGZJT75P6N1V1L83V0HD6KX7B9NQFAM1YGGRZ9CRX6DTL'
        },
        body: JSON.stringify({
          'model' : 'gpt-3.5-turbo',
          'messages': [
            {
              'role': 'user',
              'content': `The following is a description of a picture: ${caption}. Use this picture and turn it into a connection to ${myth} culture and describe an image that can relate the description of the picture to a picture involving ${myth} culture, traditions, and beliefs. ONLY enter a description of an image that can be sent to DALL-e as a translation of the image desciption to ${myth} culture. Keep it one to two sentences, and keep the description of the image detailed yet compact. Make sure it has everything to do with the gods for the specific mythology and meaning behind the original description of the image. Make an image that helps ${myth} people understand modern ideas and concepts.`
            }
          ]
        })
      }).then(result => result.json())
      .then(greekRes => {
        const imageDesc = greekRes.choices[0].message.content;
        console.log(imageDesc);
        fetch('https://jamsapi.hackclub.dev/openai/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + 'SNG7KZ2445NUUSNHAOGQGZJT75P6N1V1L83V0HD6KX7B9NQFAM1YGGRZ9CRX6DTL'
          },
          body: JSON.stringify({
            'model' : 'dall-e-3',
            'prompt': imageDesc,
            'size': '1024x1024',
            'n' : 1
          })
        }).then(result => result.json())
        .then(imageData => {
          console.log(imageData);
          res.status(200).json({ url: imageData.data[0].url, desc: imageDesc });
        });
      });
  }).catch((error) => {
      console.log(error);
  });
}


