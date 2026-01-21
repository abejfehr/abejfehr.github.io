# abejfehr.github.io

## How to run (for myself)

```
bundle exec jekyll serve
```

## How I make the gifs from videos

```
rm -rf frames
mkdir frames
ffmpeg -i IMG_4976.MOV -vf "fps=15,scale=1200:-1:flags=lanczos" frames/frame_%04d.png
gifski -o IMG_4976.gif frames/frame_*.png --fps 15 --quality 70
```
