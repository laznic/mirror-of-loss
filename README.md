
![Mirror of Loss](https://github.com/laznic/mirror-of-loss/blob/main/public/share-image.png)

## An AI powered WebGL experience, paying homage to Baldur's Gate 3 & Forgotten Realms

Mirror of Loss is a WebGL experience, and a Baldur's Gate 3 / Forgotten Realms fan project. It's powered by AI: all the sprites, textures, and imagery were generated via Stable Diffusion (some with the help of OpenAI & GPT-4), and background music by Stable Audio.

https://mirrorofloss.com

[Demo video](https://drive.google.com/file/d/1t9DJvSedcPtayNZb4--8g1-sm4P8X1wf/view)

> **Note**
>
> This project is optimized for desktop devices, and is a bit heavy on the GPU at times! Please bare with it, or alternatively run it locally to make it a bit smoother.

Built with
- [Supabase](https://supabase.com)
- [React](https://reactjs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Stable Diffusion](https://stability.ai/stable-diffusion)
- [Stable Audio](https://www.stableaudio.com/)
- [OpenAI](https://openai.com/)
  
## How it works

The steps are simple:
1. Start the game
2. Use WASD/Arrow keys to move in the map
   - Space jumps/elevates the camera
   - C key lowers the camera
4. Go in front of the Mirror
5. Type in a memory and wait 
6. Enjoy

You can go directly to https://mirrorofloss.com/void to see what kind of memories the mirror holds so far.

List of Supabase features used:
- Database
  - storing memory groups and memories, using PostGIS to spawn memory groups at random positions without too much overlapping
- Realtime
  - display created memories in real-time
- Functions
  - handles the memory generation via GPT-4 and SD 
- Storage
  - storing the memories

## Motivation

I'm a big fan of Baldur's Gate games, and especially been loving the latest installation. In it, they introduced this Mirror of Loss which just intrigues me. So naturally I wanted to do my own representation of it. I've also been planning to learn more about WebGL, so this seemed like a good chance to fiddle with it.


## Ideas for the future

- Error handling
- 3D models
  - now everything is mainly just pixel art due to not having enough time to make beautiful models
- More shaders
- Proper transitions between scenes
- Adjustments to lighting and other styles
- A lot of organization for the components and stuff
- Image optimization via Sharp(?)
  - now all image loading cause blinking and loading
- Also wanted to generate videos from the generated images, however didn't have time for that
  - https://replicate.com/stability-ai/stable-video-diffusion

## The team / contributors
- Niklas Lepistö ([GitHub](https://github.com/laznic), [Twitter](https://twitter.com/laznic))

<sup>Made for Supabase Launch Week X Hackathon.</sup> 

