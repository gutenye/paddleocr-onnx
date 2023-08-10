import path from 'path';
import sharp from 'sharp';
import { detect } from '../modules/detection';
import { MODEL_PATH } from '../constants/model';

export const testDet = async () => {
  const image = path.resolve(__dirname, '../src/test/test.png');
  const { descriptor, rects } = await detect({ input: image, modelPath: MODEL_PATH.DET_V4_TEACHER });

  // 获取原始图像
  const originalImage = sharp(image);

  // 使用 SVG 叠加绘制 box
  let svgOverlay = '<svg width="' + descriptor.width + '" height="' + descriptor.height + '">';
  for (const box of rects) {
    const [p1, p2, p3, p4] = box.rect;
    svgOverlay += `<polygon points="${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}" fill="none" stroke="red" stroke-width="1"/>`;
  }
  svgOverlay += '</svg>';

  const composite = [
    {
      input: Buffer.from(svgOverlay),
      top: 0,
      left: 0,
    },
  ];

  // 将 SVG 叠加到原始图像上
  originalImage.composite(composite).toFile('detRes.jpg');
};
