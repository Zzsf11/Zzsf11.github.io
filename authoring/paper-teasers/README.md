# Homepage paper teasers

These Remotion compositions produce the silent paper teasers for OmniAD, SurgCSS, StateFlow, and AlignGen. Each renders at 720 × 540 and 30 fps.

## Preview and render

```sh
npm ci
npm run dev
npm run lint
```

Open the Studio URL printed by Remotion and choose a paper from the composition list. Each paper’s scene and caption timings live in its own file under `src/`.

```sh
npx remotion render src/index.ts OmniAD out/omniad.mp4 --codec=h264 --pixel-format=yuv420p --crf=20 --muted
npx remotion render src/index.ts SurgCSS out/surgcss.mp4 --codec=h264 --pixel-format=yuv420p --crf=20 --muted
npx remotion render src/index.ts StateFlow out/stateflow.mp4 --codec=h264 --pixel-format=yuv420p --crf=20 --muted
npx remotion render src/index.ts AlignGen out/aligngen.mp4 --codec=h264 --pixel-format=yuv420p --crf=20 --muted
```

If Remotion's browser download is unavailable, pass `--browser-executable="/path/to/installed/chrome"` to the render commands.

## Paper assets

| Files in `public/media` | Source |
| --- | --- |
| `cashew*.jpg` | Fig. 1, [OmniAD: Intrinsic Anomaly Detection and Reasoning via Semantic Anomaly Encoding, v2](https://arxiv.org/html/2505.22039v2#S0.F1) |
| `patch-*.jpg` | Fig. 2, [OmniAD, v2](https://arxiv.org/html/2505.22039v2#S3.F2) |
| `inpaint-*.jpg` | Fig. 3, [Rethinking data imbalance in class-incremental surgical instrument segmentation](https://discovery.ucl.ac.uk/id/eprint/10212110/1/Hoque_Rethinking%20data%20imbalance%20in%20class%20incremental%20surgical%20instrument%20segmentation.pdf#page=5) |
| `blend-*.jpg`, `grasper.png`, `instrument-*.png` | Fig. 2, [Rethinking data imbalance in class-incremental surgical instrument segmentation](https://discovery.ucl.ac.uk/id/eprint/10212110/1/Hoque_Rethinking%20data%20imbalance%20in%20class%20incremental%20surgical%20instrument%20segmentation.pdf#page=4) |
| `stateflow/demo_amusement_*` | The reference photo, 3D preview, and final shot from the Amusement example in the [StateFlow project gallery](https://yuyangyin.github.io/StateFlow/). |
| `aligngen/*.webp` | The reference frog and three generated scenes from [AlignGen, Fig. 1](https://arxiv.org/html/2505.21911v1#S0.F1). The animated connections illustrate the alignment method in [Fig. 4](https://arxiv.org/html/2505.21911v1#S3.F4). |

The crops and cutouts derive from the paper figures. The tile movement, sample counts, and weight blocks are illustrations of each method. OmniAD's encoding grid uses the distinct Fig. 2 example. Its opening and ending use the Fig. 1 cashew.

## Poster frames

Use FFmpeg and Python with Pillow for WebP output. The StateFlow poster shows the transition into the 3D scene. The AlignGen poster pairs the moonlit guitar scene with the cyberpunk scene.

```sh
ffmpeg -ss 2 -i out/omniad.mp4 -frames:v 1 out/omniad-poster.png
ffmpeg -ss 7.35 -i out/surgcss.mp4 -frames:v 1 out/surgcss-poster.png
ffmpeg -i out/stateflow.mp4 -vf 'select=eq(n\,25)' -frames:v 1 out/stateflow-poster.png
ffmpeg -i out/aligngen.mp4 -vf 'select=eq(n\,247)' -frames:v 1 out/aligngen-poster.png
python -c 'from PIL import Image; [Image.open(f"out/{key}-poster.png").save(f"out/{key}.webp", quality=88) for key in ("omniad", "surgcss", "stateflow", "aligngen")]'
```
